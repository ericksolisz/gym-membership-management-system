<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Compass } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const target = computed(() => (auth.isAuthenticated ? { name: 'dashboard' } : { name: 'login' }))
const label = computed(() => (auth.isAuthenticated ? 'Back to dashboard' : 'Go to sign in'))
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/30 px-4 text-center">
    <div class="flex h-14 w-14 items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <Compass class="h-7 w-7" />
    </div>
    <div>
      <p class="text-sm font-semibold text-primary">404</p>
      <h1 class="mt-1 text-2xl font-semibold tracking-tight text-foreground">Page not found</h1>
      <p class="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you're looking for doesn't exist or may have been moved.
      </p>
    </div>
    <Button @click="router.push(target)">{{ label }}</Button>
  </div>
</template>
