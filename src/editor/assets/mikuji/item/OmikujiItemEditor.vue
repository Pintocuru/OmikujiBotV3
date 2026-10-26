<!-- src/editor/assets/mikuji/item/OmikujiItemEditor.vue -->
<template>
  <!-- ヘッダー -->
  <OmikujiItemHeader :omikujiItem="omikujiItem" @update="updateItem" />

  <!-- 実行内容 -->
  <SettingItem icon="Zap" v-if="shouldShowKindSelector" label="実行内容" description="このおみくじの処理内容を選択します">
    <div class="flex flex-wrap gap-2">
      <span
        v-for="(_, key) in omikujiItemKindMap"
        :key="key"
        class="badge cursor-pointer select-none"
        :class="omikujiItem.kind === key ? 'badge-primary' : 'badge-ghost'"
        @click="updateKind(key as OmikujiItemKind)"
      >
        {{ t(`mapText.omikujiItemKind.${key}.label`) }}
      </span>
    </div>
  </SettingItem>

  <!-- 制御の種類 (control のみ) -->
  <SettingItem
    icon="SlidersHorizontal"
    v-if="isControlItem(omikujiItem)"
    label="制御の種類"
    description="処理の流れをどう制御するかを選択します"
  >
    <div class="flex flex-wrap gap-2">
      <span
        v-for="(_, command) in omikujiControlCommandMap"
        :key="command"
        class="badge cursor-pointer select-none"
        :class="omikujiItem.command === command ? 'badge-primary' : 'badge-ghost'"
        @click="updateCommand(command as OmikujiControlCommand)"
      >
        {{ t(`mapText.omikujiControlCommand.${command}.label`) }}
      </span>
      <span class="text-xs opacity-70">{{ headerMeta.description }}</span>
    </div>
  </SettingItem>

  <!-- postFlow 編集 -->
  <PostFlowEditor
    v-if="omikujiItem.kind === 'postFlow'"
    :modelValue="omikujiItem.postFlows"
    @update:modelValue="updatePostFlows"
  />

  <!-- control 固有の設定 (おみくじカウント・評価ブロック) -->
  <OmikujiItemControlSettings v-else-if="isControlItem(omikujiItem)" :item="omikujiItem" @update="updateItem" />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import {
    OmikujiControlCommand,
    OmikujiItemKind,
    OmikujiItemSchema,
    OmikujiItemType,
    PostFlowType,
  } from '@/types/OmikujiData/'

  import SettingItem from '@/editor/parts/SettingItem.vue'
  import OmikujiItemHeader from './OmikujiItemHeader.vue'
  import OmikujiItemControlSettings from './OmikujiItemControlSettings.vue'

  import PostFlowEditor from '@/editor/assets/PostFlow/PostFlowsEditor.vue'
  import { omikujiItemKindMap, omikujiControlCommandMap } from '@/maps/OmikujiData'

  const { t } = useI18n()

  const props = defineProps<{
    omikujiItem: OmikujiItemType
  }>()

  const emit = defineEmits<{
    update: [item: OmikujiItemType]
  }>()

  type ControlItem = Extract<OmikujiItemType, { kind: 'control' }>
  const isControlItem = (item: OmikujiItemType): item is ControlItem => item.kind === 'control'

  // サブタイトルの表示内容 (control は command ごと)
  const headerMeta = computed(() => ({
    description: isControlItem(props.omikujiItem)
      ? t(`mapText.omikujiControlCommand.${props.omikujiItem.command}.description`)
      : t(`mapText.omikujiItemKind.${props.omikujiItem.kind}.description`),
  }))

  // アイテムのプロパティ更新
  const updateItemProperties = (properties: Record<string, unknown>) => {
    emit('update', {
      ...props.omikujiItem,
      ...properties,
    } as OmikujiItemType)
  }

  // アイテム全体の更新
  const updateItem = (item: OmikujiItemType) => {
    emit('update', item)
  }

  // kind変更
  // 新しい kind 固有のプロパティは既定値で補い、元のプロパティは保持する
  const updateKind = (kind: OmikujiItemKind) => {
    if (props.omikujiItem.kind === kind) return

    emit('update', {
      ...OmikujiItemSchema.parse({ ...props.omikujiItem, kind }),
      ...props.omikujiItem,
      kind,
    } as OmikujiItemType)
  }

  // control の command 変更
  const updateCommand = (command: OmikujiControlCommand) => {
    if (!isControlItem(props.omikujiItem)) return
    updateItemProperties({ command })
  }

  // postFlows更新
  const updatePostFlows = (postFlows: PostFlowType[]) => {
    if (props.omikujiItem.kind !== 'postFlow') return
    updateItemProperties({ postFlows })
  }

  const shouldShowKindSelector = computed(() => {
    return Object.keys(omikujiItemKindMap).length > 1
  })
</script>
