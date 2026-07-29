<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
const props = defineProps<{ colspan?: number; class?: HTMLAttributes['class'] }>()
</script>

<template>
  <tr>
    <td :colspan="props.colspan ?? 1" :class="cn('p-0', props.class)">
      <div class="flex items-center justify-center py-10 text-sm text-muted-foreground">
        <slot />
      </div>
    </td>
  </tr>
</template>
