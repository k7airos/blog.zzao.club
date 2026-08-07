import { trackPulsePageview } from './composables'

export default defineNuxtPlugin((nuxtApp) => {
  const c = useRuntimeConfig().public.pulse as {
    enabled?: boolean
    autoTrack?: boolean
  } | undefined

  if (!c?.enabled || c.autoTrack === false)
    return

  const router = useRouter()
  // Only afterEach: initial navigation also triggers it (avoid double-count with app:mounted)
  router.afterEach((to) => {
    const path = to.fullPath || to.path
    void trackPulsePageview(path)
  })
})
