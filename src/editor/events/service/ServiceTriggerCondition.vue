<!-- src/editor/events/service/ServiceTriggerCondition.vue -->
<template>
  <SettingItem :icon="icon" :label="label" :description="description">
    <!-- 比較方法 -->
    <div class="flex flex-wrap gap-2 pb-2">
      <select
        :value="modelValue?.comparison"
        @change="updateField('comparison', ($event.target as HTMLSelectElement).value)"
        class="select select-bordered select-sm flex-1"
      >
        <option v-for="(info, key) in comparisonMap" :key="key" :value="key">
          {{ t(`mapText.serviceCondition.${key}.label`) }}
        </option>
      </select>
    </div>

    <!-- 数値入力（特定の比較方法のみ） -->
    <div v-if="needsValue" class="flex flex-wrap gap-2">
      <input
        type="number"
        :value="modelValue?.value"
        @input="updateField('value', Number(($event.target as HTMLInputElement).value))"
        min="0"
        class="input input-bordered input-sm flex-1"
        :placeholder="valuePlaceholder"
      />
    </div>

    <!-- 説明テキスト -->
    <p v-if="comparisonDescription" class="text-xs opacity-70 mt-1">
      {{ comparisonDescription }}
    </p>
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'

  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { ServiceConditionType } from '@/types/OmikujiData'
  import { serviceConditionMap, serviceSimpleComparisonConditionMap } from '@/maps/OmikujiData'
  import type { DisplayMeta } from '@/editor/types/DisplayMeta'
  import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

  const { t, te } = useI18n()
  const props = defineProps<{
    modelValue?: ServiceConditionType
    label: string
    description: string
    hasPeak: boolean
    icon?: LucideIconName
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: ServiceConditionType): void
  }>()

  // ★ 初期値生成
  const defaultCondition = (): ServiceConditionType => ({
    comparison: 'changed',
    value: 0,
  })

  // ★ 初回だけ初期値を emit
  if (!props.modelValue) {
    emit('update:modelValue', defaultCondition())
  }

  // 以下は既存ロジック
  const comparisonMap = computed<Record<string, DisplayMeta>>(() =>
    props.hasPeak ? serviceConditionMap : serviceSimpleComparisonConditionMap
  )

  const needsValue = computed(() => {
    const comparison = props.modelValue?.comparison
    return ['lowerBound', 'upperBound', 'equal', 'loop'].includes(comparison || '')
  })

  const valuePlaceholder = computed(() => {
    const comparison = props.modelValue?.comparison
    switch (comparison) {
      case 'lowerBound':
        return t('serviceTrigger.placeholder.lowerBound')
      case 'upperBound':
        return t('serviceTrigger.placeholder.upperBound')
      case 'equal':
        return t('serviceTrigger.placeholder.equal')
      case 'loop':
        return t('serviceTrigger.placeholder.loop')
      default:
        return t('serviceTrigger.placeholder.default')
    }
  })

  const comparisonDescription = computed(() => {
    const comparison = props.modelValue?.comparison
    if (!comparison) return ''
    return te(`mapText.serviceCondition.${comparison}.description`) ? t(`mapText.serviceCondition.${comparison}.description`) : ''
  })

  const updateField = (field: 'comparison' | 'value', value: string | number) => {
    const updated = { ...(props.modelValue ?? defaultCondition()) }

    if (field === 'comparison') {
      updated.comparison = value as ServiceConditionType['comparison']

      // comparison に応じて value を削除
      if (!['lowerBound', 'upperBound', 'equal', 'loop'].includes(updated.comparison)) {
        delete updated.value
      }
    } else {
      // field === 'value'
      updated.value = value as number
    }

    emit('update:modelValue', updated)
  }
</script>
