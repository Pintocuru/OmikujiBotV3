<!-- src/editor/assets/mikuji/item/OmikujiItemCriteria.vue -->
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
    icon="Filter"
    label="適用する発動条件"
    description="トリガーの種類を選択"
    :variant="activeConditions.size === 0 ? 'warning' : undefined"
  >
    <div class="flex flex-wrap gap-2">
      <label v-for="condition in criteriaThresholdCondition" :key="condition" class="cursor-pointer">
        <input
          type="checkbox"
          class="hidden"
          :checked="activeConditions.has(condition)"
          @change="toggleCondition(condition)"
        />
        <span
          class="badge badge-lg select-none"
          :class="activeConditions.has(condition) ? 'badge-primary' : 'badge-ghost'"
        >
          <!-- commentTriggerから流用 -->
          {{ t(`commentTrigger.conditions.${condition}.label`) }}
        </span>
      </label>
    </div>
  </SettingItem>

  <!-- ユーザーネーム条件 -->
  <TriggerUsername
    v-if="activeConditions.has('username')"
    :modelValue="criteria.userName"
    @update:modelValue="updateCriteriaKey('userName', $event)"
  />

  <!-- アクセスレベル条件 -->
  <TriggerAccess
    v-if="activeConditions.has('access')"
    :modelValue="criteria.access"
    @update:modelValue="updateCriteriaKey('access', $event)"
  />

  <!-- ギフト条件 -->
  <TriggerGift
    v-if="activeConditions.has('gift')"
    :modelValue="criteria.gift"
    @update:modelValue="updateCriteriaKey('gift', $event)"
  />

  <!-- 初見条件 -->
  <TriggerSyoken
    v-if="activeConditions.has('syoken')"
    :modelValue="criteria.syoken"
    @update:modelValue="updateCriteriaKey('syoken', $event)"
  />

  <!-- カウント条件 -->
  <TriggerCount
    v-if="activeConditions.has('count')"
    :modelValue="criteria.count"
    @update:modelValue="updateCriteriaKey('count', $event)"
  />

  <!-- チャットワード条件 -->
  <TriggerComment
    v-if="activeConditions.has('comment')"
    :modelValue="criteria.comment"
    @update:modelValue="updateCriteriaKey('comment', $event)"
  />

  <!-- 判定式条件 -->
  <TriggerExpression
    v-if="activeConditions.has('expression')"
    :modelValue="criteria.expression"
    @update:modelValue="updateCriteriaKey('expression', $event)"
  />

  <NoParamsCard v-if="activeConditions.size === 0" message="発動条件が指定されていません" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { criteriaThresholdCondition, OmikujiItemType } from '@/types/OmikujiData'
  import { useOmikujiLottery } from '../composables/useOmikujiLottery'

  import TriggerComment from '@/editor/events/trigger/TriggerComment.vue'
  import TriggerAccess from '@/editor/events/trigger/TriggerAccess.vue'
  import TriggerGift from '@/editor/events/trigger/TriggerGift.vue'
  import TriggerSyoken from '@/editor/events/trigger/TriggerSyoken.vue'
  import TriggerCount from '@/editor/events/trigger/TriggerCount.vue'
  import TriggerUsername from '@/editor/events/trigger/TriggerUsername.vue'
  import TriggerExpression from '@/editor/events/trigger/TriggerExpression.vue'

  import SettingItem from '@/editor/parts/SettingItem.vue'
  import InformationCard from '@/editor/parts/InformationCard.vue'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'

  const props = defineProps<{
    omikujiItem: OmikujiItemType
  }>()

  const emit = defineEmits<{
    update: [item: OmikujiItemType]
  }>()

  // i18n の初期化
  const { t } = useI18n()

  // criteria の更新ロジックは useOmikujiLottery と共通
  const { criteria, updateCriteriaKey, toggleCondition } = useOmikujiLottery(
    () => props.omikujiItem,
    (item) => emit('update', item)
  )

  // アクティブな条件
  const activeConditions = computed(() => new Set(criteria.value.conditions))
</script>
