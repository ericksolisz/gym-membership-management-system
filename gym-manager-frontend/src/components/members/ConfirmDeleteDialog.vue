<script setup lang="ts">
import { Loader2, Trash2 } from 'lucide-vue-next'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { Member } from '@/types/member'

const props = defineProps<{
  open: boolean
  member: Member | null
  deleting?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}>()

function onOpenChange(value: boolean) {
  // Prevent closing mid-deletion.
  if (props.deleting) return
  emit('update:open', value)
}
</script>

<template>
  <AlertDialog :open="props.open" @update:open="onOpenChange">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete member</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete
          <span class="font-medium text-foreground">{{ member?.name }}</span>
          and cannot be undone. Their membership record will be removed.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button variant="outline" :disabled="props.deleting" @click="onOpenChange(false)">
          Cancel
        </Button>
        <Button variant="destructive" :disabled="props.deleting" @click="emit('confirm')">
          <Loader2 v-if="props.deleting" class="h-4 w-4 animate-spin" />
          <Trash2 v-else class="h-4 w-4" />
          {{ props.deleting ? 'Deleting…' : 'Delete member' }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
