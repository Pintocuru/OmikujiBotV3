<!-- src/editor/ui/UiEditor.vue -->
<template>
  <!-- 開発時のみ: UI の有効/無効・レイアウト切り替え -->
  <template v-if="isDev">
    <SectionCard
      variant="warning"
      icon="LayoutGrid"
      title="レイアウト"
      description="ジェネレーターで使用するレイアウトの切り替え"
    >
      <LayoutEditor />
    </SectionCard>

    <!-- DEV:アイテムが有るかを確認 -->
    <div>
      {{ visibleItems }}
    </div>
  </template>

  <!-- 各 UI の設定（選択中レイアウトが使う UI のうち、main.ts で登録されたもの） -->
  <template v-for="[kind, item] in visibleItems" :key="kind">
    <SectionCard
      :id="`section-${kind}`"
      :icon="item.icon"
      :isOpen="activeSection === kind"
      @toggle="toggleSection(kind)"
      :title="item.label"
      :description="item.description"
    >
      <component :is="item.component" />
    </SectionCard>
  </template>

  <!-- 共通設定（レイアウトの有無に関わらず常に表示） -->
  <SectionCard
    id="section-commonStyle"
    icon="Palette"
    :isOpen="activeSection === 'commonStyle'"
    @toggle="toggleSection('commonStyle')"
    title="共通設定"
    description="フォントなど、すべての表示に共通する設定"
  >
    <FontFamilyEditor />
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { isDev } from '@/types/env'
  import { uiLayoutMap } from '@/maps/OmikujiData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import { getUiEditorEntries } from './uiEditorRegistry'
  import LayoutEditor from './conditions/LayoutEditor.vue'
  import FontFamilyEditor from './common/FontFamilyEditor.vue'

  const { data } = storeToRefs(useOmikujiStore())
  const { activeSection } = storeToRefs(useNavigationStore())

  // 選択中レイアウトが使う UI のうち、main.ts で登録済みのものだけ表示
  const visibleItems = computed(() => {
    const kinds = uiLayoutMap[data.value.ui.layout].kinds
    return getUiEditorEntries().filter(([kind]) => kinds.includes(kind))
  })

  const toggleSection = (section: string) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // 開いた時に最初のアイテムを表示（activeSection が未設定のときのみ）
  watch(
    visibleItems,
    (items) => {
      if (activeSection.value !== null) return
      const first = items[0]?.[0]
      if (first) activeSection.value = first
    },
    { immediate: true }
  )
</script>
