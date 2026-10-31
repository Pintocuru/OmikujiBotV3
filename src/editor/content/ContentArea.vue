<!-- src/editor/content/ContentArea.vue -->
<template>
  <!-- カテゴリ帯 -->
  <div class="flex items-center justify-between px-4 py-2 rounded-t-xl bg-primary text-primary-content">
    <div class="flex items-center gap-2 text-lg font-bold">
      <component :is="currentIcon" class="w-6 h-6" />
      {{ t(`categories.${selectedCategory}.label`) }}
    </div>

    <div class="text-sm opacity-80">
      {{ t(`categories.${selectedCategory}.description`) }}
    </div>
  </div>

  <!-- データが0件のとき（Events / Assets）：新規作成を促す -->
  <NoParamsCard
    v-if="isEmpty"
    :key="selectedCategory"
    class="mt-4"
    :iconName="currentCategory.icon"
    :message="t('navigation.create.emptyMessage')"
    :sub="t('navigation.create.emptyHint')"
  />

  <template v-else>
    <!-- Events / Assets: 基本設定の概要と使用キャラクター -->
    <ContentSummary v-if="isCurrentDataCategory" :key="selectedCategory" />

    <!-- Events / Assets: 現在のアイテムと接続を表示するヘッダー -->
    <ContentHeader v-if="isCurrentDataCategory" />
    <!-- ui / appInfo: セクションのタブ -->
    <ContentTabs v-else-if="tabs.length > 0" v-model:activeSection="activeSection" :tabs="tabs" />

    <component :is="currentEditor" />
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { categoryMap } from '@/maps/OmikujiData'
  import { categoryContentMap } from '@/editor/maps/category/CategoryContentMap'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import ContentHeader from './ContentHeader.vue'
  import ContentSummary from './ContentSummary.vue'
  import ContentTabs from './ContentTabs.vue'
  import { useContentTabs } from './composables/useContentTabs'

  const { t } = useI18n()
  const navigationStore = useNavigationStore()
  const { selectedCategory, isCurrentDataCategory, categoryArray } = storeToRefs(navigationStore)
  const { tabs, activeSection } = useContentTabs()

  // Events / Assets のカテゴリでデータが1件もない
  const isEmpty = computed(() => isCurrentDataCategory.value && (categoryArray.value?.length ?? 0) === 0)

  const currentCategory = computed(() => categoryMap[selectedCategory.value])
  const currentIcon = computed(() => resolveLucideIcon(currentCategory.value?.icon))
  const currentEditor = computed(() => categoryContentMap[selectedCategory.value].editor)
</script>
