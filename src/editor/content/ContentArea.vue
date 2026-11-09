<!-- src/editor/content/ContentArea.vue -->
<template>
  <!-- 主題(カテゴリ)。TopPage と同じ SectionCard。中の副題は SubSection / SubSectionHeader -->
  <SectionCard
    :icon="currentCategory.icon"
    :label-key="`categories.${selectedCategory}.label`"
    :description-key="`categories.${selectedCategory}.description`"
  >
    <!-- データが0件のとき（Events / Assets）：新規作成を促す -->
    <NoParamsCard
      v-if="isEmpty"
      :key="selectedCategory"
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
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { categoryMap } from '@/maps/OmikujiData'
  import { categoryContentMap } from '@/editor/maps/category/CategoryContentMap'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import ContentConnections from './ContentConnections.vue'
  import ContentSummary from './ContentSummary.vue'

  const { t } = useI18n()
  const navigationStore = useNavigationStore()
  const { selectedCategory, isCurrentDataCategory, categoryArray } = storeToRefs(navigationStore)

  // Events / Assets のカテゴリでデータが1件もない
  const isEmpty = computed(() => isCurrentDataCategory.value && (categoryArray.value?.length ?? 0) === 0)

  const currentCategory = computed(() => categoryMap[selectedCategory.value])
  const currentContent = computed(() => categoryContentMap[selectedCategory.value])
  // Events / Assets の ItemEditor には、セクションの内容を渡す
  const editorProps = computed(() => (currentContent.value.item ? { content: currentContent.value.item } : {}))
</script>
