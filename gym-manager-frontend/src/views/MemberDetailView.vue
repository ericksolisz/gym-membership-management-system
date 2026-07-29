<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Pencil, Trash2, Mail, MapPin, Cake, CalendarDays, UserX } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { toast } from '@/components/ui/sonner'
import MembershipPlanBadge from '@/components/members/MembershipPlanBadge.vue'
import MemberStatusBadge from '@/components/members/MemberStatusBadge.vue'
import ConfirmDeleteDialog from '@/components/members/ConfirmDeleteDialog.vue'
import { useMemberStore } from '@/stores/members'
import { formatDateLong, ageFromDob } from '@/lib/date'
import { initials } from '@/lib/utils'

const props = defineProps<{ id: string }>()
const store = useMemberStore()
const router = useRouter()

onMounted(() => store.ensureLoaded())

const member = computed(() => store.getById(props.id))
const notFound = computed(() => store.hasLoaded && !store.error && !member.value)
const age = computed(() => (member.value ? ageFromDob(member.value.dateOfBirth) : null))

const details = computed(() => {
  if (!member.value) return []
  return [
    { icon: Mail, label: 'Email', value: member.value.email },
    { icon: MapPin, label: 'Address', value: member.value.address },
    {
      icon: Cake,
      label: 'Date of birth',
      value: formatDateLong(member.value.dateOfBirth) + (age.value != null ? ` · ${age.value} yrs` : ''),
    },
    { icon: CalendarDays, label: 'Joined', value: formatDateLong(member.value.joinedDate) },
  ]
})

// Delete flow
const dialogOpen = ref(false)
const deleting = ref(false)

async function confirmDelete() {
  if (!member.value || deleting.value) return
  const name = member.value.name
  deleting.value = true
  try {
    await store.remove(member.value.id)
    toast.success('Member deleted', { description: `${name} was removed.` })
    router.push({ name: 'members' })
  } catch (err) {
    const e = err as { message?: string }
    toast.error('Delete failed', { description: e.message ?? 'Please try again.' })
    deleting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader :title="member?.name ?? 'Member'">
      <template #breadcrumb>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as-child><RouterLink :to="{ name: 'members' }">Members</RouterLink></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{{ member?.name ?? 'Detail' }}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </template>
      <template v-if="member" #actions>
        <Button variant="outline" @click="router.push({ name: 'member-edit', params: { id } })">
          <Pencil class="h-4 w-4" /> Edit
        </Button>
        <Button variant="outline" class="text-destructive hover:text-destructive" @click="dialogOpen = true">
          <Trash2 class="h-4 w-4" /> Delete
        </Button>
      </template>
    </PageHeader>

    <LoadingSkeleton v-if="store.isLoading && !store.hasLoaded" variant="detail" />

    <ErrorState
      v-else-if="store.error"
      message="We couldn't load this member from the gateway."
      :retrying="store.isLoading"
      @retry="store.fetchAll(true)"
    />

    <EmptyState
      v-else-if="notFound"
      title="Member not found"
      description="This member ID doesn't match any record. It may have been deleted."
      :icon="UserX"
    >
      <template #action>
        <Button variant="outline" @click="router.push({ name: 'members' })">Back to members</Button>
      </template>
    </EmptyState>

    <Card v-else-if="member" class="max-w-3xl p-5 sm:p-6">
      <div class="flex items-center gap-4">
        <Avatar class="h-14 w-14">
          <AvatarFallback class="bg-primary/10 text-base font-semibold text-primary">
            {{ initials(member.name) }}
          </AvatarFallback>
        </Avatar>
        <div class="min-w-0">
          <h2 class="truncate text-lg font-semibold text-foreground">{{ member.name }}</h2>
          <div class="mt-1.5 flex flex-wrap items-center gap-2">
            <MembershipPlanBadge :plan="member.membershipPlan" />
            <MemberStatusBadge :status="member.membershipStatus" />
          </div>
        </div>
      </div>

      <Separator class="my-5" />

      <dl class="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        <div v-for="d in details" :key="d.label" class="flex items-start gap-3">
          <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <component :is="d.icon" class="h-4 w-4" />
          </div>
          <div class="min-w-0">
            <dt class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ d.label }}</dt>
            <dd class="mt-0.5 break-words text-sm text-foreground">{{ d.value }}</dd>
          </div>
        </div>
      </dl>

      <Separator class="my-5" />
      <p class="font-mono text-xs text-muted-foreground">ID · {{ member.id }}</p>
    </Card>
  </div>

  <ConfirmDeleteDialog
    v-model:open="dialogOpen"
    :member="member ?? null"
    :deleting="deleting"
    @confirm="confirmDelete"
  />
</template>
