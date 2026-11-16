<!-- src/ui/bot/ToastWidgets/ToastWidgets.vue -->
<template>
  <div :class="!toastSettings.showToastsOnRight ? 'self-start' : 'self-end'">
    <div v-for="message in displayedComments.slice().reverse()" :key="message.id">
      <MotionWrapper
        v-model:visible="message.display.visible"
        :motion="!toastSettings.showToastsOnRight ? 'slideRight' : 'slideLeft'"
        :leave-motion="!toastSettings.showToastsOnRight ? 'slideLeft' : 'slideRight'"
        :auto-hide="false"
        @after-leave="() => removeComment(message.id)"
      >
        <ToastBubbleSelector
          :key="message.id"
          :settings="toastSettings"
          :message="message.bubble?.message"
          :color="getCharacterColor(characterKeyOf(message))"
          :iconLayers="toastSettings.showToastsCharacter ? iconLayersOf(message) : []"
          :getProfileImage="(userId) => appStore.userStats.get(userId)?.profileImage"
          @click="hideComment(message.id)"
        />
      </MotionWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import ToastBubbleSelector from './ToastBubbleSelector.vue'
  import { useBotDisplay } from '@/ui/common/useBotDisplay'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'
  import { useAppCharacters } from '@/ui/common/useAppCharacters'
  import { ToastWidgetsSchema } from '@/types/ui'
  import type { BotMessageBubbleType } from '@/types/generator'
  import { resolveToastCharacterKey, toastIconLayers } from './toastCharacter'
  import { useFilteredBotMessages } from '@/ui/common/useFilteredBotMessages'

  // ストアから必要な情報を取得
  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const toastSettings = computed(() => ToastWidgetsSchema.parse(data.value.ui.settings.toastWidgets ?? {}))
  const { characterArray, getCharacter, getCharacterColor } = useAppCharacters()

  // メッセージごとに表示キャラを一度だけ決める(ランダムが再描画で変わらないよう、id でキャッシュ)
  const resolvedKeys = new Map<string, string>()
  const characterKeyOf = (message: BotMessageBubbleType): string => {
    const cached = resolvedKeys.get(message.id)
    if (cached !== undefined) return cached
    const key = resolveToastCharacterKey(
      message.bubble.characterKey,
      toastSettings.value.fallbackCharacter,
      characterArray.value
    )
    resolvedKeys.set(message.id, key)
    return key
  }
  const iconLayersOf = (message: BotMessageBubbleType): string[] =>
    toastIconLayers(getCharacter(characterKeyOf(message)), message.bubble.iconKey)

  const { messages } = useFilteredBotMessages('toastWidgets', {
    userIconSize: 6,
  })

  // コメント表示ロジック
  const { displayedComments, removeComment, hideComment, start, stop } = useBotDisplay(messages)

  // 表示を終えたメッセージのキャッシュを捨てる
  watch(
    () => displayedComments.value.length,
    () => {
      const ids = new Set(displayedComments.value.map((m) => m.id))
      for (const id of resolvedKeys.keys()) if (!ids.has(id)) resolvedKeys.delete(id)
    }
  )

  onMounted(start)
  onUnmounted(stop)
</script>
