<!-- src/ui/CharacterStage/editor/CharacterStageEditor.vue -->
<template>
  <!-- プレビュー表示(登場位置の範囲・大きさ・登場アニメーションの確認用) -->
  <CharacterStagePreview :settings="stage" />

  <!-- キャラクターの大きさ(標準値。投稿側は倍率だけ渡す) -->
  <SettingItem
    label="キャラクターの大きさ"
    description="標準の横幅です。投稿ごとの「サイズ倍率」がこの値にかかります"
    :showReset="true"
    @reset="resetField('characterSize')"
  >
    <input
      type="range"
      min="64"
      max="640"
      step="16"
      class="range range-primary w-full max-w-xs"
      :value="stage.characterSize"
      @input="(e) => update('characterSize', Number((e.target as HTMLInputElement).value))"
    />
    <div class="mt-2 text-sm">現在値: {{ stage.characterSize }}px</div>
  </SettingItem>

  <!-- 表示秒数 -->
  <SettingItem
    label="既定の表示秒数"
    description="投稿で秒数を指定しなかったときの秒数です(0 は無期限)"
    :showReset="true"
    @reset="resetField('seconds')"
  >
    <input
      type="number"
      min="0"
      step="1"
      class="input input-bordered w-full max-w-xs"
      :value="stage.seconds"
      @change="(e) => update('seconds', Math.max(0, Number((e.target as HTMLInputElement).value) || 0))"
    />
  </SettingItem>

  <!-- 既定の位置レンジ -->
  <SettingItem
    v-for="axis in axes"
    :key="axis.label"
    :label="axis.label"
    :description="axis.description"
    :showReset="true"
    @reset="resetRange(axis.min, axis.max)"
  >
    <div class="flex items-center gap-2">
      <input
        type="number"
        min="0"
        max="100"
        class="input input-bordered w-24"
        :value="stage[axis.min]"
        @change="(e) => updateRange(axis.min, axis.max, 'min', e)"
      />
      <span>〜</span>
      <input
        type="number"
        min="0"
        max="100"
        class="input input-bordered w-24"
        :value="stage[axis.max]"
        @change="(e) => updateRange(axis.min, axis.max, 'max', e)"
      />
      <span class="text-sm">%</span>
    </div>
  </SettingItem>

  <!-- 既定のモーション -->
  <SettingItem
    label="既定の登場・退場アニメーション"
    description="登場と退場で同じモーションを使います"
    :showReset="true"
    @reset="resetField('motion')"
  >
    <select
      :value="stage.motion"
      @change="(e) => update('motion', (e.target as HTMLSelectElement).value as EnterMotionType)"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="(value, key) in enterMotionMap" :key="key" :value="key">
        {{ value.label }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import type { EnterMotionType } from '@/types/OmikujiData'
  import { CharacterStageSchema, type CharacterStageType } from '@/types/ui'
  import { enterMotionMap } from '@/maps/OmikujiData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import CharacterStagePreview from './CharacterStagePreview.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore

  // 保存データは変更した項目だけの部分オブジェクトになりうる(updateItemSettings がマージするだけ)ため、
  // 本番(CharacterStage.vue)と同じく parse して、未設定の項目をスキーマの既定値で埋める
  const stage = computed(() => CharacterStageSchema.parse(data.value.ui.settings.characterStage ?? {}))

  const axes = [
    { label: '既定の位置X', description: '0〜100(%)。キャラの中心が基準。最小と最大が違えば範囲内でランダム', min: 'xMin', max: 'xMax' },
    { label: '既定の位置Y', description: '0〜100(%)。画面上端が 0、キャラの下辺が基準', min: 'yMin', max: 'yMax' },
  ] as const

  const update = <K extends keyof CharacterStageType>(field: K, value: CharacterStageType[K]) => {
    updateItemSettings('characterStage', { [field]: value })
  }

  const resetField = (field: keyof CharacterStageType) => {
    update(field, CharacterStageSchema.parse({})[field])
  }

  // 範囲の入力: 0〜100 に収め、最小 > 最大にならないよう入れ替えて保存する
  type RangeKey = 'xMin' | 'xMax' | 'yMin' | 'yMax'
  const updateRange = (minKey: RangeKey, maxKey: RangeKey, edited: 'min' | 'max', e: Event) => {
    const raw = Number((e.target as HTMLInputElement).value)
    const value = Math.min(100, Math.max(0, Number.isFinite(raw) ? raw : 0))
    const a = edited === 'min' ? value : stage.value[minKey]
    const b = edited === 'max' ? value : stage.value[maxKey]
    updateItemSettings('characterStage', { [minKey]: Math.min(a, b), [maxKey]: Math.max(a, b) })
  }

  const resetRange = (minKey: RangeKey, maxKey: RangeKey) => {
    const d = CharacterStageSchema.parse({})
    updateItemSettings('characterStage', { [minKey]: d[minKey], [maxKey]: d[maxKey] })
  }
</script>
