<script setup lang="ts">
import { AvatarFallback } from 'reka-ui'
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AvatarFallback :class="cn('flex h-full w-full items-center justify-center rounded-full text-xs font-medium text-foreground', props.class)">
    <slot />
  </AvatarFallback>
</template>
