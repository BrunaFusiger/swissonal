import posthog from 'posthog-js'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  const posthogClient = posthog.init(
    runtimeConfig.public.posthogPublicKey,
    {
      api_host: runtimeConfig.public.posthogHost,
      person_profiles: 'never',
      capture_pageview: false,
      loaded: posthog =>
        posthog.debug(runtimeConfig.public.posthogDebug === 'ON'),
    },
  )

  const router = useRouter()
  router.afterEach((to) => {
    nextTick(() => {
      posthog.capture('$pageview', {
        current_url: to.fullPath,
      })
    })
  })

  return {
    provide: {
      posthog: () => posthogClient,
    },
  }
})
