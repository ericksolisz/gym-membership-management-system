<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Dumbbell, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormField from '@/components/common/FormField.vue'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useAuthStore } from '@/stores/auth'
import { APP_NAME, APP_TAGLINE } from '@/lib/nav'
import type { ApiError } from '@/api/client'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const errors = reactive<{ email?: string; password?: string }>({})
const formError = ref<string | null>(null)
const submitting = ref(false)
const showPassword = ref(false)

const sessionExpired = computed(() => route.query.reason === 'expired')

function validate(): boolean {
  errors.email = undefined
  errors.password = undefined
  let ok = true
  if (!form.email.trim()) {
    errors.email = 'Email is required.'
    ok = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.'
    ok = false
  }
  if (!form.password) {
    errors.password = 'Password is required.'
    ok = false
  }
  return ok
}

async function onSubmit() {
  if (submitting.value) return
  formError.value = null
  if (!validate()) return
  submitting.value = true
  try {
    await auth.login({ email: form.email.trim(), password: form.password })
    const redirect = route.query.redirect
    const target = typeof redirect === 'string' ? redirect : { name: 'dashboard' }
    await router.replace(target as never)
  } catch (err) {
    const apiError = err as ApiError
    formError.value =
      apiError.status === 401
        ? 'Invalid email or password. Please try again.'
        : apiError.message || 'Unable to sign in. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <TooltipProvider>
    <div class="flex min-h-screen flex-col bg-muted/30">
      <div class="flex items-center justify-end p-4">
        <ThemeToggle />
      </div>
      <div class="flex flex-1 items-center justify-center px-4 pb-16">
        <div class="w-full max-w-sm">
          <!-- Strong first-viewport brand signal -->
          <div class="mb-8 flex flex-col items-center text-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell class="h-6 w-6" />
            </div>
            <h1 class="mt-4 text-2xl font-semibold tracking-tight text-foreground">{{ APP_NAME }}</h1>
            <p class="mt-1 text-sm text-muted-foreground">{{ APP_TAGLINE }}</p>
          </div>

          <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div class="mb-5">
              <h2 class="text-base font-semibold text-foreground">Sign in</h2>
              <p class="mt-0.5 text-sm text-muted-foreground">Staff access to the membership console.</p>
            </div>

            <div
              v-if="sessionExpired && !formError"
              class="mb-4 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400"
              role="status"
            >
              <AlertCircle class="mt-0.5 h-4 w-4 shrink-0" />
              <span>Your session expired. Please sign in again.</span>
            </div>

            <div
              v-if="formError"
              class="mb-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              <AlertCircle class="mt-0.5 h-4 w-4 shrink-0" />
              <span>{{ formError }}</span>
            </div>

            <form novalidate class="flex flex-col gap-4" @submit.prevent="onSubmit">
              <FormField id="email" label="Email" :error="errors.email">
                <Input
                  id="email"
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@gym.com"
                  :disabled="submitting"
                  :aria-invalid="!!errors.email"
                  @update:model-value="errors.email = undefined"
                />
              </FormField>

              <FormField id="password" label="Password" :error="errors.password">
                <div class="relative">
                  <Input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    placeholder="••••••••"
                    class="pr-10"
                    :disabled="submitting"
                    :aria-invalid="!!errors.password"
                    @update:model-value="errors.password = undefined"
                  />
                  <button
                    type="button"
                    class="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    @click="showPassword = !showPassword"
                  >
                    <EyeOff v-if="showPassword" class="h-4 w-4" />
                    <Eye v-else class="h-4 w-4" />
                  </button>
                </div>
              </FormField>

              <Button type="submit" class="mt-1 w-full" :disabled="submitting">
                <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
                {{ submitting ? 'Signing in…' : 'Sign in' }}
              </Button>
            </form>
          </div>

          <p class="mt-6 text-center text-xs text-muted-foreground">
            Authorized staff only · Gateway on port 4004
          </p>
        </div>
      </div>
    </div>
  </TooltipProvider>
</template>
