<script setup lang="ts">
import { DropdownMenuLabel, type DropdownMenuLabelProps } from 'reka-ui'
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'
const props = defineProps<DropdownMenuLabelProps & { class?: HTMLAttributes['class'] }>()
const delegated = computed(() => { const { class: _c, ...rest } = props; void _c; return rest })
</script>

<template>
  <DropdownMenuLabel v-bind="delegated" :class="cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', props.class)">
    <slot />
  </DropdownMenuLabel>
</template>
