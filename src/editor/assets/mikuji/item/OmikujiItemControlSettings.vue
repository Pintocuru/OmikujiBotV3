<!-- src/editor/assets/mikuji/item/OmikujiItemControlSettings.vue -->
<template>
  <!-- おみくじカウント -->
  <SettingItem label="おみくじカウント" :description="countEventDescription">
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :checked="item.isCountEvent"
      @change="updateIsCountEvent(($event.target as HTMLInputElement).checked)"
    />
  </SettingItem>

  <!-- 評価ブロック {{ }} -->
  <SettingItem label="評価ブロック" description="この制御を実行するときに評価されます">
    <MessageTextDialog :modelValue="item.variable" :isCommentMode="true" @update:modelValue="updateVariable" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiItemControlType } from '@/types/OmikujiData/'

  import SettingItem from '@/editor/parts/SettingItem.vue'
  import MessageTextDialog from '@/editor/assets/PostFlow/Message/MessageTextDialog.vue'

  const props = defineProps<{
    item: OmikujiItemControlType
  }>()

  const emit = defineEmits<{
    update: [item: OmikujiItemControlType]
  }>()

  const updateIsCountEvent = (isCountEvent: boolean) => emit('update', { ...props.item, isCountEvent })
  const updateVariable = (variable: string) => emit('update', { ...props.item, variable })

  // commandごとの isCountEvent の説明文
  // TODO:omikujiControlCommandMap と被っている
  const countEventDescriptions: Record<OmikujiItemControlType['command'], string> = {
    return: '処理を終了するときに、このアクションをおみくじカウントとして記録します',
    continue: '次のイベントへ進むときに、このアクションをおみくじカウントとして記録します',
    reset: 'リセットを実行したことを、おみくじカウントとして記録します',
  }

  const countEventDescription = computed(() => countEventDescriptions[props.item.command])
</script>
