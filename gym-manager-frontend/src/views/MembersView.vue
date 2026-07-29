<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, UserPlus, Search } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/sonner'
import MemberTable from '@/components/members/MemberTable.vue'
import MemberFilters from '@/components/members/MemberFilters.vue'
import ConfirmDeleteDialog from '@/components/members/ConfirmDeleteDialog.vue'
import { useMemberStore } from '@/stores/members'
import {
  applyFilters,
  paginate,
  defaultFilterState,
  type SortKey,
} from '@/lib/member-filters'
import type { Member } from '@/types/member'

const store = useMemberStore()
const router = useRouter()

const filters = reactive(defaultFilterState())
const page = ref(1)
const pageSize = ref(10)

onMounted(() => store.fetchAll(false))

// Reset to page 1 whenever the result set changes.
watch(
  () => [filters.search, filters.plan, filters.status, pageSize.value],
  () => {
    page.value = 1
  },
)

const filtered = computed(() => applyFilters(store.members, filters))
const paged = computed(() => paginate(filtered.value, page.value, pageSize.value))

// Keep the current page valid if the underlying list shrinks.
watch(
  () => paged.value.page,
  (valid) => {
    if (valid !== page.value) page.value = valid
  },
)

function onSort(key: SortKey) {
  if (filters.sortKey === key) {
    filters.sortDir = filters.sortDir === 'asc' ? 'desc' : 'asc'
  } else {
    filters.sortKey = key
    filters.sortDir = key === 'joinedDate' ? 'desc' : 'asc'
  }
}

function clearFilters() {
  Object.assign(filters, defaultFilterState())
}

function view(member: Member) {
  router.push({ name: 'member-detail', params: { id: member.id } })
}
function edit(member: Member) {
  router.push({ name: 'member-edit', params: { id: member.id } })
}

// Delete flow
const deleteTarget = ref<Member | null>(null)
const dialogOpen = ref(false)
const deleting = ref(false)

function askDelete(member: Member) {
  deleteTarget.value = member
  dialogOpen.value = true
}

async function confirmDelete() {
  if (!deleteTarget.value || deleting.value) return
  deleting.value = true
  try {
    await store.remove(deleteTarget.value.id)
    toast.success('Member deleted', { description: `${deleteTarget.value.name} was removed.` })
    dialogOpen.value = false
    deleteTarget.value = null
  } catch (err) {
    const e = err as { message?: string }
    toast.error('Delete failed', { description: e.message ?? 'Please try again.' })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader title="Members" description="Manage member records, plans, and statuses.">
      <template #actions>
        <Button @click="router.push({ name: 'member-create' })">
          <Plus class="h-4 w-4" /> Create member
        </Button>
      </template>
    </PageHeader>

    <LoadingSkeleton v-if="store.isLoading && !store.hasLoaded" variant="table" />

    <ErrorState
      v-else-if="store.error"
      message="We couldn't load the member list from the gateway."
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

    <MemberTable
      v-else
      :members="paged.items"
      :sort-key="filters.sortKey"
      :sort-dir="filters.sortDir"
      :page="paged.page"
      :page-count="paged.pageCount"
      :from="paged.from"
      :to="paged.to"
      :total="paged.total"
      :page-size="pageSize"
      @sort="onSort"
      @update:page="page = $event"
      @update:page-size="pageSize = $event"
      @view="view"
      @edit="edit"
      @delete="askDelete"
    >
      <template #filters>
        <MemberFilters
          v-model:search="filters.search"
          v-model:plan="filters.plan"
          v-model:status="filters.status"
          :result-count="filtered.length"
          :total-count="store.members.length"
          @clear="clearFilters"
        />
      </template>
      <template #empty>
        <EmptyState
          class="border-0"
          title="No members match your filters"
          description="Try adjusting or clearing your search and filters."
          :icon="Search"
        >
          <template #action>
            <Button variant="outline" size="sm" @click="clearFilters">Clear filters</Button>
          </template>
        </EmptyState>
      </template>
    </MemberTable>
  </div>

  <ConfirmDeleteDialog
    v-model:open="dialogOpen"
    :member="deleteTarget"
    :deleting="deleting"
    @confirm="confirmDelete"
  />
</template>
