<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

/**
 * Self-contained, accessible month calendar.
 * Emits ISO YYYY-MM-DD strings; supports full keyboard navigation.
 */
const props = defineProps<{
  modelValue?: string
  min?: string
  max?: string
  class?: string
}>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function pad(n: number) {
  return String(n).padStart(2, '0')
}
function toIso(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`
}
function parse(iso?: string): { y: number; m: number; d: number } | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m: m - 1, d }
}

const today = new Date()
const initial = parse(props.modelValue) ?? {
  y: today.getFullYear(),
  m: today.getMonth(),
  d: today.getDate(),
}
const viewYear = ref(initial.y)
const viewMonth = ref(initial.m)
const gridRef = ref<HTMLDivElement | null>(null)

watch(
  () => props.modelValue,
  (val) => {
    const p = parse(val)
    if (p) {
      viewYear.value = p.y
      viewMonth.value = p.m
    }
  },
)

const todayIso = toIso(today.getFullYear(), today.getMonth(), today.getDate())

interface Cell {
  iso: string
  day: number
  inMonth: boolean
  disabled: boolean
}

const cells = computed<Cell[]>(() => {
  const y = viewYear.value
  const m = viewMonth.value
  const firstWeekday = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const result: Cell[] = []

  // Leading days from the previous month.
  const prevDays = new Date(y, m, 0).getDate()
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = prevDays - i
    const date = new Date(y, m - 1, day)
    result.push(makeCell(date, false))
  }
  for (let day = 1; day <= daysInMonth; day++) {
    result.push(makeCell(new Date(y, m, day), true))
  }
  // Trailing days to complete the final week row.
  while (result.length % 7 !== 0) {
    const last = result[result.length - 1]
    const p = parse(last.iso)!
    const date = new Date(p.y, p.m, p.d + 1)
    result.push(makeCell(date, false))
  }
  return result
})

function makeCell(date: Date, inMonth: boolean): Cell {
  const iso = toIso(date.getFullYear(), date.getMonth(), date.getDate())
  return { iso, day: date.getDate(), inMonth, disabled: isDisabled(iso) }
}

function isDisabled(iso: string): boolean {
  if (props.min && iso < props.min) return true
  if (props.max && iso > props.max) return true
  return false
}

const monthLabel = computed(() => `${MONTHS[viewMonth.value]} ${viewYear.value}`)

function shiftMonth(delta: number) {
  const d = new Date(viewYear.value, viewMonth.value + delta, 1)
  viewYear.value = d.getFullYear()
  viewMonth.value = d.getMonth()
}

function select(cell: Cell) {
  if (cell.disabled) return
  emit('update:modelValue', cell.iso)
}

// Roving-focus keyboard navigation.
function onKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLElement
  const iso = target?.dataset?.date
  if (!iso) return
  const p = parse(iso)
  if (!p) return
  let delta = 0
  switch (e.key) {
    case 'ArrowLeft': delta = -1; break
    case 'ArrowRight': delta = 1; break
    case 'ArrowUp': delta = -7; break
    case 'ArrowDown': delta = 7; break
    case 'Home': delta = -new Date(p.y, p.m, p.d).getDay(); break
    case 'End': delta = 6 - new Date(p.y, p.m, p.d).getDay(); break
    case 'PageUp': shiftMonth(-1); e.preventDefault(); return
    case 'PageDown': shiftMonth(1); e.preventDefault(); return
    default: return
  }
  e.preventDefault()
  const next = new Date(p.y, p.m, p.d + delta)
  const nextIso = toIso(next.getFullYear(), next.getMonth(), next.getDate())
  if (next.getMonth() !== viewMonth.value || next.getFullYear() !== viewYear.value) {
    viewYear.value = next.getFullYear()
    viewMonth.value = next.getMonth()
  }
  nextTick(() => {
    const el = gridRef.value?.querySelector<HTMLButtonElement>(`[data-date="${nextIso}"]`)
    el?.focus()
  })
}
</script>

<template>
  <div :class="cn('p-3 select-none', props.class)">
    <div class="flex items-center justify-between px-1 pb-3">
      <button
        type="button"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Previous month"
        @click="shiftMonth(-1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>
      <div class="text-sm font-medium" aria-live="polite">{{ monthLabel }}</div>
      <button
        type="button"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Next month"
        @click="shiftMonth(1)"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>

    <div class="grid grid-cols-7 gap-0.5 pb-1">
      <div
        v-for="w in WEEKDAYS"
        :key="w"
        class="flex h-7 items-center justify-center text-[0.7rem] font-medium text-muted-foreground"
      >
        {{ w }}
      </div>
    </div>

    <div ref="gridRef" class="grid grid-cols-7 gap-0.5" role="grid" @keydown="onKeydown">
      <button
        v-for="cell in cells"
        :key="cell.iso"
        type="button"
        role="gridcell"
        :data-date="cell.iso"
        :disabled="cell.disabled"
        :tabindex="cell.iso === props.modelValue || (!props.modelValue && cell.iso === todayIso) ? 0 : -1"
        :aria-selected="cell.iso === props.modelValue"
        :aria-current="cell.iso === todayIso ? 'date' : undefined"
        :class="
          cn(
            'flex h-8 w-8 items-center justify-center rounded-md text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            cell.inMonth ? 'text-foreground' : 'text-muted-foreground/50',
            !cell.disabled && 'hover:bg-accent hover:text-accent-foreground',
            cell.disabled && 'opacity-40 cursor-not-allowed',
            cell.iso === todayIso && cell.iso !== props.modelValue && 'ring-1 ring-inset ring-border',
            cell.iso === props.modelValue && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
          )
        "
        @click="select(cell)"
      >
        {{ cell.day }}
      </button>
    </div>
  </div>
</template>
