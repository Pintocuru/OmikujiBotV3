<!-- src/ui/CharacterStage/editor/CharacterStageSlotsEditor.vue -->
<template>
  <SettingItem layout="vertical" icon="MessageSquare" labelKey="scenarioStep.messageSettings.slots">
    <p class="mb-2 text-xs opacity-60">{{ t('uiSettings.characterStage.slots.hint') }}</p>

    <!-- 表示秒数 -->
    <div class="mb-3">
      <p class="mb-1 text-sm font-medium">{{ t('uiSettings.slots.characterStage.seconds.title') }}</p>
      <div class="flex items-center gap-2">
        <input
          type="number"
          min="0"
          step="1"
          class="input input-bordered input-sm w-28"
          :placeholder="String(defaults.seconds)"
          :value="getRaw('seconds')"
          @change="setNumber('seconds', $event, { min: 0 })"
        />
        <span class="text-sm">{{ t('uiSettings.characterStage.slots.secondsUnit') }}</span>
        <button v-if="getRaw('seconds') !== ''" class="btn btn-ghost btn-xs" @click="clear('seconds')">
          {{ t('uiSettings.common.resetToDefault') }}
        </button>
      </div>
    </div>

    <!-- 位置X / 位置Y -->
    <div v-for="axis in axes" :key="axis.key" class="mb-3">
      <p class="mb-1 text-sm font-medium">
        {{ t(`uiSettings.characterStage.slots.${axis.key}.label`) }}
        <span class="ml-2 text-xs opacity-60">{{ t(`uiSettings.characterStage.slots.${axis.key}.description`) }}</span>
      </p>
      <div class="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max="100"
          class="input input-bordered input-sm w-24"
          :placeholder="String(defaults[axis.min])"
          :value="getRaw(axis.min)"
          @change="setRange(axis.min, axis.max, 'min', $event)"
        />
        <span>〜</span>
        <input
          type="number"
          min="0"
          max="100"
          class="input input-bordered input-sm w-24"
          :placeholder="String(defaults[axis.max])"
          :value="getRaw(axis.max)"
          @change="setRange(axis.min, axis.max, 'max', $event)"
        />
        <span class="text-sm">%</span>
        <button
          v-if="getRaw(axis.min) !== '' || getRaw(axis.max) !== ''"
          class="btn btn-ghost btn-xs"
          @click="clear(axis.min, axis.max)"
        >
          {{ t('uiSettings.common.resetToDefault') }}
        </button>
      </div>
    </div>

    <!-- 基準点 -->
    <div class="mb-3">
      <p class="mb-1 text-sm font-medium">
        {{ t('uiSettings.slots.characterStage.anchor.title') }}
        <span class="ml-2 text-xs opacity-60">{{ t('uiSettings.characterStage.slots.anchorHint') }}</span>
      </p>
      <select
        class="select select-bordered select-sm w-full max-w-xs"
        :value="getRaw('anchor')"
        @change="setRaw('anchor', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">
          {{
            t('uiSettings.common.defaultOption', {
              value: t(`uiSettings.characterStage.slots.anchors.${defaults.anchor}`),
            })
          }}
        </option>
        <option v-for="k in stageAnchors" :key="k" :value="k">
          {{ t(`uiSettings.characterStage.slots.anchors.${k}`) }}
        </option>
      </select>
    </div>

    <!-- サイズ倍率 -->
    <div class="mb-3">
      <p class="mb-1 text-sm font-medium">{{ t('uiSettings.slots.characterStage.scale.title') }}</p>
      <div class="flex items-center gap-2">
        <input
          type="number"
          min="0.1"
          max="10"
          step="0.1"
          class="input input-bordered input-sm w-28"
          placeholder="1"
          :value="getRaw('scale')"
          @change="setNumber('scale', $event, { min: 0.1 })"
        />
        <span class="text-sm">{{ t('uiSettings.characterStage.slots.scaleUnit', { px: previewWidth }) }}</span>
        <button v-if="getRaw('scale') !== ''" class="btn btn-ghost btn-xs" @click="clear('scale')">
          {{ t('uiSettings.common.resetToDefault') }}
        </button>
      </div>
    </div>

    <!-- モーション -->
    <div class="mb-3">
      <p class="mb-1 text-sm font-medium">{{ t('uiSettings.slots.characterStage.motion.title') }}</p>
      <select
        class="select select-bordered select-sm w-full max-w-xs"
        :value="getRaw('motion')"
        @change="setRaw('motion', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">
          {{ t('uiSettings.common.defaultOption', { value: t(`mapText.enterMotion.${defaults.motion}.label`) }) }}
        </option>
        <option v-for="k in enterMotions" :key="k" :value="k">{{ t(`mapText.enterMotion.${k}.label`) }}</option>
      </select>
    </div>

    <!-- アニメーション速度(登場・退場とも) -->
    <div class="mb-3">
      <p class="mb-1 text-sm font-medium">{{ t('uiSettings.slots.characterStage.motionDuration.title') }}</p>
      <div class="flex items-center gap-2">
        <input
          type="number"
          min="0.4"
          max="5"
          step="0.2"
          class="input input-bordered input-sm w-28"
          placeholder="1"
          :value="getRaw('motionDuration')"
          @change="setNumber('motionDuration', $event, { min: 0.4, max: 5 })"
        />
        <span class="text-sm">{{ t('uiSettings.characterStage.slots.durationUnit') }}</span>
        <button v-if="getRaw('motionDuration') !== ''" class="btn btn-ghost btn-xs" @click="clear('motionDuration')">
          {{ t('uiSettings.common.resetToDefault') }}
        </button>
      </div>
    </div>

    <!-- 前の表示を消す -->
    <div class="mb-3">
      <p class="mb-1 text-sm font-medium">{{ t('uiSettings.slots.characterStage.clearPrevious.title') }}</p>
      <select
        class="select select-bordered select-sm w-full max-w-xs"
        :value="getRaw('clearPrevious')"
        @change="setRaw('clearPrevious', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">{{ t('uiSettings.common.defaultOnly') }}</option>
        <option value="true">{{ t('uiSettings.characterStage.slots.clearYes') }}</option>
        <option value="false">{{ t('uiSettings.characterStage.slots.clearNo') }}</option>
      </select>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { STAGE_DEFAULTS } from '../resolveStageSlots'
  import { enterMotions } from '@/types/OmikujiData'
  import { stageAnchors } from '@/types/ui'
  import { useI18n } from 'vue-i18n'
  import { CharacterStageSlotMap, type CharacterStageSlotKey } from '@/types/generator'

  const { t } = useI18n()

  const props = defineProps<{ slots: Record<string, string> }>()
  const emit = defineEmits<{ 'update:slots': [slots: Record<string, string>] }>()

  const meta = CharacterStageSlotMap
  // 既定値(placeholder 表示用)
  const defaults = STAGE_DEFAULTS

  const axes = [
    { key: 'axisX', min: 'xMin', max: 'xMax' },
    { key: 'axisY', min: 'yMin', max: 'yMax' },
  ] as const

  const getRaw = (key: CharacterStageSlotKey): string => props.slots[meta[key].slot] ?? ''

  // 空文字は slot ごと削除して保存する(空 = 既定値)
  const patch = (entries: Partial<Record<CharacterStageSlotKey, string>>) => {
    const next = { ...props.slots }
    for (const [key, value] of Object.entries(entries) as [CharacterStageSlotKey, string][]) {
      const slot = meta[key].slot
      if (value === '') delete next[slot]
      else next[slot] = value
    }
    emit('update:slots', next)
  }

  const setRaw = (key: CharacterStageSlotKey, value: string) => patch({ [key]: value })

  const clear = (...keys: CharacterStageSlotKey[]) => patch(Object.fromEntries(keys.map((k) => [k, ''])))

  const toNumberString = (e: Event, min?: number, max?: number): string => {
    const raw = (e.target as HTMLInputElement).value.trim()
    if (raw === '') return ''
    const n = Number(raw)
    if (!Number.isFinite(n)) return ''
    return String(Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n)))
  }

  const setNumber = (key: CharacterStageSlotKey, e: Event, o: { min?: number; max?: number } = {}) =>
    patch({ [key]: toNumberString(e, o.min, o.max) })

  // 範囲: 両方入っていて min > max なら入れ替える。片方だけ空の場合は既定値側と比較
  const setRange = (minKey: CharacterStageSlotKey, maxKey: CharacterStageSlotKey, edited: 'min' | 'max', e: Event) => {
    const value = toNumberString(e, 0, 100)
    let a = edited === 'min' ? value : getRaw(minKey)
    let b = edited === 'max' ? value : getRaw(maxKey)
    if (a !== '' && b !== '' && Number(a) > Number(b)) [a, b] = [b, a]
    patch({ [minKey]: a, [maxKey]: b })
  }

  const previewWidth = computed(() => {
    const s = Number(getRaw('scale'))
    return Math.round(defaults.characterSize * (Number.isFinite(s) && s > 0 ? s : 1))
  })
</script>
