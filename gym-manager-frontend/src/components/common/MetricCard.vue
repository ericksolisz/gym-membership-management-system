<script setup lang="ts">
import { type Component } from 'vue'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const props = defineProps<{
  label: string
  value: number | string
  icon?: Component
  hint?: string
  /** Optional accent tint for the icon chip. */
  tone?: 'default' | 'emerald' | 'amber' | 'red' | 'blue' | 'gold'
}>()

const toneMap: Record<string, string> = {
  default: 'bg-muted text-muted-foreground',
  emerald: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  red: 'bg-red-500/12 text-red-600 dark:text-red-400',
  blue: 'bg-blue-500/12 text-blue-600 dark:text-blue-400',
  gold: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
}
</script>

<template>
  <Card class="p-4">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-sm font-medium text-muted-foreground">{{ props.label }}</p>
        <p class="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-foreground">{{ props.value }}</p>
        <p v-if="props.hint" class="mt-1 text-xs text-muted-foreground">{{ props.hint }}</p>
      </div>
      <div v-if="props.icon" :class="cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md', toneMap[props.tone ?? 'default'])">
        <component :is="props.icon" class="h-5 w-5" />
      </div>
    </div>
  </Card>
</template>
