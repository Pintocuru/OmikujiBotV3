<!-- src/editor/content/TopPage.vue -->
<!-- TOPページの殻。各セクションは top/ 配下、共通の操作は composables/useTopItemActions に分けている -->
<template>
  <SectionCard icon="Home" labelKey="topPage.label" descriptionKey="topPage.description">
    <div class="space-y-4">
      <TopUiSection />
      <TopCharacterSection @edit="openEdit" />
      <!-- events: 0件のカテゴリは表示しない -->
      <TopEventSection v-for="category in visibleEventCategories" :key="category" :category="category" @edit="openEdit" />
    </div>

    <!-- 基本設定の編集ダイアログ(対象アイテムを一時選択して開く) -->
    <ItemEditDialog v-model:open="editOpen" />
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { eventCategory, type CategoryType } from '@/types/OmikujiData'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import ItemEditDialog from './summary/ItemEditDialog.vue'
  import TopUiSection from './top/TopUiSection.vue'
  import TopCharacterSection from './top/TopCharacterSection.vue'
  import TopEventSection from './top/TopEventSection.vue'

  const { selectedCategory, selectedItemKey } = storeToRefs(useNavigationStore())
  const { getEventCount } = useGetEventData()

  const visibleEventCategories = computed(() => eventCategory.filter((category) => getEventCount(category) > 0))

  // 編集(ItemEditDialog):対象を一時選択してから開く(TOPページからは移動しない)
  const editOpen = ref(false)
  const openEdit = (category: CategoryType, key: string) => {
    selectedCategory.value = category
    selectedItemKey.value = key
    editOpen.value = true
  }
</script>
