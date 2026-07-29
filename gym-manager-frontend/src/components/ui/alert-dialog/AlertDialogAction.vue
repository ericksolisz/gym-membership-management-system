<script setup lang="ts">
import { AlertDialogAction, type AlertDialogActionProps } from 'reka-ui'
import { type HTMLAttributes, computed } from 'vue'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
const props = defineProps<AlertDialogActionProps & { class?: HTMLAttributes['class'] }>()
const delegated = computed(() => { const { class: _c, ...rest } = props; void _c; return rest })
</script>

<template>
  <AlertDialogAction v-bind="delegated" :class="cn(buttonVariants(), props.class)">
    <slot />
  </AlertDialogAction>
</template>
