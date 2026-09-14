<!-- src/editor/events/comment/CommentTriggerEditor.vue -->
<template>
  <!-- 条件設定の説明 -->
  <InformationCard>
    <p>
      <code class="label bg-accent text-accent-content">
        {{ t('commentTrigger.information.badge') }}
      </code>
      {{ t('commentTrigger.information.descriptionBody') }}
    </p>
    <p>{{ t('commentTrigger.information.note') }}</p>
  </InformationCard>

  <!-- 条件タイプ選択 -->
  <SettingItem :label="t('commentTrigger.setting.label')" :description="t('commentTrigger.setting.description')">
    <div class="flex flex-wrap gap-2">
      <label v-for="condition in commentTriggerCondition" :key="condition" class="cursor-pointer">
        <input
          type="checkbox"
          class="hidden"
          :checked="conditions.includes(condition)"
          @change="toggleCondition(condition)"
        />
        <span
          class="badge badge-lg select-none"
          :class="conditions.includes(condition) ? 'badge-primary' : 'badge-ghost'"
        >
          <!-- i18nのキーからラベルを取得 -->
          {{ t(`commentTrigger.conditions.${condition}.label`) }}
        </span>
      </label>
    </div>
  </SettingItem>

  <!-- 各条件の詳細設定 -->
  <!-- チャットワード条件 -->
  <TriggerComment v-if="conditions.includes('comment')" v-model="comment" />

  <!-- アクセスレベル条件 -->
  <TriggerAccess v-if="conditions.includes('access')" v-model="access" />

  <!-- ギフト条件 -->
  <TriggerGift v-if="conditions.includes('gift')" v-model="gift" />

  <!-- ユーザーネーム条件 -->
  <TriggerUsername v-if="conditions.includes('username')" v-model="userName" />

  <!-- 条件未記入ですべてのコメントで適用 -->
  <NoParamsCard v-if="conditions.length === 0" :message="t('commentTrigger.noParams.message')" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { CommentTriggerCondition, commentTriggerCondition, CommentTriggerType } from '@/types/OmikujiData'

  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import TriggerComment from '@/editor/events/trigger/TriggerComment.vue'
  import TriggerAccess from '@/editor/events/trigger/TriggerAccess.vue'
  import TriggerGift from '@/editor/events/trigger/TriggerGift.vue'
  import TriggerUsername from '@/editor/events/trigger/TriggerUsername.vue'

  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import InformationCard from '@/editor/parts/InformationCard/InformationCard.vue'
  import NoParamsCard from '@/editor/parts/NoParamsCard/NoParamsCard.vue'

  const props = defineProps<{
    modelValue: CommentTriggerType
    selectedItemKey: string | null
  }>()

  // Pinia store
  const { updateEventProperty } = useOmikujiStore()

  // i18n の初期化
  const { t } = useI18n()

  // 各プロパティのcomputed getter/setter
  const createComputed = <T extends keyof CommentTriggerType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => {
        if (!props.selectedItemKey) return
        const updated = { ...props.modelValue, [key]: value }
        updateEventProperty('comments', props.selectedItemKey, 'trigger', updated)
      },
    })

  // 各プロパティのcomputed
  const conditions = createComputed('conditions')
  const comment = createComputed('comment')
  const access = createComputed('access')
  const gift = createComputed('gift')
  const userName = createComputed('userName')

  // Utils
  const toggleInArray = <T,>(array: T[], value: T): T[] => {
    const index = array.indexOf(value)
    return index > -1 ? array.filter((_, i) => i !== index) : [...array, value]
  }

  // Handlers
  const toggleCondition = (condition: CommentTriggerCondition) => {
    conditions.value = toggleInArray(conditions.value, condition)
  }
</script>
