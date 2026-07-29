<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Users, CircleCheck, CirclePause, CircleX, Plus, UserPlus, ArrowRight } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import MetricCard from '@/components/common/MetricCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import MembershipPlanBadge from '@/components/members/MembershipPlanBadge.vue'
import { useMemberStore } from '@/stores/members'
import { formatDate } from '@/lib/date'
import { initials } from '@/lib/utils'

const store = useMemberStore()
const router = useRouter()

onMounted(() => {
  store.fetchAll(false)
})

const m = computed(() => store.metrics)

function pct(n: number): number {
  return m.value.total > 0 ? Math.round((n / m.value.total) * 100) : 0
}

const planSegments = computed(() => [
  { key: 'BASIC', label: 'Basic', value: m.value.plan.BASIC, color: 'bg-zinc-400 dark:bg-zinc-500' },
  { key: 'PREMIUM', label: 'Premium', value: m.value.plan.PREMIUM, color: 'bg-blue-500' },
  { key: 'VIP', label: 'VIP', value: m.value.plan.VIP, color: 'bg-yellow-400 dark:bg-yellow-500' },
])
const statusSegments = computed(() => [
  { key: 'ACTIVE', label: 'Active', value: m.value.status.ACTIVE, color: 'bg-emerald-500' },
  { key: 'PAUSED', label: 'Paused', value: m.value.status.PAUSED, color: 'bg-amber-500' },
  { key: 'CANCELLED', label: 'Cancelled', value: m.value.status.CANCELLED, color: 'bg-red-500' },
])
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader title="Dashboard" description="Overview of your membership base.">
      <template #actions>
        <Button @click="router.push({ name: 'member-create' })">
          <Plus class="h-4 w-4" /> New member
        </Button>
      </template>
    </PageHeader>

    <LoadingSkeleton v-if="store.isLoading && !store.hasLoaded" variant="metrics" />

    <ErrorState
      v-else-if="store.error"
      message="We couldn't load member data from the gateway."
      :retrying="store.isLoading"
      @retry="store.fetchAll(true)"
    />

    <EmptyState
      v-else-if="store.isEmpty"
      title="No members yet"
      description="Create your first member to start tracking memberships and plans."
      :icon="UserPlus"
    >
      <template #action>
        <Button @click="router.push({ name: 'member-create' })">
          <Plus class="h-4 w-4" /> Create member
        </Button>
      </template>
    </EmptyState>

    <template v-else>
      <!-- Metric cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total members" :value="m.total" :icon="Users" />
        <MetricCard label="Active" :value="m.status.ACTIVE" :icon="CircleCheck" tone="emerald" :hint="`${pct(m.status.ACTIVE)}% of members`" />
        <MetricCard label="Paused" :value="m.status.PAUSED" :icon="CirclePause" tone="amber" :hint="`${pct(m.status.PAUSED)}% of members`" />
        <MetricCard label="Cancelled" :value="m.status.CANCELLED" :icon="CircleX" tone="red" :hint="`${pct(m.status.CANCELLED)}% of members`" />
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <!-- Distribution -->
        <Card class="p-5 lg:col-span-2">
          <h2 class="text-sm font-semibold text-foreground">Membership distribution</h2>
          <p class="mt-0.5 text-sm text-muted-foreground">Derived from {{ m.total }} members.</p>

          <div class="mt-6 flex flex-col gap-6">
            <div>
              <div class="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>By plan</span>
              </div>
              <div class="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  v-for="seg in planSegments"
                  :key="seg.key"
                  :class="seg.color"
                  :style="{ width: pct(seg.value) + '%' }"
                  class="h-full first:rounded-l-full last:rounded-r-full"
                ></div>
              </div>
              <div class="mt-3 grid grid-cols-3 gap-2">
                <div v-for="seg in planSegments" :key="seg.key" class="flex items-center gap-2">
                  <span :class="seg.color" class="h-2.5 w-2.5 shrink-0 rounded-sm"></span>
                  <span class="text-sm text-muted-foreground">{{ seg.label }}</span>
                  <span class="ml-auto text-sm font-medium tabular-nums text-foreground">{{ seg.value }}</span>
                </div>
              </div>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>By status</span>
              </div>
              <div class="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  v-for="seg in statusSegments"
                  :key="seg.key"
                  :class="seg.color"
                  :style="{ width: pct(seg.value) + '%' }"
                  class="h-full first:rounded-l-full last:rounded-r-full"
                ></div>
              </div>
              <div class="mt-3 grid grid-cols-3 gap-2">
                <div v-for="seg in statusSegments" :key="seg.key" class="flex items-center gap-2">
                  <span :class="seg.color" class="h-2.5 w-2.5 shrink-0 rounded-sm"></span>
                  <span class="text-sm text-muted-foreground">{{ seg.label }}</span>
                  <span class="ml-auto text-sm font-medium tabular-nums text-foreground">{{ seg.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <!-- Recently joined -->
        <Card class="flex flex-col p-5">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-foreground">Recently joined</h2>
            <RouterLink
              :to="{ name: 'members' }"
              class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowRight class="h-3 w-3" />
            </RouterLink>
          </div>
          <ul class="mt-4 flex flex-col gap-1">
            <li v-for="member in m.recent" :key="member.id">
              <RouterLink
                :to="{ name: 'member-detail', params: { id: member.id } }"
                class="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar class="h-8 w-8 shrink-0">
                  <AvatarFallback class="bg-muted text-xs font-medium text-muted-foreground">
                    {{ initials(member.name) }}
                  </AvatarFallback>
                </Avatar>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-foreground">{{ member.name }}</p>
                  <p class="truncate text-xs text-muted-foreground">Joined {{ formatDate(member.joinedDate) }}</p>
                </div>
                <MembershipPlanBadge :plan="member.membershipPlan" />
              </RouterLink>
            </li>
          </ul>
        </Card>
      </div>
    </template>
  </div>
</template>
