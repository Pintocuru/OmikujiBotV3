<!-- src/editor/ui/UiEditor.vue -->
<template>
  <!-- 開発時のみ: UI の有効/無効・レイアウト切り替え -->
  <template v-if="isDev">
    <SectionCard
      variant="warning"
      icon="LayoutGrid"
      title="アイテム有効・無効切り替え"
      description="消し忘れがないかチェックしたか？"
    >
      <ItemsSettings />
    </SectionCard>
    <SectionCard variant="warning" icon="LayoutGrid" title="レイアウト" description="専用レイアウトの切り替え">
      <LayoutEditor />
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

  <!-- 各アイテム設定（layout 未設定時のみ。main.ts で登録された UI のみ） -->
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
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { isDev } from '@/types/env'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import SectionCard from '@/editor/parts/SectionCard/SectionCard.vue'
  import { getUiEditorEntries } from './uiEditorRegistry'
  import ItemsSettings from './conditions/ItemsSettings.vue'
  import LayoutEditor from './conditions/LayoutEditor.vue'
  import FontFamilyEditor from './common/FontFamilyEditor.vue'

  const { data } = storeToRefs(useOmikujiStore())
  const { activeSection } = storeToRefs(useNavigationStore())

  // layout 設定時は各 UI の設定を隠す。未設定時は「登録済み かつ settings あり」の UI だけ表示
  const visibleItems = computed(() =>
    data.value.ui.layout ? [] : getUiEditorEntries().filter(([kind]) => !!data.value.ui.settings[kind])
  )

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
