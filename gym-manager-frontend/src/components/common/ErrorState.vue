<script setup lang="ts">
import { AlertTriangle, RotateCw } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
const props = defineProps<{ title?: string; message?: string; retrying?: boolean }>()
defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-14 text-center">
    <div class="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
      <AlertTriangle class="h-5 w-5" />
    </div>
    <div class="max-w-md">
      <h3 class="text-sm font-semibold text-foreground">{{ props.title ?? 'Something went wrong' }}</h3>
      <p class="mt-1 text-sm text-muted-foreground">{{ props.message ?? 'We could not complete your request.' }}</p>
    </div>
    <Button variant="outline" size="sm" :disabled="props.retrying" @click="$emit('retry')">
      <RotateCw :class="['h-4 w-4', props.retrying && 'animate-spin']" />
      {{ props.retrying ? 'Retrying…' : 'Try again' }}
    </Button>
  </div>
</template>
