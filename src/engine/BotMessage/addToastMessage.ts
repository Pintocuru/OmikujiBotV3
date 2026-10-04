// src/engine/BotMessage/addToastMessage.ts
import { useAppStore } from '@/generator/stores/useAppStore'
import { BotMessageBubbleSchema } from '@/generator/types'

export const useAddToastMessage = () => {
  const appStore = useAppStore()

  const addToastMessage = (name: string | null, message: string) => {
    const msg = BotMessageBubbleSchema.parse({
      bubble: { name, message },
    })
    appStore.addBotMessage(msg)
  }

  return {
    addToastMessage,
  }
}
