<script setup lang="ts">
import { Dumbbell } from 'lucide-vue-next'
import { APP_NAME, APP_TAGLINE } from '@/lib/nav'
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
</script>

<template>
  <div class="flex items-center gap-2.5">
    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
      <Dumbbell class="h-[1.15rem] w-[1.15rem]" />
    </div>
    <div v-if="!compact" class="flex flex-col leading-none">
      <span class="text-sm font-semibold tracking-tight text-foreground">{{ APP_NAME }}</span>
      <span class="mt-0.5 text-[0.7rem] text-muted-foreground">{{ APP_TAGLINE }}</span>
    </div>
  </div>
</template>
