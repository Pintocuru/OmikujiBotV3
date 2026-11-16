<!-- src/ui/LuckyDraw/editor/LuckyDrawEditor.vue -->
<template>
  <!-- プレビュー(クリックで抽選できる。参加者はダミー) -->
  <HudPreview :isAdminOnly="true">
    <LuckyDrawSelector
      :settings="luckyDraw"
      :state="state"
      :history="history"
      :fontFamily="fontFamily"
      editorPreview
      @draw="draw()"
      @clearHistory="clearHistory"
    />
    <template #hudLeft>
      <div class="text-xs text-white bg-black/50 px-1 rounded">
        {{ t('uiSettings.luckyDraw.previewHint', { count: state.participantCount }) }}
      </div>
    </template>
    <template #hud>
      <button type="button" class="btn btn-xs btn-secondary" @click="addDummyParticipants">
        {{ t('uiSettings.luckyDraw.addDummy') }}
      </button>
    </template>
  </HudPreview>

  <!-- 表示コンポーネントの選択 -->
  <DisplayStyleSelector
    :modelValue="luckyDraw.component"
    :options="componentOptions"
    @update:modelValue="(val) => update('component', val)"
  />

  <!-- カラー設定 -->
  <SettingItem labelKey="uiSettings.common.color.label" descriptionKey="uiSettings.common.color.description">
    <ColorPicker :modelValue="luckyDraw.color" @update:modelValue="(val) => update('color', val)" />
  </SettingItem>

  <!-- アニメーション -->
  <SettingItem labelKey="uiSettings.luckyDraw.animation.label" descriptionKey="uiSettings.luckyDraw.animation.description">
    <select
      class="select select-bordered select-sm w-full max-w-xs"
      :value="luckyDraw.animation"
      @change="(e) => update('animation', (e.target as HTMLSelectElement).value as LuckyDrawType['animation'])"
    >
      <option v-for="key in enterMotions" :key="key" :value="key">{{ t(`mapText.enterMotion.${key}.label`) }}</option>
    </select>
  </SettingItem>

  <!-- 見出し -->
  <SettingItem labelKey="uiSettings.luckyDraw.label.label" descriptionKey="uiSettings.luckyDraw.label.description">
    <input
      type="text"
      class="input input-bordered input-sm w-full max-w-xs"
      :value="luckyDraw.label"
      @change="(e) => update('label', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>

  <!-- 当選人数 -->
  <SettingItem labelKey="uiSettings.luckyDraw.count.label" descriptionKey="uiSettings.luckyDraw.count.description">
    <div class="flex items-center gap-2">
      <input
        type="number"
        class="input input-bordered input-sm w-24"
        :min="LUCKY_DRAW_COUNT.min"
        :max="LUCKY_DRAW_COUNT.max"
        :value="luckyDraw.count"
        @change="(e) => update('count', Number((e.target as HTMLInputElement).value))"
      />
      <span class="text-sm opacity-70">{{ t('uiSettings.luckyDraw.count.unit') }}</span>
    </div>
  </SettingItem>

  <!-- 抽選のたびに参加者をリセット -->
  <SettingItem
    labelKey="uiSettings.luckyDraw.clearOnDraw.label"
    descriptionKey="uiSettings.luckyDraw.clearOnDraw.description"
  >
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :checked="luckyDraw.clearOnDraw"
      @change="(e) => update('clearOnDraw', (e.target as HTMLInputElement).checked)"
    />
  </SettingItem>

  <!-- 結果の表示秒数 -->
  <SettingItem
    labelKey="uiSettings.luckyDraw.displaySeconds.label"
    descriptionKey="uiSettings.luckyDraw.displaySeconds.description"
  >
    <div class="flex items-center gap-2">
      <input
        type="number"
        class="input input-bordered input-sm w-24"
        :min="LUCKY_DRAW_DISPLAY_SECONDS.min"
        :max="LUCKY_DRAW_DISPLAY_SECONDS.max"
        :value="luckyDraw.displaySeconds"
        @change="(e) => update('displaySeconds', Number((e.target as HTMLInputElement).value))"
      />
      <span class="text-sm opacity-70">{{ t('uiSettings.luckyDraw.displaySeconds.unit') }}</span>
    </div>
  </SettingItem>

  <!-- 履歴ボタン -->
  <SettingItem
    labelKey="uiSettings.luckyDraw.showHistory.label"
    descriptionKey="uiSettings.luckyDraw.showHistory.description"
  >
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :checked="luckyDraw.showHistory"
      @change="(e) => update('showHistory', (e.target as HTMLInputElement).checked)"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { LUCKY_DRAW_COUNT, LUCKY_DRAW_DISPLAY_SECONDS, LuckyDrawSchema, type LuckyDrawType } from '@/types/ui'
  import { enterMotions } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import LuckyDrawSelector from '../LuckyDrawSelector.vue'
  import { useLuckyDrawCore } from '../composables/useLuckyDrawCore'
  import { getLuckyDrawComponent, getLuckyDrawComponentSets } from '../LuckyDrawRegistry'

  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore
  const fontFamily = computed(() => data.value.ui.fontFamily)

  const luckyDraw = computed(() => LuckyDrawSchema.parse(data.value.ui.settings.luckyDraw ?? {}))

  // プレビューの抽選(配信画面と同じ状態管理。参加者はダミー)
  const { state, history, join, draw, clearHistory } = useLuckyDrawCore(luckyDraw)

  // ダミー参加者を 5 名追加する
  let dummySeq = 0
  const addDummyParticipants = () => {
    for (let i = 0; i < 5; i++) {
      dummySeq++
      join({ userName: `User${dummySeq}`, userId: `dummy-${dummySeq}`, profileImage: '', timestamp: Date.now() })
    }
  }

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const componentOptions = computed(() => {
    const options: Record<string, { label: string }> = {}
    const currentId = luckyDraw.value.component
    if (!getLuckyDrawComponent(currentId))
      options[currentId] = { label: t('uiSettings.common.unregistered', { id: currentId }) }
    for (const set of Object.values(getLuckyDrawComponentSets())) {
      for (const [id, definition] of Object.entries(set)) options[id] = { label: t(definition.labelKey) }
    }
    return options
  })

  // 更新関数
  const update = <K extends keyof LuckyDrawType>(field: K, value: LuckyDrawType[K]) => {
    updateItemSettings('luckyDraw', { [field]: value })
  }
</script>
