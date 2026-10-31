<!-- src/editor/content/ContentHeader.vue -->
<!-- Events / Assets 用のヘッダー。現在のアイテムと、その前後の接続(参照元 → 現在 → 参照先)を表示する -->
<template>
  <div class="sticky top-0 z-10 bg-base-100 px-1 py-2">
    <div class="rounded-box border border-base-300 bg-base-200/60 p-3 flex flex-wrap items-end justify-between gap-3">
      <component :is="lane" />

      <!-- 循環参照(シナリオの呼び出し / プレースホルダーの入れ子) -->
      <div v-if="cyclePath" class="alert alert-error alert-soft w-full py-2 text-sm">
        <TriangleAlert class="w-4 h-4 shrink-0" />
        <span>{{ t('connections.cycle', { path: cyclePath.join(' → ') }) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { TriangleAlert } from 'lucide-vue-next'
  import { storeToRefs } from 'pinia'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import EventLane from './header/EventLane.vue'
  import MikujiLane from './header/MikujiLane.vue'
  import ScenarioLane from './header/ScenarioLane.vue'
  import PlaceholderLane from './header/PlaceholderLane.vue'
  import CharacterLane from './header/CharacterLane.vue'
  import { useReferenceGraph } from './composables/useReferenceGraph'
  import ItemSwitcher from './header/ItemSwitcher.vue'

  const { t } = useI18n()
  const { selectedCategory, selectedItemKey } = storeToRefs(useNavigationStore())
  const { scenarioCyclePath, placeholderCyclePath } = useReferenceGraph()
  const { isEventCategory } = useGetEventData()

  /** カテゴリごとの接続表示 */
  const lane = computed<Component>(() => {
    const category = selectedCategory.value
    if (isEventCategory(category)) return EventLane
    if (category === 'mikuji') return MikujiLane
    if (category === 'scenarios') return ScenarioLane
    if (category === 'placeholders') return PlaceholderLane
    if (category === 'characters') return CharacterLane
    return ItemSwitcher
  })

  // 選択中のアイテムが循環に含まれるとき、その経路
  const cyclePath = computed(() => {
    const key = selectedItemKey.value
    if (!key) return null
    if (selectedCategory.value === 'scenarios') return scenarioCyclePath(key)
    if (selectedCategory.value === 'placeholders') return placeholderCyclePath(key)
    return null
  })
</script>
