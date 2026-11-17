<!-- src/ui/game/LiverBingo/editor/LiverBingoEditor.vue -->
<template>
  <!-- プレビュー(クリックで実際に操作できる) -->
  <HudPreview>
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

  <!-- 保存パターン -->
  <SectionCard
    icon="Layers"
    labelKey="uiSettings.liverBingo.patterns.label"
    descriptionKey="uiSettings.liverBingo.patterns.description"
  >
    <LiverBingoPatterns :current="patternContent" :isServer="isServerConnected" @apply="applyPattern" />
  </SectionCard>

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
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { LiverBingoSchema, type LiverBingoPatternContentType, type LiverBingoType } from '@/types/ui'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'
  import LiverBingoBoard from '../components/LiverBingoBoard.vue'
  import LiverBingoFixedItems from './LiverBingoFixedItems.vue'
  import LiverBingoPacks from './LiverBingoPacks.vue'
  import LiverBingoPatterns from './LiverBingoPatterns.vue'
  import LiverBingoRandomItems from './LiverBingoRandomItems.vue'
  import { dropOutOfRange } from './seedList'

  /** エディターで選べるカードサイズ(スキーマは 3〜10 に対応) */
  const CARD_SIZE_OPTIONS = [3, 4, 5] as const

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore
  const { isServerConnected } = storeToRefs(useManagerStore())

  const fontFamily = computed(() => data.value.ui.fontFamily)
  const liverBingo = computed(() => LiverBingoSchema.parse(data.value.ui.settings.liverBingo ?? {}))

  const update = <K extends keyof LiverBingoType>(field: K, value: LiverBingoType[K]) => {
    updateItemSettings('liverBingo', { [field]: value })
  }

  // 保存パターンにする中身(カードサイズ・固定項目・ランダム項目。配色は含めない)
  const patternContent = computed<LiverBingoPatternContentType>(() => ({
    cardSize: liverBingo.value.cardSize,
    seeds: liverBingo.value.seeds,
    randomSeeds: liverBingo.value.randomSeeds,
  }))

  // 保存パターンを読み込む(今のカードサイズ・固定項目・ランダム項目が置き換わる)
  const applyPattern = (content: LiverBingoPatternContentType) => {
    updateItemSettings('liverBingo', content)
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
