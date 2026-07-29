<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import FormField from '@/components/common/FormField.vue'
import DatePicker from '@/components/form/DatePicker.vue'
import MemberStatusBadge from './MemberStatusBadge.vue'
import { todayIso } from '@/lib/date'
import { cn } from '@/lib/utils'
import { validateForm, type MemberFormValues } from '@/lib/member-payload'
import type { FieldErrors } from '@/types/member'

const props = defineProps<{
  mode: 'create' | 'edit'
  initial: MemberFormValues
  serverErrors?: FieldErrors
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', values: MemberFormValues): void
  (e: 'cancel'): void
  (e: 'update:dirty', dirty: boolean): void
}>()

const values = reactive<MemberFormValues>({ ...props.initial })
let snapshot = JSON.stringify(props.initial)
const clientErrors = ref<Record<string, string>>({})

// Re-sync when the initial values arrive/change (async load on edit).
watch(
  () => props.initial,
  (next) => {
    Object.assign(values, next)
    snapshot = JSON.stringify(next)
    clientErrors.value = {}
    emit('update:dirty', false)
  },
)

const isDirty = computed(() => JSON.stringify(values) !== snapshot)
watch(isDirty, (v) => emit('update:dirty', v))

function errorFor(field: string): string | undefined {
  return clientErrors.value[field] || props.serverErrors?.[field]
}

function clearError(field: string) {
  if (clientErrors.value[field]) {
    const next = { ...clientErrors.value }
    delete next[field]
    clientErrors.value = next
  }
}

const today = todayIso()

function onSubmit() {
  if (props.submitting) return
  const errors = validateForm(values, { requireJoinedDate: props.mode === 'create' })
  clientErrors.value = errors
  if (Object.keys(errors).length > 0) {
    // Focus the first invalid field for accessibility.
    const first = Object.keys(errors)[0]
    requestAnimationFrame(() => {
      document.getElementById(first)?.focus()
    })
    return
  }
  emit('submit', { ...values })
}
</script>

<template>
  <form novalidate class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <FormField id="name" label="Full name" :error="errorFor('name')" required>
        <Input
          id="name"
          v-model="values.name"
          autocomplete="name"
          placeholder="Jordan Rivera"
          :aria-invalid="!!errorFor('name')"
          @update:model-value="clearError('name')"
        />
      </FormField>

      <FormField id="email" label="Email" :error="errorFor('email')" required>
        <Input
          id="email"
          v-model="values.email"
          type="email"
          autocomplete="email"
          placeholder="jordan@example.com"
          :aria-invalid="!!errorFor('email')"
          @update:model-value="clearError('email')"
        />
      </FormField>

      <FormField id="address" label="Address" class="sm:col-span-2" :error="errorFor('address')" required>
        <textarea
          id="address"
          v-model="values.address"
          rows="2"
          autocomplete="street-address"
          placeholder="120 Market Street, Suite 4, Portland, OR 97204"
          :aria-invalid="!!errorFor('address') || undefined"
          :class="
            cn(
              'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive resize-none',
            )
          "
          @input="clearError('address')"
        ></textarea>
      </FormField>

      <FormField id="dateOfBirth" label="Date of birth" :error="errorFor('dateOfBirth')" required>
        <DatePicker
          id="dateOfBirth"
          v-model="values.dateOfBirth"
          :max="today"
          placeholder="Select date of birth"
          aria-label="Date of birth"
          :invalid="!!errorFor('dateOfBirth')"
          @update:model-value="clearError('dateOfBirth')"
        />
      </FormField>

      <!-- Create: joined date is editable. Edit: read-only (immutable). -->
      <FormField
        v-if="mode === 'create'"
        id="joinedDate"
        label="Joined date"
        :error="errorFor('joinedDate')"
        hint="Defaults to today. Immutable after creation."
        required
      >
        <DatePicker
          id="joinedDate"
          v-model="values.joinedDate"
          :max="today"
          placeholder="Select joined date"
          aria-label="Joined date"
          :invalid="!!errorFor('joinedDate')"
          @update:model-value="clearError('joinedDate')"
        />
      </FormField>
      <FormField v-else id="joinedDate" label="Joined date" hint="Immutable after creation.">
        <Input
          id="joinedDate"
          :model-value="values.joinedDate"
          readonly
          disabled
          aria-readonly="true"
        />
      </FormField>

      <FormField id="membershipPlan" label="Membership plan" :error="errorFor('membershipPlan')" required>
        <Select v-model="values.membershipPlan">
          <SelectTrigger id="membershipPlan" aria-label="Membership plan">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BASIC">Basic</SelectItem>
            <SelectItem value="PREMIUM">Premium</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <!-- Status: editable only when editing. -->
      <FormField v-if="mode === 'edit'" id="membershipStatus" label="Membership status" :error="errorFor('membershipStatus')">
        <Select v-model="values.membershipStatus">
          <SelectTrigger id="membershipStatus" aria-label="Membership status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PAUSED">Paused</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
    </div>

    <!-- Create-mode status notice -->
    <div
      v-if="mode === 'create'"
      class="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground"
    >
      <span>New members are created with status</span>
      <MemberStatusBadge status="ACTIVE" />
    </div>

    <Separator />

    <div class="flex items-center justify-end gap-2">
      <Button type="button" variant="outline" :disabled="props.submitting" @click="emit('cancel')">
        Cancel
      </Button>
      <Button type="submit" :disabled="props.submitting">
        <Loader2 v-if="props.submitting" class="h-4 w-4 animate-spin" />
        {{ mode === 'create' ? 'Create member' : 'Save changes' }}
      </Button>
    </div>
  </form>
</template>
