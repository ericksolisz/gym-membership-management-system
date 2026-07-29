<script setup lang="ts">
import { TabsList, type TabsListProps } from 'reka-ui'
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'
const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()
const delegated = computed(() => { const { class: _c, ...rest } = props; void _c; return rest })
</script>

<template>
  <TabsList v-bind="delegated" :class="cn('inline-flex h-9 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', props.class)">
    <slot />
  </TabsList>
</template>
