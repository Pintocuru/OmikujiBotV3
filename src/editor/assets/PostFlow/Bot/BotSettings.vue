<!-- src/editor/assets/PostFlow/Bot/BotSettings.vue -->
<template>
  <!-- BOTの名前 -->
  <SettingItem layout="vertical" icon="Bot" :label="t('postFlow.bot.nameLabel')" :description="t('postFlow.bot.nameDesc')">
    <input v-model="botName" type="text" class="input input-bordered input-sm w-full" />
  </SettingItem>

  <!-- コメント -->
  <SettingItem layout="vertical" icon="MessageSquare" :label="t('postFlow.bot.messageLabel')" :description="t('postFlow.bot.messageDesc')">
    <MessageTextDialog v-model="bubbleText" :isCommentMode="true" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { PostFlowBotType } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import MessageTextDialog from '../Message/MessageTextDialog.vue'

  const { t } = useI18n()

  const props = defineProps<{
    action: PostFlowBotType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostFlowBotType]
  }>()

  const updateAction = (updates: Partial<PostFlowBotType>) => {
    emit('update:action', {
      ...props.action,
      ...updates,
    })
  }

  /** BOT名 */
  const botName = computed({
    get: () => props.action.botName,
    set: (val: string) => updateAction({ botName: val }),
  })

  /** コメント */
  const bubbleText = computed<string>({
    get: () => props.action.message ?? '',
    set: (value) => updateAction({ message: value }),
  })
</script>
