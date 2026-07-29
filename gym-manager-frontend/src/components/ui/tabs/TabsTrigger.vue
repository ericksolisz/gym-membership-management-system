<script setup lang="ts">
import { TabsTrigger, type TabsTriggerProps } from 'reka-ui'
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'
const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes['class'] }>()
const delegated = computed(() => { const { class: _c, ...rest } = props; void _c; return rest })
</script>

<template>
  <TabsTrigger
    v-bind="delegated"
    :class="cn('inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm', props.class)"
  >
    <slot />
  </TabsTrigger>
</template>
