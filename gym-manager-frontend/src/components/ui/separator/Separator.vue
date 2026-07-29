<script setup lang="ts">
import { Separator, type SeparatorProps } from 'reka-ui'
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<SeparatorProps & { class?: HTMLAttributes['class'] }>(),
  { orientation: 'horizontal', decorative: true },
)
const delegated = computed(() => {
  const { class: _c, ...rest } = props
  void _c
  return rest
})
</script>

<template>
  <Separator
    v-bind="delegated"
    :class="cn('shrink-0 bg-border', orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full', props.class)"
  />
</template>
