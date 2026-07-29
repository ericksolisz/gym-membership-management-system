<script setup lang="ts">
import { type Component } from 'vue'
import { Inbox } from 'lucide-vue-next'
const props = defineProps<{ title: string; description?: string; icon?: Component }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-14 text-center">
    <div class="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <component :is="props.icon ?? Inbox" class="h-5 w-5" />
    </div>
    <div class="max-w-sm">
      <h3 class="text-sm font-semibold text-foreground">{{ props.title }}</h3>
      <p v-if="props.description" class="mt-1 text-sm text-muted-foreground">{{ props.description }}</p>
    </div>
    <div v-if="$slots.action" class="mt-1"><slot name="action" /></div>
  </div>
</template>
