<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

/** Reusable loading skeletons, matched to the layout they replace. */
const props = withDefaults(
  defineProps<{ variant?: 'metrics' | 'table' | 'detail' | 'form'; rows?: number }>(),
  { variant: 'table', rows: 6 },
)
</script>

<template>
  <!-- Dashboard metric cards + distribution -->
  <div v-if="props.variant === 'metrics'" class="flex flex-col gap-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card v-for="i in 4" :key="i" class="p-4">
        <Skeleton class="h-4 w-24" />
        <Skeleton class="mt-3 h-7 w-16" />
      </Card>
    </div>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card class="p-5 lg:col-span-2">
        <Skeleton class="h-5 w-40" />
        <div class="mt-5 flex flex-col gap-4">
          <Skeleton v-for="i in 3" :key="i" class="h-8 w-full" />
        </div>
      </Card>
      <Card class="p-5">
        <Skeleton class="h-5 w-40" />
        <div class="mt-5 flex flex-col gap-3">
          <Skeleton v-for="i in 4" :key="i" class="h-10 w-full" />
        </div>
      </Card>
    </div>
  </div>

  <!-- Members data table -->
  <Card v-else-if="props.variant === 'table'" class="overflow-hidden">
    <div class="flex items-center gap-3 border-b border-border p-4">
      <Skeleton class="h-9 w-64" />
      <Skeleton class="h-9 w-32" />
      <Skeleton class="h-9 w-32" />
    </div>
    <div class="divide-y divide-border">
      <div v-for="i in props.rows" :key="i" class="flex items-center gap-4 p-4">
        <Skeleton class="h-9 w-9 rounded-full" />
        <div class="flex flex-1 flex-col gap-2">
          <Skeleton class="h-4 w-40" />
          <Skeleton class="h-3 w-56" />
        </div>
        <Skeleton class="hidden h-6 w-20 sm:block" />
        <Skeleton class="hidden h-6 w-20 md:block" />
        <Skeleton class="h-8 w-8" />
      </div>
    </div>
  </Card>

  <!-- Member detail -->
  <div v-else-if="props.variant === 'detail'" class="flex flex-col gap-6">
    <Card class="p-5">
      <div class="flex items-center gap-4">
        <Skeleton class="h-14 w-14 rounded-full" />
        <div class="flex flex-col gap-2">
          <Skeleton class="h-5 w-48" />
          <Skeleton class="h-4 w-64" />
        </div>
      </div>
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton v-for="i in 6" :key="i" class="h-12 w-full" />
      </div>
    </Card>
  </div>

  <!-- Form -->
  <Card v-else class="p-5">
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div v-for="i in 6" :key="i" class="flex flex-col gap-2">
        <Skeleton class="h-4 w-24" />
        <Skeleton class="h-9 w-full" />
      </div>
    </div>
    <div class="mt-6 flex gap-2">
      <Skeleton class="h-9 w-24" />
      <Skeleton class="h-9 w-24" />
    </div>
  </Card>
</template>
