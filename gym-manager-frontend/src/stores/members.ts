import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { membersApi } from '@/api/members'
import { toApiError, type ApiError } from '@/api/client'
import { computeMetrics } from '@/lib/member-filters'
import type {
  CreateMemberRequest,
  Member,
  UpdateMemberRequest,
} from '@/types/member'

export const useMemberStore = defineStore('members', () => {
  const members = ref<Member[]>([])
  const isLoading = ref(false)
  const error = ref<ApiError | null>(null)
  const hasLoaded = ref(false)
  // Guards against duplicate concurrent mutations.
  const isMutating = ref(false)

  const metrics = computed(() => computeMetrics(members.value))
  const isEmpty = computed(() => hasLoaded.value && members.value.length === 0)

  function getById(id: string): Member | undefined {
    return members.value.find((m) => m.id === id)
  }

  /** GET /api/members. Set force=false to reuse an already-loaded list. */
  async function fetchAll(force = true): Promise<void> {
    if (!force && hasLoaded.value) return
    isLoading.value = true
    error.value = null
    try {
      members.value = await membersApi.list()
      hasLoaded.value = true
    } catch (err) {
      error.value = toApiError(err)
    } finally {
      isLoading.value = false
    }
  }

  /** Ensure the list is loaded (used by detail/edit routes that deep-link). */
  async function ensureLoaded(): Promise<void> {
    if (!hasLoaded.value && !isLoading.value) {
      await fetchAll(true)
    }
  }

  async function create(payload: CreateMemberRequest): Promise<Member> {
    if (isMutating.value) throw { status: null, message: 'A request is already in progress.', fieldErrors: {} } as ApiError
    isMutating.value = true
    try {
      const created = await membersApi.create(payload)
      // No optimistic mutation: re-fetch authoritative state after success.
      await fetchAll(true)
      return getById(created.id) ?? created
    } catch (err) {
      throw toApiError(err)
    } finally {
      isMutating.value = false
    }
  }

  async function update(id: string, payload: UpdateMemberRequest): Promise<Member> {
    if (isMutating.value) throw { status: null, message: 'A request is already in progress.', fieldErrors: {} } as ApiError
    isMutating.value = true
    try {
      const updated = await membersApi.update(id, payload)
      await fetchAll(true)
      return getById(id) ?? updated
    } catch (err) {
      throw toApiError(err)
    } finally {
      isMutating.value = false
    }
  }

  async function remove(id: string): Promise<void> {
    if (isMutating.value) throw { status: null, message: 'A request is already in progress.', fieldErrors: {} } as ApiError
    isMutating.value = true
    try {
      await membersApi.remove(id)
      // Only remove from local state after the API confirms 204.
      members.value = members.value.filter((m) => m.id !== id)
    } catch (err) {
      throw toApiError(err)
    } finally {
      isMutating.value = false
    }
  }

  function reset(): void {
    members.value = []
    hasLoaded.value = false
    error.value = null
    isLoading.value = false
    isMutating.value = false
  }

  return {
    members,
    isLoading,
    error,
    hasLoaded,
    isMutating,
    metrics,
    isEmpty,
    getById,
    fetchAll,
    ensureLoaded,
    create,
    update,
    remove,
    reset,
  }
})
