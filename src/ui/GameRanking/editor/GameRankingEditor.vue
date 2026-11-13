<!-- src/ui/GameRanking/editor/GameRankingEditor.vue -->
<template>
  <!-- ランキングプレビュー -->
  <HudPreview :isAdminOnly="true">
    <GameRankingSelector
      :rankingMessages="previewMessages"
      :settings="ranking"
      :fontFamily="fontFamily"
      editorPreview
    />

    <template #hud>
      <button
        type="button"
        class="btn btn-xs btn-ghost tooltip tooltip-left"
        :data-tip="t('uiSettings.gameRanking.preview.add')"
        :aria-label="t('uiSettings.gameRanking.preview.add')"
        @click="addPreviewMessage"
      >
        <Plus :size="16" />
      </button>
      <button
        type="button"
        class="btn btn-xs btn-ghost tooltip tooltip-left"
        :data-tip="t('uiSettings.gameRanking.preview.clear')"
        :aria-label="t('uiSettings.gameRanking.preview.clear')"
        @click="clearPreviewMessages"
      >
        <Trash2 :size="16" />
      </button>
    </template>
  </HudPreview>

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="ranking.component"
    :options="componentOptions"
    @update:modelValue="(val) => update('component', val)"
  />

  <!-- カラー設定 -->
  <SettingItem
    labelKey="uiSettings.common.color.label"
    descriptionKey="uiSettings.common.color.description"
    layout="vertical"
  >
    <ColorPicker :modelValue="ranking.color" @update:modelValue="(val) => update('color', val)" />
  </SettingItem>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- 順位のソート -->
    <SettingItem
      labelKey="uiSettings.gameRanking.sortOrder.label"
      descriptionKey="uiSettings.gameRanking.sortOrder.description"
      layout="vertical"
    >
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(order, key) in rankingSortOrderMap"
          :key="key"
          class="badge badge-lg cursor-pointer whitespace-nowrap"
          :class="ranking.sortOrder === key ? 'badge-primary' : 'badge-outline'"
          @click="update('sortOrder', key)"
        >
          {{ t(order) }}
        </div>
      </div>
    </SettingItem>

    <!-- 表示するランキング数 -->
    <SettingItem
      labelKey="uiSettings.gameRanking.limit.label"
      descriptionKey="uiSettings.gameRanking.limit.description"
      layout="vertical"
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

  <!-- ユーザーごとの重複 -->
  <SettingItem
    labelKey="uiSettings.gameRanking.uniqueUser.label"
    descriptionKey="uiSettings.gameRanking.uniqueUser.description"
    layout="vertical"
  >
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :checked="ranking.uniqueUser"
      @change="(e) => update('uniqueUser', (e.target as HTMLInputElement).checked)"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, ref, watch } from 'vue'
  import { Plus, Trash2 } from 'lucide-vue-next'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { GameRankingType } from '@/types/ui/GameRankingSchema'
  import type { BotMessageRankingType } from '@/types/generator'
  import { generateDummyMessages } from '@/common/MockUser/MockGenerators'
  import { rankingSortOrderMap } from '@/maps/ui'
  import { getGameRankingComponent, getGameRankingComponentSets } from '../GameRankingRegistry'
  import { GameRankingSchema } from '@/types/ui/GameRankingSchema'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import GameRankingSelector from '@/ui/GameRanking/GameRankingSelector.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'

  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore
  const fontFamily = computed(() => data.value.ui.fontFamily)

  const ranking = computed(() => GameRankingSchema.parse(data.value.ui.settings.gameRanking ?? {}))

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const componentOptions = computed(() => {
    const options: Record<string, { label: string }> = {}
    const currentId = ranking.value.component
    if (!getGameRankingComponent(currentId))
      options[currentId] = { label: t('uiSettings.common.unregistered', { id: currentId }) }
    for (const set of Object.values(getGameRankingComponentSets())) {
      for (const [id, definition] of Object.entries(set)) options[id] = { label: t(definition.labelKey) }
    }
    return options
  })

  // プレビュー用のダミーデータ(エディターだけで持つ。本番の配信画面には入れない)
  const PREVIEW_MAX = 50
  const previewMessages = ref<BotMessageRankingType[]>(generateDummyMessages({ limit: ranking.value.limit }))

  // ダミーを1件追加(timestamp が新しいので、新着順では先頭に入る)
  const addPreviewMessage = () => {
    previewMessages.value = [...previewMessages.value, ...generateDummyMessages({ limit: 1 })].slice(-PREVIEW_MAX)
  }

  // 空にして、記録がないときの表示を確認する
  const clearPreviewMessages = () => {
    previewMessages.value = []
  }

  // 表示件数を増やしたとき、足りない分のダミーを補う(空にした状態のときは補わない)
  watch(
    () => ranking.value.limit,
    (limit, prevLimit) => {
      const shortage = limit - previewMessages.value.length
      if (limit > prevLimit && previewMessages.value.length > 0 && shortage > 0) {
        previewMessages.value = [...previewMessages.value, ...generateDummyMessages({ limit: shortage })]
      }
    }
  )

  // 更新関数
  const update = <K extends keyof GameRankingType>(field: K, value: GameRankingType[K]) => {
    updateItemSettings('gameRanking', { [field]: value })
  }

  // リセット関数
  const resetField = (field: keyof GameRankingType) => {
    update(field, GameRankingSchema.parse({})[field])
  }
</script>
