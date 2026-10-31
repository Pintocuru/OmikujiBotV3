<!-- src/editor/content/ContentHeader.vue -->
<!-- Events / Assets 用のヘッダー。現在のアイテムと、その前後の接続(参照元 → 現在 → 参照先)を表示する -->
<template>
  <div class="sticky top-0 z-10 bg-base-100 px-1 py-2">
    <div class="rounded-box border border-base-300 bg-base-200/60 p-3 flex flex-wrap items-end justify-between gap-3">
      <component :is="lane" />

      <!-- カテゴリ全体を対象にした便利ボタン -->
      <div v-if="changerCategory" class="flex gap-2">
        <CharacterChanger :category="changerCategory" />
        <IconKeyChanger :category="changerCategory" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { storeToRefs } from 'pinia'
  import type { EventCategoryType } from '@/types/OmikujiData'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useGetEventData } from '@/editor/stores/useGetEventData'
  import CharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'
  import EventLane from './header/EventLane.vue'
  import MikujiLane from './header/MikujiLane.vue'
  import ScenarioLane from './header/ScenarioLane.vue'
  import PlaceholderLane from './header/PlaceholderLane.vue'
  import ItemSwitcher from './header/ItemSwitcher.vue'

  const { selectedCategory } = storeToRefs(useNavigationStore())
  const { isEventCategory } = useGetEventData()

  /** カテゴリごとの接続表示。接続を持たないカテゴリ(characters)は切替プルダウンだけ */
  const lane = computed<Component>(() => {
    const category = selectedCategory.value
    if (isEventCategory(category)) return EventLane
    if (category === 'mikuji') return MikujiLane
    if (category === 'scenarios') return ScenarioLane
    if (category === 'placeholders') return PlaceholderLane
    return ItemSwitcher
  })

  // 使用キャラ・アイコンの一括確認ボタンを出すカテゴリ
  const changerCategories = ['timers', 'services', 'mikuji', 'scenarios'] as const
  const changerCategory = computed(() => {
    const category = selectedCategory.value
    return (changerCategories as readonly string[]).includes(category)
      ? (category as EventCategoryType | 'mikuji' | 'scenarios')
      : null
  })
</script>
