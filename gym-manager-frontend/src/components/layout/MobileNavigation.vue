<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Menu } from 'lucide-vue-next'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { NAV_ITEMS } from '@/lib/nav'
import AppLogo from './AppLogo.vue'
import { cn } from '@/lib/utils'

const route = useRoute()
const open = ref(false)

// Close the drawer whenever navigation completes.
watch(() => route.fullPath, () => { open.value = false })

function isActive(item: (typeof NAV_ITEMS)[number]): boolean {
  const name = route.name as string
  if (name === item.to.name) return true
  return item.match?.includes(name) ?? false
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button variant="ghost" size="icon" class="lg:hidden" aria-label="Open navigation">
        <Menu class="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" class="w-72 p-0">
      <SheetHeader class="h-14 justify-center border-b border-border px-4">
        <SheetTitle class="text-left">
          <AppLogo />
        </SheetTitle>
      </SheetHeader>
      <nav class="flex flex-col gap-1 p-3" aria-label="Primary">
        <RouterLink
          v-for="item in NAV_ITEMS"
          :key="item.label"
          :to="item.to"
          :class="
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              isActive(item)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )
          "
          :aria-current="isActive(item) ? 'page' : undefined"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </SheetContent>
  </Sheet>
</template>
