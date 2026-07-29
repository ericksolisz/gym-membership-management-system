<script setup lang="ts">
import { Label } from '@/components/ui/label'
const props = defineProps<{
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <Label :for="props.id" class="flex items-center gap-1">
      {{ props.label }}
      <span v-if="props.required" class="text-destructive" aria-hidden="true">*</span>
    </Label>
    <slot />
    <p v-if="props.hint && !props.error" class="text-xs text-muted-foreground">{{ props.hint }}</p>
    <p v-if="props.error" class="text-xs font-medium text-destructive" role="alert">{{ props.error }}</p>
  </div>
</template>
