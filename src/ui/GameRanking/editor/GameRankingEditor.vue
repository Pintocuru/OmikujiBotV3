<!-- src/ConfigMaker/UiEditor/GameRanking/GameRankingEditor.vue -->
<template>
  <!-- ランキングプレビュー -->
  <HudPreview :isAdminOnly="true">
    <div :class="[fontFamily]">
      <GameRankingSelector :botMessageExtras="[]" :settings="ranking" />
    </div>
  </HudPreview>

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="ranking.component"
    :options="rankingComponentMap"
    @update:modelValue="(val) => update('component', val as RankingComponent)"
  />

  <!-- キャラクター -->
  <SettingItem
    label="キャラクター・カラー"
    description="表示するカラーを設定します"
    :showReset="true"
    @reset="resetField('characterKey')"
  >
    <CharacterPicker
      :modelValue="ranking.characterKey"
      allowEmpty
      emptyLabel="なし"
      @update:modelValue="(key) => update('characterKey', key)"
    />
  </SettingItem>

  <!-- タイトル -->
  <SettingItem
    label="ランキングタイトル"
    description="ランキングのタイトルを設定します"
    :showReset="true"
    @reset="resetField('title')"
  >
    <input
      type="text"
      class="input input-bordered w-full"
      :value="ranking.title"
      @input="(e) => update('title', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- 順位のソート -->
    <SettingItem label="順位のソート" description="得点の高い順・低い順・新しい順から選べます">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(order, key) in rankingSortOrderMap"
          :key="key"
          class="badge badge-lg cursor-pointer whitespace-nowrap"
          :class="ranking.sortOrder === key ? 'badge-primary' : 'badge-outline'"
          @click="ranking.sortOrder = key"
        >
          {{ order }}
        </div>
      </div>
    </SettingItem>

    <!-- 表示するランキング数 -->
    <SettingItem
      label="表示件数"
      description="ランキングに表示する件数を設定します(最大20)"
      :forceMode="'pro'"
      :showReset="true"
      @reset="resetField('limit')"
    >
      <input
        type="number"
        min="1"
        max="20"
        class="input input-bordered w-24"
        :value="ranking.limit"
        @input="(e) => update('limit', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import {
    GameRankingType,
    RankingComponent,
    rankingComponentMap,
    rankingSortOrderMap,
  } from '@/ui/types/GameRankingSchema'
  import CharacterPicker from '@/editor/parts/CharacterPicker.vue'
  import { GameRankingSchema } from '@/ui/types/GameRankingSchema'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore
  const fontFamily = computed(() => data.value.ui.fontFamily)

  const ranking = computed(() => data.value.ui.settings.gameRanking ?? GameRankingSchema.parse({}))

  // 更新関数
  const update = <K extends keyof GameRankingType>(field: K, value: GameRankingType[K]) => {
    updateItemSettings('gameRanking', { [field]: value })
  }

  // リセット関数
  const resetField = (field: keyof GameRankingType) => {
    update(field, GameRankingSchema.parse({})[field])
  }
</script>
