<!-- src/editor/assets/PostFlow/tooltab/PostActionsTabs.vue -->
<template>
  <!-- タブヘッダー -->
  <div class="tabs tabs-box">
    <!-- PostActionタブ -->
    <button
      v-for="(action, index) in props.modelValue"
      :key="`action-${index}`"
      class="tab"
      :class="activeTab === index ? 'tab-active bg-info text-info-content' : ''"
      @click="setActiveTab(index)"
    >
      <!-- 左側：バッジと内容 -->
      <div class="flex items-center">
        <span class="badge badge-sm badge-primary mr-2">{{ index + 1 }}</span>
        <PostActionRow :action="action" />
      </div>

      <!-- 右側：メニュー -->
      <div @click.stop>
        <MenuDropdown @duplicate="duplicateAction(index)" @delete="removeAction(index)" />
      </div>
    </button>

    <!-- 追加ボタン -->
    <button class="tab tab-sm" @click="addNewAction">＋ 追加</button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostFlowType } from '@/types/OmikujiData/'
  import PostActionRow from './PostActionRow.vue'
  import { usePostActionsTab } from '../composables/usePostActionsTab'
  import MenuDropdown from '@/editor/parts/MenuDropdown/MenuDropdown.vue'

  const props = defineProps<{
    modelValue: PostFlowType[]
  }>()

  const emit = defineEmits<{
    'update:actions': [actions: PostFlowType[]]
    'open-placeholder': [placeholderId: string, editorColor?: string | null]
  }>()

  // タブロジックをコンポーザブルから取得
  const { activeTab, setActiveTab, addNewAction, duplicateAction, removeAction } = usePostActionsTab(
    computed(() => props.modelValue),
    (event, actions) => emit(event, actions)
  )
</script>
