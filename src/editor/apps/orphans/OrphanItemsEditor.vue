<!-- src/editor/apps/orphans/OrphanItemsEditor.vue -->
<!-- どのイベントからも使われていないアイテムの一覧。1 件ずつ確認ダイアログを出して削除できる -->
<template>
  <!-- 参照関係の再構築中(この間の結果は「なし」とは言えない) -->
  <div v-if="isSearching" class="flex items-center gap-2 py-6 justify-center text-base-content/60">
    <span class="loading loading-spinner loading-sm" />
    <span class="text-sm">{{ t('orphans.searching') }}</span>
  </div>

  <NoParamsCard v-else-if="orphanGroups.length === 0" :message="t('orphans.empty')" />

  <div v-else class="space-y-4">
    <InformationCard variant="warning" icon="primary">
      <p>
        {{ t('orphans.criteria') }}<br />
        {{ t('orphans.caution') }}
      </p>
    </InformationCard>

    <section v-for="group in orphanGroups" :key="group.category" class="space-y-1.5">
      <TopCategoryHeader
        :icon="categoryContentMap[group.category].icon"
        :title="t(`categories.${group.category}.label`)"
        :description="t(`categories.${group.category}.description`)"
        :count="group.items.length"
      />

      <ul class="space-y-1.5">
        <li v-for="orphan in group.items" :key="orphan.key" class="flex items-center gap-2 rounded-lg bg-base-200 p-2">
          <div class="min-w-0 flex-1">
            <div class="font-bold truncate">{{ orphan.name }}</div>
            <div class="text-xs text-base-content/60 truncate">{{ orphan.key }}</div>
          </div>
          <button class="btn btn-ghost btn-sm" @click="goToItem(orphan.category, orphan.key)">
            {{ t('orphans.open') }}
          </button>
          <button class="btn btn-outline btn-error btn-sm" @click="removeOrphan(orphan)">
            {{ t('orphans.remove') }}
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { categoryContentMap } from '@/editor/maps/category/CategoryContentMap'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import InformationCard from '@/editor/parts/InformationCard.vue'
  import TopCategoryHeader from '@/editor/content/top/TopCategoryHeader.vue'
  import { useOrphanItems, type OrphanItem } from './useOrphanItems'
  import { useTopItemActions } from '@/editor/content/composables/useTopItemActions'

  const { t } = useI18n()
  const { isEventCategory } = useGetEventData()
  const { orphanGroups, isSearching } = useOrphanItems()
  const { goToItem, removeEventItem, removeAssetItem } = useTopItemActions()

  // 削除は 1 件ずつ(確認ダイアログは removeWith 側)
  const removeOrphan = (orphan: OrphanItem) => {
    if (isEventCategory(orphan.category)) removeEventItem(orphan.category, orphan.key, orphan.name)
    else removeAssetItem(orphan.category, orphan.key, orphan.name)
  }
</script>
