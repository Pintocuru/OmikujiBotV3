<!-- src/ui/game/DeadAir/editor/DeadAirEditor.vue -->
<template>
  <!-- プレビュー -->
  <HudPreview>
    <DeadAirSelector
      :settings="deadAir"
      :phase="phase"
      :formatted-time="formattedTime"
      :is-warning="isWarning"
      :is-critical="isCritical"
      :current-lives="currentLives"
      :bonus-fraction="bonusFraction"
      :life-fraction="lifeFraction"
      :optional-value="optionalValue"
      :font-family="fontFamily"
      editorPreview
    />
    <template #hud>
      <DeadAirPreviewControls v-model:speed="speed" :counterKeys="previewCounterKeys" @bump="bump" @restart="restart" />
    </template>
  </HudPreview>

  <!-- 表示コンポーネントの選択 -->
  <DisplayStyleSelector
    :modelValue="deadAir.component"
    :options="componentOptions"
    @update:modelValue="(val) => update('component', val)"
  />

  <!-- 背景色 -->
  <SettingItem labelKey="uiSettings.deadAir.obstacle.label" descriptionKey="uiSettings.deadAir.obstacle.description">
    <select
      class="select select-bordered select-sm"
      :value="deadAir.obstacle"
      @change="(e) => update('obstacle', (e.target as HTMLSelectElement).value as DeadAirType['obstacle'])"
    >
      <option value="black">{{ $t('uiSettings.deadAir.obstacle.black') }}</option>
      <option value="white">{{ $t('uiSettings.deadAir.obstacle.white') }}</option>
    </select>
  </SettingItem>

  <!-- 初期の残り時間(分) -->
  <SettingItem
    labelKey="uiSettings.deadAir.initialMinutes.label"
    descriptionKey="uiSettings.deadAir.initialMinutes.description"
  >
    <input
      type="number"
      min="1"
      max="60"
      class="input input-bordered input-sm w-24"
      :value="deadAir.initialMinutes"
      @change="(e) => update('initialMinutes', toNumber(e, 1, 60, deadAir.initialMinutes))"
    />
  </SettingItem>

  <!-- 初期のライフ -->
  <SettingItem
    labelKey="uiSettings.deadAir.initialLives.label"
    descriptionKey="uiSettings.deadAir.initialLives.description"
  >
    <input
      type="number"
      min="3"
      max="10"
      class="input input-bordered input-sm w-24"
      :value="deadAir.initialLives"
      @change="(e) => update('initialLives', toNumber(e, 3, 10, deadAir.initialLives))"
    />
  </SettingItem>

  <!-- ボーナス -->
  <SettingItem labelKey="uiSettings.deadAir.bonus.label" descriptionKey="uiSettings.deadAir.bonus.description">
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :checked="deadAir.bonusEnabled"
      @change="(e) => update('bonusEnabled', (e.target as HTMLInputElement).checked)"
    />
  </SettingItem>

  <!-- 表示だけするカウンター -->
  <SettingItem
    labelKey="uiSettings.deadAir.optionalCounter.label"
    descriptionKey="uiSettings.deadAir.optionalCounter.description"
  >
    <input
      type="text"
      list="deadAirCounterKeys"
      class="input input-bordered input-sm w-40"
      :value="deadAir.optionalCounterKey ?? ''"
      @change="(e) => update('optionalCounterKey', (e.target as HTMLInputElement).value.trim() || null)"
    />
  </SettingItem>

  <!-- イベントルール -->
  <SettingItem
    labelKey="uiSettings.deadAir.eventRules.label"
    descriptionKey="uiSettings.deadAir.eventRules.description"
  >
    <div class="flex flex-col gap-1">
      <div v-for="(rule, i) in deadAir.eventRules" :key="i" class="flex flex-wrap items-center gap-1">
        <input
          type="text"
          list="deadAirCounterKeys"
          class="input input-bordered input-xs w-28"
          :value="rule.counterKey"
          @change="(e) => updateRule(i, { counterKey: (e.target as HTMLInputElement).value.trim() })"
        />
        <span class="text-xs">{{ $t('uiSettings.deadAir.eventRules.every') }}</span>
        <input
          type="number"
          min="1"
          class="input input-bordered input-xs w-16"
          :value="rule.threshold"
          @change="(e) => updateRule(i, { threshold: toNumber(e, 1, Infinity, rule.threshold) })"
        />
        <span class="text-xs">{{ $t('uiSettings.deadAir.eventRules.then') }}</span>
        <select
          class="select select-bordered select-xs"
          :value="rule.effect"
          @change="
            (e) => updateRule(i, { effect: (e.target as HTMLSelectElement).value as DeadAirEventRuleType['effect'] })
          "
        >
          <option value="timer">{{ $t('uiSettings.deadAir.eventRules.timer') }}</option>
          <option value="life">{{ $t('uiSettings.deadAir.eventRules.life') }}</option>
        </select>
        <input
          type="number"
          min="1"
          max="10"
          class="input input-bordered input-xs w-14"
          :value="rule.value"
          @change="(e) => updateRule(i, { value: toNumber(e, 1, 10, rule.value) })"
        />
        <button
          class="btn btn-xs btn-ghost"
          :aria-label="$t('uiSettings.deadAir.eventRules.remove')"
          @click="removeRule(i)"
        >
          ✕
        </button>
      </div>
      <div>
        <button class="btn btn-xs" @click="addRule">{{ $t('uiSettings.deadAir.eventRules.add') }}</button>
      </div>
    </div>
  </SettingItem>

  <!-- カウンターキーの候補(組み込みのもの。変数名も自由に入力できる) -->
  <datalist id="deadAirCounterKeys">
    <option v-for="key in DEAD_AIR_BUILTIN_COUNTER_KEYS" :key="key" :value="key" />
  </datalist>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { DEAD_AIR_BUILTIN_COUNTER_KEYS, DeadAirSchema, type DeadAirEventRuleType, type DeadAirType } from '@/types/ui'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import DeadAirSelector from '@/ui/game/DeadAir/DeadAirSelector.vue'
  import DeadAirPreviewControls from './DeadAirPreviewControls.vue'
  import { useDeadAirPreview } from './useDeadAirPreview'
  import { getDeadAirComponent, getDeadAirComponentSets } from '../DeadAirRegistry'

  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore
  const fontFamily = computed(() => data.value.ui.fontFamily)

  const deadAir = computed(() => DeadAirSchema.parse(data.value.ui.settings.deadAir ?? {}))

  // プレビュー(本番と同じロジックを、仮のカウンターと倍速つきで動かす)
  const {
    speed,
    phase,
    formattedTime,
    isWarning,
    isCritical,
    currentLives,
    bonusFraction,
    lifeFraction,
    optionalValue,
    bump,
    restart,
  } = useDeadAirPreview(deadAir)

  // プレビューで増やせるカウンター。1 回の増分は、そのキーのルールの最小しきい値
  const previewCounterKeys = computed(() => {
    const steps = new Map<string, number>()
    for (const rule of deadAir.value.eventRules) {
      if (!rule.counterKey) continue
      steps.set(rule.counterKey, Math.min(steps.get(rule.counterKey) ?? Infinity, rule.threshold))
    }
    const optional = deadAir.value.optionalCounterKey
    if (optional && !steps.has(optional)) steps.set(optional, 1)
    return [...steps].map(([key, step]) => ({ key, step }))
  })

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const componentOptions = computed(() => {
    const options: Record<string, { label: string }> = {}
    const currentId = deadAir.value.component
    if (!getDeadAirComponent(currentId))
      options[currentId] = { label: t('uiSettings.common.unregistered', { id: currentId }) }
    for (const set of Object.values(getDeadAirComponentSets())) {
      for (const [id, definition] of Object.entries(set)) options[id] = { label: t(definition.labelKey) }
    }
    return options
  })

  // 数値入力を範囲内に収める(空・不正なら元の値のまま)
  const toNumber = (e: Event, min: number, max: number, fallback: number): number => {
    const n = Number((e.target as HTMLInputElement).value)
    return Number.isFinite(n) && n !== 0 ? Math.min(Math.max(Math.round(n), min), max) : fallback
  }

  // 更新関数
  const update = <K extends keyof DeadAirType>(field: K, value: DeadAirType[K]) => {
    updateItemSettings('deadAir', { [field]: value })
  }

  // イベントルールの編集(配列ごと保存する)
  const updateRule = (index: number, patch: Partial<DeadAirEventRuleType>) => {
    update(
      'eventRules',
      deadAir.value.eventRules.map((rule, i) => (i === index ? { ...rule, ...patch } : rule))
    )
  }
  const addRule = () => {
    update('eventRules', [
      ...deadAir.value.eventRules,
      { counterKey: 'totalComments', effect: 'timer', value: 1, threshold: 10 },
    ])
  }
  const removeRule = (index: number) => {
    update(
      'eventRules',
      deadAir.value.eventRules.filter((_, i) => i !== index)
    )
  }
</script>
