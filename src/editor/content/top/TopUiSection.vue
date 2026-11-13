<!-- src/editor/content/top/TopUiSection.vue -->
<!-- TOPページ: 選択中レイアウトで使われる UI の一覧(並び替え不可) -->
<template>
  <section v-if="uiItems.length > 0" class="space-y-1.5">
    <TopCategoryHeader
      :icon="categoryContentMap.ui.icon"
      :title="t('categories.ui.label')"
      :description="t('categories.ui.description')"
      :count="uiItems.length"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1.5">
      <button
        v-for="item in uiItems"
        :key="item.kind"
        type="button"
        class="group flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2 text-left hover:bg-primary hover:text-primary-content transition-colors min-w-0 cursor-pointer"
        @click="goToUiSection(item.kind)"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        <div class="min-w-0">
          <div class="text-lg font-bold truncate">{{ t(`mapText.uiKind.${item.kind}.label`) }}</div>
          <div class="text-xs text-base-content/60 group-hover:text-primary-content truncate">
            {{ t(`mapText.uiKind.${item.kind}.description`) }}
          </div>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { categoryContentMap } from '@/editor/maps/category/CategoryContentMap'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useVisibleUiKinds } from '@/editor/ui/useVisibleUiKinds'
  import TopCategoryHeader from './TopCategoryHeader.vue'

  const { t } = useI18n()
  const navigationStore = useNavigationStore()

  // 選択中レイアウトが使う UI のうち、登録済みのもの(UiEditor と同じ条件)
  const visibleUiKinds = useVisibleUiKinds()
  const uiItems = computed(() =>
    visibleUiKinds.value.map(({ kind, entry }) => ({ kind, icon: resolveLucideIcon(entry.icon) }))
  )

  // ui カテゴリを開き、該当タブを選択
  const goToUiSection = (kind: string) => {
    navigationStore.selectCategory('ui')
    navigationStore.selectItem(null, kind)
  }
</script>
