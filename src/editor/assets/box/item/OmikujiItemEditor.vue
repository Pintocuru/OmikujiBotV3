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

  <!-- return / continue / reset 共通: おみくじカウント -->
  <SettingItem v-else-if="isCountableItem(omikujiItem)" label="おみくじカウント" :description="countEventDescription">
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :checked="omikujiItem.isCountEvent"
      @change="updateIsCountEvent(($event.target as HTMLInputElement).checked)"
    />
  </SettingItem>

  <!-- log 固有の設定 -->
  <template v-else-if="omikujiItem.kind === 'log'">
    <SettingItem
      label="ログのフォーマット"
      description="1行分の書式です。使用可能: <<index>> <<user>> <<userId>> <<score>> <<item>> <<flag>> <<createdAt>>"
    >
      <input
        type="text"
        class="input input-bordered input-sm w-full"
        :value="omikujiItem.logFormat"
        @input="updateLogFormat(($event.target as HTMLInputElement).value)"
      />
    </SettingItem>

    <SettingItem label="最大出力件数" description="ログとして出力する最大件数です(1〜100)">
      <input
        type="number"
        class="input input-bordered input-sm w-24"
        min="1"
        max="100"
        :value="omikujiItem.logLimit"
        @change="updateLogLimit(($event.target as HTMLInputElement).valueAsNumber)"
      />
    </SettingItem>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiItemKind, OmikujiItemType, PostFlowType } from '@/types/OmikujiData/'

  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import OmikujiItemHeader from './OmikujiItemHeader.vue'

  import PostFlowEditor from '@/editor/assets/PostFlow/PostFlowsEditor.vue'
  import { omikujiItemKindMap } from '@/maps/OmikujiData/index.js'

  const props = defineProps<{
    omikujiItem: OmikujiItemType
  }>()

  const emit = defineEmits<{
    update: [item: OmikujiItemType]
  }>()

  // isCountEvent を持つ種別(return / continue / reset)
  type CountableItem = Extract<OmikujiItemType, { kind: 'return' | 'continue' | 'reset' }>
  type LogItem = Extract<OmikujiItemType, { kind: 'log' }>

  const isCountableItem = (item: OmikujiItemType): item is CountableItem =>
    item.kind === 'return' || item.kind === 'continue' || item.kind === 'reset'

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

  // isCountEvent更新(return / continue / reset 共通)
  const updateIsCountEvent = (isCountEvent: boolean) => {
    if (!isCountableItem(props.omikujiItem)) return

    emit('update', {
      ...props.omikujiItem,
      isCountEvent,
    })
  }

  // logFormat更新
  const updateLogFormat = (logFormat: string) => {
    if (props.omikujiItem.kind !== 'log') return

    emit('update', {
      ...(props.omikujiItem as LogItem),
      logFormat,
    })
  }

  // logLimit更新(1〜100 にクランプ)
  const updateLogLimit = (value: number) => {
    if (props.omikujiItem.kind !== 'log') return
    if (Number.isNaN(value)) return

    emit('update', {
      ...(props.omikujiItem as LogItem),
      logLimit: Math.min(100, Math.max(1, Math.round(value))),
    })
  }

  // kindごとの isCountEvent の説明文
  const countEventDescriptions: Record<CountableItem['kind'], string> = {
    return: '処理を終了するときに、このアクションをおみくじカウントとして記録します',
    continue: '次のイベントへ進むときに、このアクションをおみくじカウントとして記録します',
    reset: 'リセットを実行したことを、おみくじカウントとして記録します',
  }

  const countEventDescription = computed(() =>
    isCountableItem(props.omikujiItem) ? countEventDescriptions[props.omikujiItem.kind] : ''
  )

  const shouldShowKindSelector = computed(() => {
    return Object.keys(omikujiItemKindMap).length > 1
  })
</script>
