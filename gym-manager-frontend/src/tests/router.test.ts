import { beforeEach, describe, expect, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { router } from '@/router'
import { tokenStorage } from '@/api/client'

describe('router auth guard', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    sessionStorage.clear()
    await router.replace('/login')
    await router.isReady()
  })

  it('redirects unauthenticated users to login and preserves the destination', async () => {
    await router.push('/members')
    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/members')
  })

  it('leaves unauthenticated users on the public login route', async () => {
    await router.push('/login')
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('allows authenticated users into protected routes', async () => {
    tokenStorage.set('jwt-token')
    setActivePinia(createPinia()) // fresh store reads the new token
    await router.push('/dashboard')
    expect(router.currentRoute.value.name).toBe('dashboard')
  })

  it('sends authenticated users away from the login page', async () => {
    tokenStorage.set('jwt-token')
    setActivePinia(createPinia())
    await router.push('/members')
    await router.push('/login')
    expect(router.currentRoute.value.name).toBe('dashboard')
  })

  it('routes unknown paths to the not-found page', async () => {
    await router.push('/nope/does-not-exist')
    expect(router.currentRoute.value.name).toBe('not-found')
  })
})
