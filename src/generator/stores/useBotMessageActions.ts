// src/generator/stores/useBotMessageActions.ts
import { ref } from 'vue'
import { type BotMessageType } from '@/types/generator'

export const useBotMessageActions = () => {
  /**
   * 状態
   */
  const botMessages = ref<BotMessageType[]>([])

  /**
   * delaySeconds に合わせてメッセージを botMessages に入れる関数
   */
  const scheduleBotMessages = (processedMessages: BotMessageType[]) => {
    if (!processedMessages.length) return

    for (const m of processedMessages) {
      setTimeout(() => {
        if (!botMessages.value.some((c) => c.id === m.id)) {
          botMessages.value = [...botMessages.value, m]
        }
      }, m.delaySeconds * 1000)
    }
  }

  /**
   * BotMessage に関する関数
   */
  const addBotMessage = (message: BotMessageType) => (botMessages.value = [...botMessages.value, message])
  const clearMessages = () => (botMessages.value = [])

  return {
    // 状態
    botMessages,

    // アクション
    scheduleBotMessages,
    addBotMessage,
    clearMessages,
  }
}
