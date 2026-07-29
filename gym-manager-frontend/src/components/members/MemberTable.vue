<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-vue-next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import MembershipPlanBadge from './MembershipPlanBadge.vue'
import MemberStatusBadge from './MemberStatusBadge.vue'
import { formatDate } from '@/lib/date'
import { initials } from '@/lib/utils'
import type { SortDir, SortKey } from '@/lib/member-filters'
import type { Member } from '@/types/member'

const props = defineProps<{
  members: Member[]
  sortKey: SortKey
  sortDir: SortDir
  page: number
  pageCount: number
  from: number
  to: number
  total: number
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'sort', key: SortKey): void
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'view', member: Member): void
  (e: 'edit', member: Member): void
  (e: 'delete', member: Member): void
}>()

const columns: { key: SortKey; label: string; class?: string }[] = [
  { key: 'name', label: 'Member' },
  { key: 'plan', label: 'Plan' },
  { key: 'status', label: 'Status' },
  { key: 'joinedDate', label: 'Joined' },
]

const canPrev = computed(() => props.page > 1)
const canNext = computed(() => props.page < props.pageCount)
const isEmpty = computed(() => props.members.length === 0)
</script>

<template>
  <Card class="overflow-hidden">
    <slot name="filters" />

    <!-- Desktop table -->
    <div class="hidden md:block">
      <Table v-if="!isEmpty">
        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead
              v-for="col in columns"
              :key="col.key"
              :aria-sort="sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'"
            >
              <button
                type="button"
                class="-ml-1 inline-flex items-center gap-1 rounded px-1 py-0.5 font-medium uppercase tracking-wide transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                @click="emit('sort', col.key)"
              >
                {{ col.label }}
                <ArrowUp v-if="sortKey === col.key && sortDir === 'asc'" class="h-3.5 w-3.5" />
                <ArrowDown v-else-if="sortKey === col.key && sortDir === 'desc'" class="h-3.5 w-3.5" />
                <ChevronsUpDown v-else class="h-3.5 w-3.5 opacity-40" />
              </button>
            </TableHead>
            <TableHead class="w-14 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="member in members" :key="member.id" class="cursor-default">
            <TableCell>
              <div class="flex items-center gap-3">
                <Avatar class="h-9 w-9">
                  <AvatarFallback class="bg-muted text-xs font-medium text-muted-foreground">
                    {{ initials(member.name) }}
                  </AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <button
                    type="button"
                    class="block max-w-[16rem] truncate text-left text-sm font-medium text-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    @click="emit('view', member)"
                  >
                    {{ member.name }}
                  </button>
                  <p class="max-w-[16rem] truncate text-xs text-muted-foreground">{{ member.email }}</p>
                </div>
              </div>
            </TableCell>
            <TableCell><MembershipPlanBadge :plan="member.membershipPlan" /></TableCell>
            <TableCell><MemberStatusBadge :status="member.membershipStatus" /></TableCell>
            <TableCell class="whitespace-nowrap text-sm text-muted-foreground tabular-nums">
              {{ formatDate(member.joinedDate) }}
            </TableCell>
            <TableCell class="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon-sm" :aria-label="`Actions for ${member.name}`">
                    <MoreHorizontal class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem @select="emit('view', member)">
                    <Eye class="h-4 w-4" /> View
                  </DropdownMenuItem>
                  <DropdownMenuItem @select="emit('edit', member)">
                    <Pencil class="h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" @select="emit('delete', member)">
                    <Trash2 class="h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Empty (no results) -->
    <div v-if="isEmpty" class="p-2">
      <slot name="empty" />
    </div>

    <!-- Mobile list -->
    <ul class="divide-y divide-border md:hidden">
      <li v-for="member in members" :key="member.id" class="flex items-start gap-3 p-4">
        <Avatar class="h-10 w-10 shrink-0">
          <AvatarFallback class="bg-muted text-xs font-medium text-muted-foreground">
            {{ initials(member.name) }}
          </AvatarFallback>
        </Avatar>
        <div class="min-w-0 flex-1">
          <button
            type="button"
            class="block truncate text-left text-sm font-medium text-foreground"
            @click="emit('view', member)"
          >
            {{ member.name }}
          </button>
          <p class="truncate text-xs text-muted-foreground">{{ member.email }}</p>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <MembershipPlanBadge :plan="member.membershipPlan" />
            <MemberStatusBadge :status="member.membershipStatus" />
            <span class="text-xs text-muted-foreground">· Joined {{ formatDate(member.joinedDate) }}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon-sm" :aria-label="`Actions for ${member.name}`">
              <MoreHorizontal class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem @select="emit('view', member)"><Eye class="h-4 w-4" /> View</DropdownMenuItem>
            <DropdownMenuItem @select="emit('edit', member)"><Pencil class="h-4 w-4" /> Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" @select="emit('delete', member)"><Trash2 class="h-4 w-4" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    </ul>

    <!-- Pagination -->
    <div v-if="!isEmpty" class="flex flex-col items-center justify-between gap-3 border-t border-border p-3 sm:flex-row">
      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Rows per page</span>
        <Select
          :model-value="String(props.pageSize)"
          @update:model-value="emit('update:pageSize', Number($event))"
        >
          <SelectTrigger class="h-8 w-[4.5rem]" aria-label="Rows per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="n in ['10', '25', '50']" :key="n" :value="n">{{ n }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center gap-4">
        <p class="text-xs text-muted-foreground tabular-nums">
          {{ props.from }}–{{ props.to }} of {{ props.total }}
        </p>
        <div class="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            :disabled="!canPrev"
            @click="emit('update:page', props.page - 1)"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="!canNext"
            @click="emit('update:page', props.page + 1)"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  </Card>
</template>
