<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'

const { t } = useI18n()

const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')

async function subscribe() {
  errorMessage.value = ''
  successMessage.value = ''

  const emailPattern = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/

  if (!emailPattern.test(email.value))
    return errorMessage.value = t('form-newsletter.message.enter-valid-email')
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(t(errorData.message))
    }

    email.value = ''
    successMessage.value = t('form-newsletter.message.success-subscription')
    setTimeout(() => { successMessage.value = '' }, 5000)
  }

  catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    }
    else {
      errorMessage.value = t('form-newsletter.message.unknown-error')
    }
  }
}
</script>

<template>
  <section
    class="relative my-20 w-full flex flex-col items-center justify-center gap-8 rounded-md bg-green-200 px-4 py-8 text-center lg:px-64 md:px-32"
  >
    <NuxtImg
      class="absolute w-20 -left-6 -top-8 md:w-24 xl:w-32 md:rotate-10 xl:rotate-20 md:-top-12 xl:-left-10 xl:-top-14"
      src="/images/stickers/mein-bester.webp"
      alt="sticker of an apple and montains with the text seasonal tastes better"
    />
    <NuxtImg
      class="absolute w-15 -bottom-8 -right-4 md:w-20 xl:w-28 xl:-right-14"
      src="/images/stickers/seasonal-tastes.webp"
      alt="sticker of a garden spade with the text mein bester freund(My best friend)"
    />
    <p
      class="text-white-100 title-lg"
      v-text="$t('form-newsletter.title')"
    />
    <p
      class="text-sm text-white-100 font-600 leading-4 tracking-wide font-base"
      v-text="$t('form-newsletter.description')"
    />
    <NuxtLink
      href="https://swissonal.beehiiv.com/"
      target="_blank"
      class="text-sm text-white-100 font-400 leading-4 tracking-wider font-base underline"
    >
      {{ $t('form-newsletter.last-editions') }} 📰✨
    </NuxtLink>
    <div class="w-full flex flex-col gap-6">
      <FloatLabel class="newsletter-input">
        <InputText
          id="email"
          v-model="email"
          class="w-full"
          type="email"
        />
        <label
          for="email"
          class="newsletter-input-text"
          v-text="$t('form-newsletter.email')"
        />
      </FloatLabel>

      <Message v-if="errorMessage">
        {{ errorMessage }}
      </Message>
      <Message v-else-if="successMessage">
        {{ successMessage }}
      </Message>
    </div>
    <div class="w-full flex justify-center md:justify-end">
      <button
        class="btn-outline-white"
        type="submit"
        @click="subscribe"
      >
        {{ $t('form-newsletter.send') }}
        <Icon
          class="text-white-100"
          name="i-material-symbols:arrow-right-alt-rounded"
        />
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.newsletter-input {
  --at-apply: w-full rounded-md bg-white-100 px-2 py-1.5 text-green-400;

  &-text {
    --at-apply: font-600 font-base text-sm;
  }
}

:deep() {
  .p-message {
    --at-apply: outline-none -mt-2;
  }

  .p-message .p-message-content .p-message-text {
    --at-apply: font-base text-white-100 px-2 border bg-white-100/0.5
      border-white-100 rounded-md text-sm lg: text-base font-300 tracking-wider
      transition-all duration-100;
  }
}
</style>
