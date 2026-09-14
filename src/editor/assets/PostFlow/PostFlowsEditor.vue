<!-- src/editor/assets/PostFlow/PostFlowsEditor.vue -->
<template>
  <div class="space-y-2">
    <!-- ツールバー -->
    <OmikujiItemToolbar :modelValue="modelValue" @update:modelValue="updatePostActions" />

    <!-- PostActionsタブエディター -->
    <PostActionsTabs :modelValue="modelValue" @update:actions="updatePostActions" />

    <!-- タブコンテンツ -->
    <!-- アクションが空の場合 -->
    <template v-if="props.modelValue.length === 0">
      <NoParamsCard message="PostActionがありません" />
      <button @click="addNewAction" class="btn btn-primary btn-sm">最初のアクションを追加</button>
    </template>

    <!-- PostActionタブの内容 -->
    <template v-else-if="props.modelValue.length > 0 && activeTab >= 0">
      <PostActionItem
        :action="currentAction"
        :index="activeTab"
        @update:action="updateCurrentAction"
        @duplicate="duplicateAction"
        @remove="removeAction"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostFlowType } from '@/types/OmikujiData/'
  import PostActionsTabs from './tooltab/PostActionsTabs.vue'
  import OmikujiItemToolbar from '@/editor/assets/PostFlow/tooltab/OmikujiItemToolbar.vue'
  import PostActionItem from './items/PostActionItem.vue'
  import NoParamsCard from '@/editor/parts/NoParamsCard/NoParamsCard.vue'
  import { usePostActionsTab } from './composables/usePostActionsTab'

  const props = defineProps<{
    modelValue: PostFlowType[]
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: PostFlowType[]]
  }>()

  // タブロジックをコンポーザブルから取得
  const { activeTab, currentAction, updateCurrentAction, addNewAction, duplicateAction, removeAction } =
    usePostActionsTab(
      computed(() => props?.modelValue),
      (_event, actions) => emit('update:modelValue', actions)
    )

  const updatePostActions = (newActions: PostFlowType[]) => {
    emit('update:modelValue', newActions)
  }
</script>
