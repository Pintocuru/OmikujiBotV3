<!-- src/editor/content/TopPage.vue -->
<template>
  <div class="space-y-6">
    <!-- ヘッダー帯 -->
    <div class="flex items-center justify-between px-4 py-2 rounded-t-xl bg-primary text-primary-content">
      <div class="flex items-center gap-2 text-lg font-bold">
        <component :is="topIcon" class="w-6 h-6" />
        TOPページ
      </div>
      <div class="text-sm opacity-80">編集したい項目を選んでください</div>
    </div>

    <!-- ui で使われるもの -->
    <section class="space-y-2">
      <h2 class="flex items-center gap-2 text-base font-bold px-1">
        <component :is="uiIcon" class="w-5 h-5" />
        {{ t('categories.ui.label') }}
      </h2>
      <button
        type="button"
        class="card bg-base-200 w-full text-left p-4 flex items-center gap-3 hover:bg-base-300 transition-colors"
        @click="goToCategory('ui')"
      >
        <component :is="uiIcon" class="w-6 h-6 shrink-0" />
        <div class="min-w-0">
          <div class="font-bold truncate">{{ t('categories.ui.label') }}</div>
          <div class="text-sm text-base-content/60 truncate">{{ t('categories.ui.description') }}</div>
        </div>
      </button>
    </section>

    <!-- assets: characters -->
    <section class="space-y-2">
      <h2 class="flex items-center gap-2 text-base font-bold px-1">
        <component :is="charactersIcon" class="w-5 h-5" />
        {{ t('categories.characters.label') }}
        <span class="text-sm font-normal text-base-content/50">({{ characterList.length }}件)</span>
      </h2>
      <NoParamsCard
        v-if="characterList.length === 0"
        iconName="Users"
        :message="t('navigation.create.emptyMessage')"
        :sub="t('navigation.create.emptyHint')"
      />
      <button
        v-for="character in characterList"
        :key="character.key"
        type="button"
        class="card bg-base-200 w-full text-left p-4 flex items-center gap-3 hover:bg-base-300 transition-colors"
        @click="goToItem('characters', character.key)"
      >
        <component :is="charactersIcon" class="w-6 h-6 shrink-0" />
        <div class="min-w-0">
          <div class="font-bold truncate">{{ character.displayName || character.name || character.key }}</div>
          <div class="text-sm text-base-content/60 truncate">{{ character.description }}</div>
        </div>
      </button>
    </section>

    <!-- events: 全カテゴリの全データ -->
    <section v-for="category in eventCategory" :key="category" class="space-y-2">
      <h2 class="flex items-center gap-2 text-base font-bold px-1">
        <component :is="eventIcon(category)" class="w-5 h-5" />
        {{ t(`categories.${category}.label`) }}
        <span class="text-sm font-normal text-base-content/50">({{ sortedEvents(category).length }}件)</span>
      </h2>
      <NoParamsCard
        v-if="sortedEvents(category).length === 0"
        :iconName="categoryMap[category].icon"
        :message="t('navigation.create.emptyMessage')"
        :sub="t('navigation.create.emptyHint')"
      />
      <button
        v-for="event in sortedEvents(category)"
        :key="event.id"
        type="button"
        class="card bg-base-200 w-full text-left p-4 flex items-center gap-3 hover:bg-base-300 transition-colors"
        @click="goToItem(category, event.id)"
      >
        <component :is="eventIcon(category)" class="w-6 h-6 shrink-0" />
        <div class="min-w-0">
          <div class="font-bold truncate">{{ event.name || event.id }}</div>
          <div class="text-sm text-base-content/60 truncate">{{ event.description }}</div>
        </div>
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { eventCategory, type CategoryType, type EventCategoryType } from '@/types/OmikujiData'
  import { categoryMap } from '@/maps/OmikujiData'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'

  const { t } = useI18n()
  const navigationStore = useNavigationStore()
  const { getEvents } = useGetEventData()
  const { getAssets } = useGetAssetData()

  const topIcon = resolveLucideIcon('Home')
  const uiIcon = resolveLucideIcon(categoryMap.ui.icon)
  const charactersIcon = resolveLucideIcon(categoryMap.characters.icon)
  const eventIcon = (category: EventCategoryType) => resolveLucideIcon(categoryMap[category].icon)

  // characters は order 昇順で並べる
  const characterList = computed(() =>
    Object.values(getAssets('characters')).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  )

  // events はカテゴリごとに order 昇順で並べる
  const sortedEvents = (category: EventCategoryType) =>
    [...getEvents(category)].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  // カテゴリのみへ遷移(ui など)
  const goToCategory = (category: CategoryType) => {
    navigationStore.selectCategory(category)
  }

  // カテゴリ + 個別アイテムへ遷移(characters / events)
  const goToItem = (category: CategoryType, key: string) => {
    navigationStore.selectCategory(category)
    navigationStore.selectItem(key)
  }
</script>
