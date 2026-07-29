<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import { Card } from '@/components/ui/card'
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
import { emptyFormValues, buildCreatePayload, type MemberFormValues } from '@/lib/member-payload'
import { todayIso } from '@/lib/date'
import type { ApiError } from '@/api/client'
import type { FieldErrors } from '@/types/member'

const store = useMemberStore()
const router = useRouter()

const initial = emptyFormValues(todayIso())
const submitting = ref(false)
const serverErrors = ref<FieldErrors>({})

async function onSubmit(values: MemberFormValues) {
  if (submitting.value) return
  submitting.value = true
  serverErrors.value = {}
  try {
    const created = await store.create(buildCreatePayload(values))
    toast.success('Member created', { description: `${created.name} is now active.` })
    router.push({ name: 'member-detail', params: { id: created.id } })
  } catch (err) {
    const apiError = err as ApiError
    serverErrors.value = apiError.fieldErrors ?? {}
    if (Object.keys(serverErrors.value).length === 0) {
      toast.error('Could not create member', { description: apiError.message })
    } else {
      toast.error('Please fix the highlighted fields.')
    }
  } finally {
    submitting.value = false
  }
}

function onCancel() {
  router.push({ name: 'members' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader title="Create member" description="Add a new member to the system.">
      <template #breadcrumb>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as-child><RouterLink :to="{ name: 'members' }">Members</RouterLink></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>New</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </template>
    </PageHeader>

    <Card class="max-w-3xl p-5 sm:p-6">
      <MemberForm
        mode="create"
        :initial="initial"
        :server-errors="serverErrors"
        :submitting="submitting"
        @submit="onSubmit"
        @cancel="onCancel"
      />
    </Card>
  </div>
</template>
