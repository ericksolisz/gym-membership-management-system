<script setup lang="ts">
import { computed } from 'vue'
import { CircleCheck, CirclePause, CircleX } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import type { MembershipStatus } from '@/types/member'

const props = defineProps<{ status: MembershipStatus }>()

// ACTIVE -> emerald, PAUSED -> amber, CANCELLED -> red.
const config = computed(() => (
  {
    ACTIVE: { variant: 'emerald' as const, label: 'Active', icon: CircleCheck },
    PAUSED: { variant: 'amber' as const, label: 'Paused', icon: CirclePause },
    CANCELLED: { variant: 'red' as const, label: 'Cancelled', icon: CircleX },
  }
)[props.status])
</script>

<template>
  <Badge :variant="config.variant">
    <component :is="config.icon" class="h-3.5 w-3.5" />
    {{ config.label }}
  </Badge>
</template>
