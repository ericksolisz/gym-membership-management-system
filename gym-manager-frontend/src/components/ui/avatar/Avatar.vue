<script setup lang="ts">
import { AvatarRoot } from 'reka-ui'
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AvatarRoot :class="cn('relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted', props.class)">
    <slot />
  </AvatarRoot>
</template>
