<!-- src/editor/events/reaction/ReactionTriggerEditor.vue -->
<template>
  <!-- リアクション選択 -->
  <SettingItem icon="ThumbsUp" :label="t('reactionTrigger.targetLabel')" :description="t('reactionTrigger.targetDescription')">
    <div class="flex flex-wrap gap-2">
      <label v-for="(label, key) in reactionMap.youtube" :key="key" class="cursor-pointer">
        <input type="checkbox" class="hidden" :checked="reactions.includes(key)" @change="toggleReaction(key)" />
        <span class="badge badge-lg select-none" :class="reactions.includes(key) ? 'badge-primary' : 'badge-ghost'">
          {{ label }}
        </span>
      </label>
    </div>
  </SettingItem>

  <!-- 条件 -->
  <SettingItem icon="Activity" :label="t('reactionTrigger.conditionLabel')" :description="t('reactionTrigger.conditionDescription')">
    <select class="select select-bordered select-sm w-full" v-model="comparison">
      <option v-for="(_, key) in reactionConditionMap" :key="key" :value="key">
        {{ t(`mapText.reactionCondition.${key}.label`) }}
      </option>
    </select>

    <!-- 説明 -->
    <p class="text-xs opacity-70 mt-1">
      {{ t(`mapText.reactionCondition.${comparison}.description`) }}
    </p>
  </SettingItem>

  <!-- 数値指定 -->
  <SettingItem icon="Sliders" :label="t('reactionTrigger.thresholdLabel')" :description="t('reactionTrigger.thresholdDescription')">
    <input
      type="number"
      min="0"
      class="input input-bordered input-sm w-full"
      v-model.number="value"
      :placeholder="t('reactionTrigger.thresholdPlaceholder')"
    />
  </SettingItem>

  <!-- レベルでの発動 -->
  <SettingItem icon="Zap" v-if="comparison !== 'milestone'" :label="t('reactionTrigger.levelLabel')" :description="t('reactionTrigger.levelDescription')">
    <div class="w-full space-y-2">
      <!-- スライダー -->
      <input
        type="range"
        min="0"
        max="3"
        step="1"
        class="range w-full"
        :class="rangeClassMap[triggerLevel]"
        v-model.number="triggerLevel"
      />

      <!-- アイコン表示 -->
      <div class="flex justify-between items-center px-1">
        <component
          v-for="(Icon, i) in icons"
          :key="i"
          :is="Icon"
          class="w-4 h-4"
          :class="i === triggerLevel ? 'opacity-100 scale-110' : 'opacity-20'"
        />
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { VolumeX, Volume2, Dot } from 'lucide-vue-next'
  import { ReactionReaction, ReactionTriggerType } from '@/types/OmikujiData'
  import { reactionConditionMap } from '@/maps/OmikujiData'
  import { reactionMap } from '@/maps/OmikujiData'

  const { t } = useI18n()
  const props = defineProps<{
    modelValue: ReactionTriggerType
    selectedItemKey: string | null
  }>()

  const { updateEventProperty } = useOmikujiStore()

  const createComputed = <T extends keyof ReactionTriggerType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => {
        if (!props.selectedItemKey) return
        const updated = { ...props.modelValue, [key]: value }
        updateEventProperty('reactions', props.selectedItemKey, 'trigger', updated)
      },
    })

  const reactions = createComputed('reactions')
  const comparison = createComputed('comparison')
  const value = createComputed('value')
  const triggerLevel = createComputed('triggerLevel')

  // toggle
  const toggleReaction = (key: ReactionReaction) => {
    const set = new Set(reactions.value)
    if (set.has(key)) set.delete(key)
    else set.add(key)
    reactions.value = Array.from(set)
  }

  const icons = [VolumeX, Dot, Dot, Volume2]
  const rangeClassMap = ['', 'range-success', 'range-warning', 'range-error'] as const
</script>
