<!-- src/editor/assets/mikuji/item/OmikujiItemCriteria.vue -->
<template>
  <!-- 追加発動条件の説明 -->
  <InformationCard>
    <p>
      <code class="label bg-accent text-accent-content">{{ t('omikujiItem.criteria.help.conditionName') }}</code
      >{{ t('omikujiItem.criteria.help.conditionDescription') }}
    </p>
    <p>{{ t('omikujiItem.criteria.help.allRequired') }}</p>
    <p>{{ t('omikujiItem.criteria.help.adminCommands') }}</p>
  </InformationCard>

  <!-- 条件タイプ選択 -->
  <SettingItem
    icon="Filter"
    labelKey="omikujiItem.criteria.label"
    descriptionKey="omikujiItem.criteria.description"
    :variant="activeConditions.size === 0 ? 'warning' : undefined"
  >
    <IconCheckGroup
      v-model="conditions"
      i18n-prefix="commentTrigger.conditions"
      :icons="triggerConditionIcons"
      :keys="criteriaThresholdConditions"
    />
  </SettingItem>

  <!-- ユーザーネーム条件 -->
  <TriggerUsername
    v-if="activeConditions.has('username')"
    :modelValue="criteria.usernames"
    @update:modelValue="updateCriteriaKey('usernames', $event)"
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
    :kinds="criteria.giftKinds"
    @update:modelValue="updateCriteriaKey('gift', $event)"
    @update:kinds="updateCriteriaKey('giftKinds', $event)"
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

  <NoParamsCard v-if="activeConditions.size === 0" :message="t('omikujiItem.criteria.help.empty')" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import {
    criteriaThresholdConditions,
    isCriteriaThresholdCondition,
    CriteriaThresholdCondition,
    OmikujiItemType,
  } from '@/types/OmikujiData'
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
  import IconCheckGroup from '@/editor/parts/IconCheckGroup.vue'
  import { triggerConditionIcons } from '@/maps/engine/trigger/TriggerConditionIcons'

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

  // IconCheckGroup 用の v-model(配列)
  // この版で扱えない条件(新しい版のデータなど)は表示せず、そのまま残す
  const conditions = computed<CriteriaThresholdCondition[]>({
    get: () => criteria.value.conditions.filter(isCriteriaThresholdCondition),
    set: (next) => {
      const prev = criteria.value.conditions.filter(isCriteriaThresholdCondition)
      // IconCheckGroup は1回の操作で1件だけ増減するので、差分は1件になる
      const changed = [...prev.filter((k) => !next.includes(k)), ...next.filter((k) => !prev.includes(k))]
      changed.forEach(toggleCondition)
    },
  })
</script>
