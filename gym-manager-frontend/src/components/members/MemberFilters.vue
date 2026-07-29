<script setup lang="ts">
import { computed } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { MembershipPlan, MembershipStatus } from '@/types/member'

const props = defineProps<{
  search: string
  plan: MembershipPlan | 'ALL'
  status: MembershipStatus | 'ALL'
  resultCount: number
  totalCount: number
}>()

const emit = defineEmits<{
  (e: 'update:search', v: string): void
  (e: 'update:plan', v: MembershipPlan | 'ALL'): void
  (e: 'update:status', v: MembershipStatus | 'ALL'): void
  (e: 'clear'): void
}>()

const hasActiveFilters = computed(
  () => props.search.trim() !== '' || props.plan !== 'ALL' || props.status !== 'ALL',
)
</script>

<template>
  <div class="flex flex-col gap-3 border-b border-border p-3 sm:flex-row sm:items-center sm:gap-2">
    <div class="relative flex-1 sm:max-w-xs">
      <Search class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        :model-value="props.search"
        type="search"
        placeholder="Search name or email…"
        aria-label="Search members"
        class="pl-8"
        @update:model-value="emit('update:search', String($event))"
      />
    </div>

    <div class="flex items-center gap-2">
      <Select
        :model-value="props.plan"
        @update:model-value="emit('update:plan', $event as MembershipPlan | 'ALL')"
      >
        <SelectTrigger class="w-[8.5rem]" aria-label="Filter by plan">
          <SelectValue placeholder="Plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All plans</SelectItem>
          <SelectItem value="BASIC">Basic</SelectItem>
          <SelectItem value="PREMIUM">Premium</SelectItem>
          <SelectItem value="VIP">VIP</SelectItem>
        </SelectContent>
      </Select>

      <Select
        :model-value="props.status"
        @update:model-value="emit('update:status', $event as MembershipStatus | 'ALL')"
      >
        <SelectTrigger class="w-[9rem]" aria-label="Filter by status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="PAUSED">Paused</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Button
        v-if="hasActiveFilters"
        variant="ghost"
        size="sm"
        class="text-muted-foreground"
        @click="emit('clear')"
      >
        <X class="h-4 w-4" />
        Clear
      </Button>
    </div>

    <p class="text-xs text-muted-foreground sm:ml-auto sm:whitespace-nowrap">
      <span class="font-medium text-foreground tabular-nums">{{ props.resultCount }}</span>
      of
      <span class="tabular-nums">{{ props.totalCount }}</span>
      members
    </p>
  </div>
</template>
