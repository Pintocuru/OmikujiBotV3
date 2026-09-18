<!-- src/editor/assets/box/OmikujiItemEditor.vue -->
<template>
  <!-- ヘッダー -->
  <OmikujiItemHeader :omikujiItem="omikujiItem" @update="updateItem" />

  <!-- 実行内容 -->
  <SettingItem v-if="shouldShowKindSelector" label="実行内容" description="このおみくじの処理内容を選択します">
    <div class="flex flex-wrap gap-2">
      <span
        v-for="(option, key) in omikujiItemKindMap"
        :key="key"
        class="badge cursor-pointer select-none"
        :class="omikujiItem.kind === key ? 'badge-primary' : 'badge-ghost'"
        @click="updateKind(key as OmikujiItemKind)"
      >
        {{ option.label }}
      </span>
    </div>
  </SettingItem>

  <!-- サブタイトル -->
  <SubSectionHeader
    :icon="omikujiItemKindMap[omikujiItem.kind].icon"
    :title="omikujiItemKindMap[omikujiItem.kind].label"
    :description="omikujiItemKindMap[omikujiItem.kind].description"
  />

  <!-- postFlow 編集 -->
  <PostFlowEditor
    v-if="omikujiItem.kind === 'postFlow'"
    :modelValue="omikujiItem.postFlows"
    @update="updatePostFlows"
  />

  <!-- return -->
  <ReturnEditor v-else-if="omikujiItem.kind === 'return'" :omikujiItem="omikujiItem" @update="updateItem" />

  <!-- continue -->
  <ContinueEditor v-else-if="omikujiItem.kind === 'continue'" :omikujiItem="omikujiItem" @update="updateItem" />

  <!-- reset -->
  <ResetEditor v-else-if="omikujiItem.kind === 'reset'" :omikujiItem="omikujiItem" @update="updateItem" />

  <!-- log -->
  <LogEditor v-else-if="omikujiItem.kind === 'log'" :omikujiItem="omikujiItem" @update="updateItem" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiItemKind, OmikujiItemType, PostFlowType } from '@/types/OmikujiData/'

  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import OmikujiItemHeader from './OmikujiItemHeader.vue'

  import PostFlowEditor from '@/editor/assets/PostFlow/PostFlowsEditor.vue'
  import ReturnEditor from './ReturnEditor.vue'
  import ContinueEditor from './ContinueEditor.vue'
  import ResetEditor from './ResetEditor.vue'
  import LogEditor from './LogEditor.vue'
  import { omikujiItemKindMap } from '@/maps/OmikujiData/index.js'

  const props = defineProps<{
    omikujiItem: OmikujiItemType
  }>()

  const emit = defineEmits<{
    update: [item: OmikujiItemType]
  }>()

  // アイテム全体の更新
  const updateItem = (item: OmikujiItemType) => {
    emit('update', item)
  }

  // kind変更
  const updateKind = (kind: OmikujiItemKind) => {
    if (props.omikujiItem.kind === kind) return

    emit('update', {
      ...props.omikujiItem,
      kind,
    } as OmikujiItemType)
  }

  // postFlows更新
  const updatePostFlows = (postFlows: PostFlowType[]) => {
    if (props.omikujiItem.kind !== 'postFlow') return

    emit('update', {
      ...props.omikujiItem,
      postFlows,
    })
  }

  const shouldShowKindSelector = computed(() => {
    return Object.keys(omikujiItemKindMap).length > 1
  })
</script>
