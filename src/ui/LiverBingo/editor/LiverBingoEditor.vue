<!-- src/ui/LiverBingo/editor/LiverBingoEditor.vue -->
<template>
  <!-- プレビュー(クリックで実際に操作できる) -->
  <HudPreview :isAdminOnly="true">
    <LiverBingoBoard :settings="liverBingo" :fontFamily="fontFamily" />
  </HudPreview>

  <!-- カードサイズ -->
  <SettingItem
    labelKey="uiSettings.liverBingo.cardSize.label"
    descriptionKey="uiSettings.liverBingo.cardSize.description"
  >
    <div class="join">
      <input
        v-for="size in CARD_SIZE_OPTIONS"
        :key="size"
        type="radio"
        name="liverBingoCardSize"
        class="btn join-item btn-sm"
        :aria-label="`${size}×${size}`"
        :checked="liverBingo.cardSize === size"
        @change="changeCardSize(size)"
      />
    </div>
  </SettingItem>

  <!-- カラー設定 -->
  <SettingItem
    labelKey="uiSettings.common.color.label"
    descriptionKey="uiSettings.liverBingo.color.description"
    layout="vertical"
  >
    <ColorPicker :modelValue="liverBingo.color" @update:modelValue="(val) => update('color', val)" />
  </SettingItem>

  <!-- お題パック -->
  <SectionCard
    icon="Package"
    labelKey="uiSettings.liverBingo.packs.label"
    descriptionKey="uiSettings.liverBingo.packs.description"
  >
    <LiverBingoPacks :randomSeeds="liverBingo.randomSeeds" :cardSize="liverBingo.cardSize" @apply="applyPack" />
  </SectionCard>

  <!-- 固定項目 -->
  <SectionCard
    icon="LayoutGrid"
    labelKey="uiSettings.liverBingo.fixedItems.label"
    descriptionKey="uiSettings.liverBingo.fixedItems.description"
  >
    <LiverBingoFixedItems
      :seeds="liverBingo.seeds"
      :cardSize="liverBingo.cardSize"
      @update="(seeds) => update('seeds', seeds)"
    />
  </SectionCard>

  <!-- ランダム項目 -->
  <SectionCard
    icon="ListChecks"
    labelKey="uiSettings.liverBingo.randomItems.label"
    descriptionKey="uiSettings.liverBingo.randomItems.description"
  >
    <LiverBingoRandomItems :items="liverBingo.randomSeeds" @update="(items) => update('randomSeeds', items)" />
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { LiverBingoSchema, type LiverBingoType } from '@/types/ui'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'
  import LiverBingoBoard from '../components/LiverBingoBoard.vue'
  import LiverBingoFixedItems from './LiverBingoFixedItems.vue'
  import LiverBingoPacks from './LiverBingoPacks.vue'
  import LiverBingoRandomItems from './LiverBingoRandomItems.vue'
  import { dropOutOfRange } from './seedList'

  /** エディターで選べるカードサイズ(スキーマは 3〜10 に対応) */
  const CARD_SIZE_OPTIONS = [3, 4, 5] as const

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore

  const fontFamily = computed(() => data.value.ui.fontFamily)
  const liverBingo = computed(() => LiverBingoSchema.parse(data.value.ui.settings.liverBingo ?? {}))

  const update = <K extends keyof LiverBingoType>(field: K, value: LiverBingoType[K]) => {
    updateItemSettings('liverBingo', { [field]: value })
  }

  // パックのお題を取り込む(固定項目も取り込むときは、seeds も入る)
  const applyPack = (patch: Pick<LiverBingoType, 'randomSeeds'> & Partial<Pick<LiverBingoType, 'seeds'>>) => {
    updateItemSettings('liverBingo', patch)
  }

  // カードサイズを小さくしたら、カードの外になる固定項目を取り除く
  const changeCardSize = (size: LiverBingoType['cardSize']) => {
    updateItemSettings('liverBingo', {
      cardSize: size,
      seeds: dropOutOfRange(liverBingo.value.seeds, size),
    })
  }
</script>
