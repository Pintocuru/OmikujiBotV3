<!-- src/editor/events/service/ServiceTrigger.vue -->
<template>
  <!-- 条件タイプ選択（単一選択） -->
  <SettingItem icon="Filter" :label="t('serviceTrigger.conditionLabel')" :description="t('serviceTrigger.conditionDescription')">
    <div class="flex flex-wrap gap-2">
      <label v-for="(value, key) in serviceTriggerConditionMap" :key="key" class="cursor-pointer">
        <input type="radio" class="hidden" :checked="selectedCondition === key" @change="setCondition(key)" />
        <span class="badge badge-lg select-none" :class="selectedCondition === key ? 'badge-primary' : 'badge-ghost'">
          {{ t(`serviceTrigger.conditions.${key}`) }}
        </span>
      </label>
    </div>
  </SettingItem>

  <!-- 高評価条件 -->
  <TriggerMetaCondition
    v-if="selectedCondition === 'upVote'"
    v-model="upVote"
    :label="t('serviceTrigger.upVoteLabel')"
    :description="t('serviceTrigger.upVoteDescription')"
    icon="ThumbsUp"
    :has-peak="true"
  />

  <!-- 視聴者数条件 -->
  <TriggerMetaCondition
    v-if="selectedCondition === 'viewer'"
    v-model="viewer"
    icon="Users"
    :label="t('serviceTrigger.viewerLabel')"
    :description="t('serviceTrigger.viewerDescription')"
    :has-peak="true"
  />

  <!-- 登録者数の場合の説明 -->
  <InformationCard v-if="selectedCondition === 'follower'">
    <p class="leading-relaxed">
      <code class="label bg-accent text-accent-content">{{ t('serviceTrigger.follower.title') }}</code><br />
      {{ t('serviceTrigger.follower.line1') }}<br />
      {{ t('serviceTrigger.follower.line2') }}<br />
      {{ t('serviceTrigger.follower.line3') }}
    </p>
  </InformationCard>

  <!-- 配信経過時間条件 -->
  <SettingItem
    icon="Clock"
    v-if="selectedCondition === 'elapsedMinutes'"
    :label="t('serviceTrigger.elapsedLabel')"
    :description="t('serviceTrigger.elapsedDescription')"
  >
    <input
      type="number"
      min="0"
      class="input input-bordered input-sm w-full"
      :value="elapsedMinutes"
      @input="elapsedMinutes = Number(($event.target as HTMLInputElement).value)"
      :placeholder="t('serviceTrigger.elapsedPlaceholder')"
    />
  </SettingItem>

  <!-- 登録者数の場合の説明 -->
  <InformationCard v-if="selectedCondition === 'follower' || selectedCondition === 'elapsedMinutes'" variant="warning">
    <p class="leading-relaxed">
      ・{{ t('serviceTrigger.beta.prefix') }}
      <code class="label bg-accent text-accent-content">{{ t(`serviceTrigger.conditions.${selectedCondition}`) }}</code>
      {{ t('serviceTrigger.beta.suffix') }}<br />
      {{ t('serviceTrigger.beta.line2') }}
    </p>
  </InformationCard>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { ServiceTriggerCondition, ServiceTriggerType } from '@/types/OmikujiData'
  import { serviceTriggerConditionMap } from '@/maps/OmikujiData'
  import TriggerMetaCondition from './ServiceTriggerCondition.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import InformationCard from '@/editor/parts/InformationCard.vue'

  const { t } = useI18n()
  const props = defineProps<{
    modelValue: ServiceTriggerType
    selectedItemKey: string | null
  }>()

  // Pinia store
  const { updateEventProperty } = useOmikujiStore()

  // 共通 computed
  const createComputed = <T extends keyof ServiceTriggerType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => {
        if (!props.selectedItemKey) return
        const updated = { ...props.modelValue, [key]: value }
        updateEventProperty('services', props.selectedItemKey, 'trigger', updated)
      },
    })

  // 単一 condition
  const selectedCondition = createComputed('condition')

  // 各条件の値
  const upVote = createComputed('upVote')
  const viewer = createComputed('viewer')
  const elapsedMinutes = createComputed('elapsedMinutes')

  // 単一選択
  const setCondition = (condition: ServiceTriggerCondition) => {
    selectedCondition.value = condition
  }
</script>
