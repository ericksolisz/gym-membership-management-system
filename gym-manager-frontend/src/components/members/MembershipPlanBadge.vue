<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import type { MembershipPlan } from '@/types/member'

const props = defineProps<{ plan: MembershipPlan }>()

// BASIC -> zinc, PREMIUM -> blue, VIP -> gold (per design direction).
const variant = computed(() => (
  { BASIC: 'zinc', PREMIUM: 'blue', VIP: 'gold' } as const
)[props.plan])
const label = computed(() => (
  { BASIC: 'Basic', PREMIUM: 'Premium', VIP: 'VIP' }
)[props.plan])
</script>

<template>
  <Badge :variant="variant">{{ label }}</Badge>
</template>
