<script setup lang="ts">
interface Item {
  image: string
  title: string
  description: string
}

const currentCategory = computed(() => useFilterStore().getCategory)
const currentMonth = computed(() => useFilterStore().getMonth)

const localePath = useLocalePath()
const route = useRoute()
const { locale } = useI18n()

const pageId = useId()

const allItems = ref<Item[]>([])
const itemsPerBlock = 15
const currentNumberOfBlocks = ref(1)

const isMobile = ref(false)
function checkIfMobile() {
  isMobile.value = window.innerWidth <= 744
}

const displayedItems = computed(() => {
  if (isMobile.value)
    return allItems.value.slice(0, currentNumberOfBlocks.value * itemsPerBlock)

  else return allItems.value
})

const isLoading = ref(true)
async function loadData() {
  const data = await queryContent(`${locale.value}/months/${currentMonth.value}/${currentCategory.value}`).findOne()
  allItems.value = data?.fruits || data?.vegetables || data?.herbs || data?.all || []

  isLoading.value = false
}

function loadMore() {
  currentNumberOfBlocks.value++
}

function loadLess() {
  currentNumberOfBlocks.value = 1
}

callOnce(pageId, () => {
  const { slug } = route.params

  if (typeof slug !== 'string' && slug?.length) {
    useFilterStore().setCurrentCategory(slug[0])
    const month = slug[1]
    if (month)
      useFilterStore().setCurrentMonth(month)
  }
})

watch([currentCategory, currentMonth], () => {
  const newUrl = localePath(`/${currentCategory.value}/${currentMonth.value}`)
  history.pushState({}, '', newUrl)

  loadData()
})

onMounted(() => {
  loadData()
  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile)
})
</script>

<template>
  <section class="w-full flex flex-col items-center justify-center gap-12 lg:gap-20">
    <BTab
      :current-category="currentCategory"
      :current-user-month="currentMonth"
    />
    <BMonthsFilter
      :current-category="currentCategory"
      :current-user-month="currentMonth"
    />

    <BTitleCurrentMonth
      :month="currentMonth"
      :text1="$t('current-month-text.text1')"
      :text2="$t('current-month-text.text2')"
    />
    <div class="relative w-full">
      <NuxtImg
        class="absolute z-11 w-15 -right-4 -top-8 lg:w-28 md:w-20 lg:-right-8 lg:-top-20 md:-top-12"
        src="/images/stickers/bioemeglio.webp"
        alt="sticker of a cherry tree with the text bio è meglio (Organic is better)"
      />
      <NuxtImg
        class="invisible absolute z-11 md:visible lg:w-22 md:w-20 xl:w-28 lg:-bottom-10 lg:-left-8 md:-bottom-12 md:-left-4 xl:-left-22"
        src="/images/stickers/organischisbeter.webp"
        loading="lazy"
        alt="sticker of seet vegetable growing with the text organisch is beter (Organic is better)"
      />
      <div
        class="grid-container-cards w-full rounded-lg bg-red-100 p-2"
      >
        <BSkeletonCard
          v-for="index in itemsPerBlock"
          v-show="isLoading"
          :key="index"
        />

        <BCard
          v-for="(item, index) in displayedItems"
          :key="index"
          :food-image="item.image"
          :food-name="item.title"
          :food-specification="item.description"
        />
        <div class="col-auto flex justify-center py-2 md:py-0">
          <button
            v-if="isMobile && displayedItems.length < allItems.length"
            class="w-full border border-white-100 rounded-sm py-2 text-white-100 font-300 tracking-wide paragraph"
            @click="loadMore"
          >
            {{ $t('load-more') }}
          </button>
          <button
            v-else-if="isMobile && displayedItems.length === allItems.length && displayedItems.length > 15"
            class="w-full py-2 text-white-100 font-300 tracking-wide italic paragraph"
            @click="loadLess"
          >
            {{ $t('load-less') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.grid-container-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;

  @media (max-width: 744px) {
    grid-template-columns: 1fr;
  }
}
</style>
