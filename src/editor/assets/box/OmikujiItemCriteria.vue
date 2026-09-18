<!-- src/editor/assets/box/OmikujiItemCriteria.vue -->
<template>
  <!-- 条件設定の説明 -->
  <InformationCard>
    <p>
      <code class="label bg-accent text-accent-content">追加発動条件</code>は、
      コメント内容やチャット数などを基にイベント発動を制御します。
    </p>
    <p>条件が複数ある場合は、すべて満たしたときのみ発動します。</p>
    <p>管理者限定コマンドなどの応用も可能です。</p>
  </InformationCard>

  <!-- 条件タイプ選択 -->
  <SettingItem
    label="適用する発動条件"
    description="トリガーの種類を選択"
    :variant="activeConditions.size === 0 ? 'warning' : undefined"
  >
    <div class="flex flex-wrap gap-2">
      <label v-for="condition in conditionTypes" :key="condition.value" class="cursor-pointer">
        <input
          type="checkbox"
          class="hidden"
          :checked="activeConditions.has(condition.value)"
          @change="toggleCondition(condition.value)"
        />
        <span
          class="badge badge-lg select-none"
          :class="activeConditions.has(condition.value) ? 'badge-primary' : 'badge-ghost'"
        >
          {{ condition.label }}
        </span>
      </label>
    </div>
  </SettingItem>

  <!-- ユーザーネーム条件 -->
  <TriggerUsername
    v-if="activeConditions.has('username')"
    :modelValue="criteria.userName"
    @update:modelValue="updateCriteria('userName', $event)"
  />

  <!-- アクセスレベル条件 -->
  <TriggerAccess
    v-if="activeConditions.has('access')"
    :modelValue="criteria.access"
    @update:modelValue="updateCriteria('access', $event)"
  />

  <!-- ギフト条件 -->
  <TriggerGift
    v-if="activeConditions.has('gift')"
    :modelValue="criteria.gift"
    @update:modelValue="updateCriteria('gift', $event)"
  />

  <!-- 初見条件 -->
  <TriggerSyoken
    v-if="activeConditions.has('syoken')"
    :modelValue="criteria.syoken"
    @update:modelValue="updateCriteria('syoken', $event)"
  />

  <!-- カウント条件 -->
  <!-- TODO:修正が必要 -->
  <TriggerCount
    v-if="activeConditions.has('count')"
    :modelValue="criteria.count"
    @update:modelValue="updateCriteria('count', $event)"
  />

  <!-- チャットワード条件 -->
  <TriggerComment
    v-if="activeConditions.has('comment')"
    :modelValue="criteria.comment"
    @update:modelValue="updateCriteria('comment', $event)"
  />

  <NoParamsCard v-if="activeConditions.size === 0" message="発動条件が指定されていません" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import {
    OmikujiItemType,
    CriteriaThresholdCondition,
    CriteriaThresholdSchema,
    CriteriaThresholdType,
    criteriaThresholdCondition,
  } from '@/types'

  import TriggerComment from '@/editor/events/trigger/TriggerComment.vue'
  import TriggerAccess from '@/editor/events/trigger/TriggerAccess.vue'
  import TriggerGift from '@/editor/events/trigger/TriggerGift.vue'
  import TriggerSyoken from '@/editor/events/trigger/TriggerSyoken.vue'
  import TriggerCount from '@/editor/events/trigger/TriggerCount.vue'
  import TriggerUsername from '@/editor/events/trigger/TriggerUsername.vue'

  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import InformationCard from '@/editor/parts/InformationCard/InformationCard.vue'
  import NoParamsCard from '@/editor/parts/NoParamsCard/NoParamsCard.vue'

  const props = defineProps<{
    omikujiItem: OmikujiItemType
  }>()

  const emit = defineEmits<{
    update: [item: OmikujiItemType]
  }>()

  // 条件タイプの選択肢
  const conditionTypes = Object.entries(criteriaThresholdCondition).map(([value, label]) => ({
    value: value as CriteriaThresholdCondition,
    label,
  }))

  // criteria
  const criteria = computed(() => {
    return props.omikujiItem.lottery.criteria ?? CriteriaThresholdSchema.parse({})
  })

  // アクティブな条件
  const activeConditions = computed(() => {
    return new Set(criteria.value.conditions)
  })

  // criteriaを更新したOmikujiItemをemit
  const updateCriteriaItem = (newCriteria: CriteriaThresholdType) => {
    const lottery = props.omikujiItem.lottery

    if (lottery.isPriority) {
      emit('update', {
        ...props.omikujiItem,
        lottery: {
          isPriority: true,
          criteria: newCriteria,
        },
      })
    } else {
      emit('update', {
        ...props.omikujiItem,
        lottery: {
          isPriority: false,
          weight: lottery.weight,
          criteria: newCriteria,
        },
      })
    }
  }

  // 条件のトグル
  const toggleCondition = (condition: CriteriaThresholdCondition) => {
    const currentConditions = criteria.value.conditions

    const newConditions = currentConditions.includes(condition)
      ? currentConditions.filter((c) => c !== condition)
      : [...currentConditions, condition]

    updateCriteriaItem({
      ...criteria.value,
      conditions: newConditions,
    })
  }

  // criteriaのプロパティ更新
  const updateCriteria = <K extends keyof CriteriaThresholdType>(key: K, value: CriteriaThresholdType[K]) => {
    updateCriteriaItem({
      ...criteria.value,
      [key]: value,
    })
  }
</script>
