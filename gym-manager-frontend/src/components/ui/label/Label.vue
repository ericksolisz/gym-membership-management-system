<script setup lang="ts">
import { Label, type LabelProps } from 'reka-ui'
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()

const delegated = computed(() => {
  const { class: _cls, ...rest } = props
  void _cls
  return rest
})
</script>

<template>
  <Label
    v-bind="delegated"
    :class="
      cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        props.class,
      )
    "
  >
    <slot />
  </Label>
</template>
