<!-- src/editor/content/ContentArea.vue -->
<template>
  <!-- カテゴリ帯 -->
  <div class="flex items-center justify-between px-4 py-2 rounded-xl bg-primary text-primary-content">
    <div class="flex items-center gap-2 text-xl font-bold">
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
    <!-- Events / Assets: 基本設定の概要と使用キャラクター、現在のアイテムと接続(親 → 自分 → 子) -->
    <template v-if="isCurrentDataCategory">
      <ContentSummary :key="selectedCategory" />
      <ContentConnections />
    </template>

    <component :is="currentContent.editor" :key="selectedCategory" v-bind="editorProps" />
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
  import ContentConnections from './ContentConnections.vue'
  import ContentSummary from './ContentSummary.vue'

  const { t } = useI18n()
  const navigationStore = useNavigationStore()
  const { selectedCategory, isCurrentDataCategory, categoryArray } = storeToRefs(navigationStore)

  // Events / Assets のカテゴリでデータが1件もない
  const isEmpty = computed(() => isCurrentDataCategory.value && (categoryArray.value?.length ?? 0) === 0)

  const currentCategory = computed(() => categoryMap[selectedCategory.value])
  const currentIcon = computed(() => resolveLucideIcon(currentCategory.value.icon))
  const currentContent = computed(() => categoryContentMap[selectedCategory.value])
  // Events / Assets の ItemEditor には、セクションの内容を渡す
  const editorProps = computed(() => (currentContent.value.item ? { content: currentContent.value.item } : {}))
</script>
