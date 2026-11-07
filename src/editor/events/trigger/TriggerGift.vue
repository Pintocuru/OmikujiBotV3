<!-- src/editor/events/trigger/TriggerGift.vue -->
<template>
  <SettingItem icon="Gift" labelKey="triggerGift.label" descriptionKey="triggerGift.description">
    <!-- ギフトの種類(空 = 種類を問わない) -->
    <p class="mb-1 text-xs opacity-70">{{ t('triggerGift.kindsLabel') }}</p>
    <div class="mb-3 flex flex-wrap gap-2">
      <label v-for="kind in giftKinds" :key="kind" class="cursor-pointer">
        <input
          type="checkbox"
          class="hidden"
          :checked="(kinds ?? []).includes(kind)"
          @change="toggleKind(kind)"
        />
        <span class="badge badge-sm select-none" :class="(kinds ?? []).includes(kind) ? 'badge-primary' : 'badge-ghost'">
          {{ t(`triggerGift.kinds.${kind}.label`) }}
        </span>
      </label>
    </div>

    <!-- 金額の段階(有料ギフトにだけ効く) -->
    <p class="mb-1 text-xs opacity-70">{{ t('triggerGift.tiersLabel') }}</p>
    <div class="flex flex-wrap gap-2">
      <label v-for="condition in giftConditions" :key="condition" class="cursor-pointer">
        <input
          type="checkbox"
          class="hidden"
          :checked="(modelValue ?? []).includes(condition)"
          @change="toggleOption(condition)"
        />
        <span
          class="badge badge-sm select-none"
          :class="(modelValue ?? []).includes(condition) ? 'badge-secondary' : 'badge-ghost'"
        >
          {{ t(`triggerGift.conditions.${condition}.label`) }}
        </span>
      </label>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { GiftConditionType, GiftKindType, giftConditions, giftKinds } from '@/types/engine/trigger'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue?: GiftConditionType[] // 金額の段階(gift)
    kinds?: GiftKindType[] // ギフトの種類(giftKinds)
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: GiftConditionType[]]
    'update:kinds': [value: GiftKindType[]]
  }>()

  // 配列の要素の切り替え
  const toggle = <T,>(current: T[], value: T): T[] =>
    current.includes(value) ? current.filter((v) => v !== value) : [...current, value]

  const toggleOption = (value: GiftConditionType) => emit('update:modelValue', toggle(props.modelValue ?? [], value))
  const toggleKind = (value: GiftKindType) => emit('update:kinds', toggle(props.kinds ?? [], value))
</script>
