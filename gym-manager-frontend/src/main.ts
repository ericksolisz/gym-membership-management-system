import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { onUnauthorized } from './api/client'
import { useAuthStore } from './stores/auth'
import { useMemberStore } from './stores/members'
import './assets/index.css'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)

  const auth = useAuthStore()

  // Central 401 handler: clear session, drop cached data, redirect to /login
  // while preserving the intended destination.
  onUnauthorized(() => {
    const members = useMemberStore()
    auth.clearSession()
    members.reset()
    const current = router.currentRoute.value
    if (current.name !== 'login') {
      router.replace({
        name: 'login',
        query: {
          redirect: current.fullPath,
          reason: 'expired',
        },
      })
    }
  })

  // Validate any persisted token before the first navigation resolves.
  await auth.bootstrap()

  app.use(router)
  await router.isReady()
  app.mount('#app')
}

bootstrap()
