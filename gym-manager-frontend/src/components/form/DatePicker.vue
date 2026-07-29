<script setup lang="ts">
import { computed, ref } from 'vue'
import { CalendarIcon } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { formatDateLong } from '@/lib/date'

const props = defineProps<{
  modelValue: string
  id?: string
  min?: string
  max?: string
  disabled?: boolean
  invalid?: boolean
  placeholder?: string
  ariaLabel?: string
}>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const open = ref(false)
const display = computed(() =>
  props.modelValue ? formatDateLong(props.modelValue) : props.placeholder || 'Select a date',
)

function onSelect(value: string) {
  emit('update:modelValue', value)
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <button
        :id="props.id"
        type="button"
        :disabled="props.disabled"
        :aria-invalid="props.invalid || undefined"
        :aria-label="props.ariaLabel"
        :class="
          cn(
            'flex h-9 w-full items-center justify-start gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-left text-sm shadow-sm ring-offset-background transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
            'aria-[invalid=true]:border-destructive',
            !props.modelValue && 'text-muted-foreground',
          )
        "
      >
        <CalendarIcon class="h-4 w-4 shrink-0 opacity-70" />
        <span class="truncate">{{ display }}</span>
      </button>
    </PopoverTrigger>
    <PopoverContent class="w-auto" align="start">
      <Calendar
        :model-value="props.modelValue"
        :min="props.min"
        :max="props.max"
        @update:model-value="onSelect"
      />
    </PopoverContent>
  </Popover>
</template>
