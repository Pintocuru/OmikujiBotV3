<!-- src/editor/apps/navigation/NavigationSidebarSettingsCategories.vue -->
<!-- SettingsCategoryType（jsonMerge / ui / dataPacks / appInfo）を扱う。データ系と違い、新規作成・ドラッグは持たない -->
<template>
  <div class="flex flex-col gap-0.5 px-2 pb-2 flex-1">
    <template v-for="group in settingsCategoryGroups" :key="group.id">
      <!-- データ系との境目（サブラベルは展開中のみ、折りたたみ中は区切り線） -->
      <div
        v-if="isExpanded"
        class="px-3 pt-3 pb-0.5 text-[10px] font-semibold tracking-wider opacity-50 select-none"
      >
        {{ t(`navigation.groups.${group.id}`) }}
      </div>
      <hr v-else class="border-base-300 my-1 mx-2" />

      <template v-for="key in group.keys" :key="key">
        <SidebarCategoryButton
          :category="key"
          :icon="filteredCategoryLabels[key].icon"
          :count="getCategoryItemCount(key)"
          :isSelected="selectedCategory === key"
          :isExpanded="isExpanded"
          @click="navigateCategory(key)"
        />

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="isExpanded && selectedCategory === key && isOpenCategory[key] && key !== 'dataPacks'">
            <template v-for="entry in [resolveSettingsEntry(key)]" :key="entry.category">
              <!-- Array：jsonMerge の静的リスト -->
              <SidebarArrayItems
                v-if="entry.variant === 'array'"
                :category="entry.category"
                :items="getJsonMergeItems()"
              />

              <!-- Object：appInfo / ui のセクションリスト -->
              <SidebarObjectItems v-else :category="entry.category" />
            </template>
          </div>
        </transition>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useCategoryUtils } from './composables/useCategoryUtils'
  import { useCategoryOpen } from './composables/useCategoryOpen'
  import { useSidebarSubItems } from './composables/useSidebarSubItems'
  import SidebarCategoryButton from './SidebarCategoryButton.vue'
  import SidebarArrayItems from './SidebarArrayItems.vue'
  import SidebarObjectItems from './SidebarObjectItems.vue'

  const { t } = useI18n()

  defineProps<{
    isExpanded: boolean
  }>()

  const { getCategoryItemCount, filteredCategoryLabels, settingsCategoryGroups } = useCategoryUtils()
  const { selectedCategory, isOpenCategory, navigateCategory } = useCategoryOpen()
  const { resolveSettingsEntry, getJsonMergeItems } = useSidebarSubItems()
</script>
