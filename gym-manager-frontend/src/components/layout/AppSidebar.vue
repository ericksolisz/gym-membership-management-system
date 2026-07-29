<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { NAV_ITEMS } from '@/lib/nav'
import AppLogo from './AppLogo.vue'
import { cn } from '@/lib/utils'

const route = useRoute()

function isActive(item: (typeof NAV_ITEMS)[number]): boolean {
  const name = route.name as string
  if (name === item.to.name) return true
  return item.match?.includes(name) ?? false
}

const items = computed(() => NAV_ITEMS)
</script>

<template>
  <aside class="hidden w-60 shrink-0 flex-col border-r border-border bg-card lg:flex">
    <div class="flex h-14 items-center border-b border-border px-4">
      <AppLogo />
    </div>
    <nav class="flex flex-1 flex-col gap-1 p-3" aria-label="Primary">
      <RouterLink
        v-for="item in items"
        :key="item.label"
        :to="item.to"
        :class="
          cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isActive(item)
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )
        "
        :aria-current="isActive(item) ? 'page' : undefined"
      >
        <component :is="item.icon" class="h-[1.15rem] w-[1.15rem] shrink-0" />
        <span class="truncate">{{ item.label }}</span>
      </RouterLink>
    </nav>
    <div class="border-t border-border p-3">
      <p class="px-3 text-xs text-muted-foreground">Gateway · port 4004</p>
    </div>
  </aside>
</template>
