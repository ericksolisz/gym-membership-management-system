<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import AppSidebar from './AppSidebar.vue'
import MobileNavigation from './MobileNavigation.vue'
import ThemeToggle from './ThemeToggle.vue'
import UserMenu from './UserMenu.vue'

const route = useRoute()
const pageTitle = computed(() => (route.meta.title as string | undefined) ?? '')
</script>

<template>
  <TooltipProvider :delay-duration="200">
    <div class="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <div class="flex min-w-0 flex-1 flex-col">
        <header
          class="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-4"
        >
          <MobileNavigation />
          <h1 class="min-w-0 truncate text-sm font-semibold text-foreground">{{ pageTitle }}</h1>
          <div class="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div class="mx-auto w-full max-w-6xl">
            <RouterView v-slot="{ Component }">
              <component :is="Component" />
            </RouterView>
          </div>
        </main>
      </div>
    </div>
  </TooltipProvider>
</template>
