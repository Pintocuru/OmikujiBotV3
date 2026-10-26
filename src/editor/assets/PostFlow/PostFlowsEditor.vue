<!-- src/editor/assets/PostFlow/PostFlowsEditor.vue -->
<template>
  <div class="space-y-2">
    <!-- ツールバー -->
    <OmikujiItemToolbar
      :modelValue="modelValue"
      @update:modelValue="updatePostActions"
      @reorder="followReorder"
    />

    <!-- PostActionsタブエディター -->
    <PostActionsTabs
      :modelValue="modelValue"
      :activeTab="activeTab"
      @select-tab="setActiveTab"
      @add="addNewAction"
      @duplicate="duplicateAction"
      @remove="removeAction"
    />

    <!-- タブコンテンツ -->
    <!-- アクションが空の場合 -->
    <template v-if="props.modelValue.length === 0">
      <NoParamsCard :message="t('postFlow.flowsEditor.empty')" />
      <button @click="addNewAction" class="btn btn-primary btn-sm">{{ t('postFlow.flowsEditor.addFirst') }}</button>
    </template>

    <!-- PostActionタブの内容 -->
    <template v-else-if="props.modelValue.length > 0 && activeTab >= 0">
      <PostActionItem :action="currentAction" :current-key="currentKey" @update:action="updateCurrentAction" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { PostFlowType } from '@/types/OmikujiData/'
  import PostActionsTabs from './tooltab/PostActionsTabs.vue'
  import OmikujiItemToolbar from '@/editor/assets/PostFlow/tooltab/OmikujiItemToolbar.vue'
  import PostActionItem from './items/PostActionItem.vue'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import { usePostActionsTab } from './composables/usePostActionsTab'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: PostFlowType[]
    /** 編集中のアクションセットのキー(flowCall の循環参照チェック用) */
    currentKey?: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: PostFlowType[]]
  }>()

  // タブロジックをコンポーザブルから取得
  const {
    activeTab,
    currentAction,
    setActiveTab,
    updateCurrentAction,
    addNewAction,
    duplicateAction,
    removeAction,
    followReorder,
  } = usePostActionsTab(
    computed(() => props?.modelValue),
    (_event, actions) => emit('update:modelValue', actions)
  )

  const updatePostActions = (newActions: PostFlowType[]) => {
    emit('update:modelValue', newActions)
  }
</script>
