<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, onBeforeRouteLeave, RouterLink } from 'vue-router'
import { UserX } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { toast } from '@/components/ui/sonner'
import MemberForm from '@/components/members/MemberForm.vue'
import { useMemberStore } from '@/stores/members'
import {
  formValuesFromMember,
  buildUpdatePayload,
  emptyFormValues,
  type MemberFormValues,
} from '@/lib/member-payload'
import { todayIso } from '@/lib/date'
import type { ApiError } from '@/api/client'
import type { FieldErrors } from '@/types/member'

const props = defineProps<{ id: string }>()
const store = useMemberStore()
const router = useRouter()

onMounted(() => store.ensureLoaded())

const member = computed(() => store.getById(props.id))
const notFound = computed(() => store.hasLoaded && !store.error && !member.value)
const initial = computed<MemberFormValues>(() =>
  member.value ? formValuesFromMember(member.value) : emptyFormValues(todayIso()),
)

const submitting = ref(false)
const serverErrors = ref<FieldErrors>({})
const dirty = ref(false)
const saved = ref(false)

async function onSubmit(values: MemberFormValues) {
  if (submitting.value || !member.value) return
  submitting.value = true
  serverErrors.value = {}
  try {
    const payload = buildUpdatePayload(values, member.value)
    const updated = await store.update(member.value.id, payload)
    saved.value = true
    dirty.value = false
    toast.success('Changes saved', { description: `${updated.name} was updated.` })
    router.push({ name: 'member-detail', params: { id: updated.id } })
  } catch (err) {
    const apiError = err as ApiError
    serverErrors.value = apiError.fieldErrors ?? {}
    if (Object.keys(serverErrors.value).length === 0) {
      toast.error('Could not save changes', { description: apiError.message })
    } else {
      toast.error('Please fix the highlighted fields.')
    }
  } finally {
    submitting.value = false
  }
}

function onCancel() {
  router.push({ name: 'member-detail', params: { id: props.id } })
}

// Confirm navigation away with unsaved changes.
onBeforeRouteLeave(() => {
  if (dirty.value && !saved.value) {
    return window.confirm('You have unsaved changes. Leave without saving?')
  }
  return true
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader title="Edit member" :description="member ? `Editing ${member.name}` : undefined">
      <template #breadcrumb>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as-child><RouterLink :to="{ name: 'members' }">Members</RouterLink></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem v-if="member">
              <BreadcrumbLink as-child>
                <RouterLink :to="{ name: 'member-detail', params: { id } }">{{ member.name }}</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator v-if="member" />
            <BreadcrumbItem><BreadcrumbPage>Edit</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </template>
    </PageHeader>

    <LoadingSkeleton v-if="store.isLoading && !store.hasLoaded" variant="form" />

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
      <MemberForm
        mode="edit"
        :initial="initial"
        :server-errors="serverErrors"
        :submitting="submitting"
        @submit="onSubmit"
        @cancel="onCancel"
        @update:dirty="dirty = $event"
      />
    </Card>
  </div>
</template>
