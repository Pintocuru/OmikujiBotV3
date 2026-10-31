<!-- src/editor/sidebar/categories/SettingsCategories.vue -->
<!-- SettingsCategoryType（jsonMerge / ui / dataPacks / appInfo）を扱う。データ系と違い、新規作成・ドラッグは持たない -->
<template>
  <div class="flex flex-col gap-0.5 px-2 pb-2 flex-1">
    <template v-for="group in settingsCategoryGroups" :key="group.id">
      <!-- データ系との境目 -->
      <div class="px-3 pt-3 pb-0.5 text-[10px] font-semibold tracking-wider opacity-50 select-none">
        {{ t(`navigation.groups.${group.id}`) }}
      </div>

      <template v-for="key in group.keys" :key="key">
        <CategoryButton
          :category="key"
          :icon="filteredCategoryLabels[key].icon"
          :count="getCategoryItemCount(key)"
          :isSelected="selectedCategory === key"
          @click="navigateCategory(key)"
        />

        <!-- jsonMerge だけ、一覧から編集対象を選ぶ（ui / appInfo のサブ項目は ContentArea のタブ） -->
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-screen"
          leave-from-class="opacity-100 max-h-screen"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="key === 'jsonMerge' && selectedCategory === key && isOpenCategory[key]">
            <JsonMergeList :items="jsonMergeItems" />
          </div>
        </transition>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { SidebarStaticItem } from '@/editor/types/apps'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useCategoryUtils } from '../composables/useCategoryUtils'
  import { useCategoryOpen } from '../composables/useCategoryOpen'
  import CategoryButton from './CategoryButton.vue'
  import JsonMergeList from '../records/JsonMergeList.vue'

  const { t } = useI18n()

  const { data } = storeToRefs(useOmikujiStore())
  const { getCategoryItemCount, filteredCategoryLabels, settingsCategoryGroups } = useCategoryUtils()
  const { selectedCategory, isOpenCategory, navigateCategory } = useCategoryOpen()

  // jsonMerge の一覧(JsonMergeEditor の選択キー(id)と揃える)
  const jsonMergeItems = computed<SidebarStaticItem[]>(() =>
    data.value.jsonMerge.map((item) => ({
      key: item.id,
      label: item.name || t('navigation.unnamed'),
    }))
  )
</script>
