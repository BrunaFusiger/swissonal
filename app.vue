<script lang="ts" setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

await preloadComponents(['BPageLoader'])

const { locale } = useI18n()
const loadingIndicator = useLoadingIndicator()

useHead({
  htmlAttrs: {
    lang: locale.value,
  },
})

provideHeadlessUseId(() => useId())

onMounted(() => {
  useNuxtApp().$startLenisScrollAnimation()

  gsap.registerPlugin(ScrollTrigger)
})

const today = new Date()
const month = today.toLocaleString('en-EN', { month: 'long' })

callOnce(() => {
  useFilterStore().setCurrentMonth(toKebabCase(month))
})

loadingIndicator.start()

onMounted(loadingIndicator.finish)
</script>

<template>
  <NuxtLayout>
    <BPageLoader />

    <LazyBCustomCursor class="hidden 2lg:block" />
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
