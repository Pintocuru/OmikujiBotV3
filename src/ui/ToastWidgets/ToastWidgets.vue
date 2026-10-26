<!-- src/ui/ToastWidgets/ToastWidgets.vue -->
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
          :color="getCharacterColor(message.bubble.characterKey)"
          :iconLayers="
            toastSettings.showToastsCharacter && message.bubble
              ? iconSrc(message.bubble.characterKey, message.bubble.iconKey)
              : []
          "
          :getProfileImage="(userId) => appStore.userStats.get(userId)?.profileImage"
          @click="hideComment(message.id)"
        />
      </MotionWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import ToastBubbleSelector from './ToastBubbleSelector.vue'
  import { useBotDisplay } from '@/ui/common/useBotDisplay'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'
  import { useCharacters } from '@/generator/composables/useCharacters'
  import { ToastWidgetsSchema } from '@/types/ui'
  import { useFilteredBotMessages } from '../common/useFilteredBotMessages'

  // ストアから必要な情報を取得
  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const toastSettings = computed(() => ToastWidgetsSchema.parse(data.value.ui.settings.toastWidgets ?? {}))
  const { iconSrc, getCharacterColor } = useCharacters()

  const { messages } = useFilteredBotMessages('toastWidgets', {
    userIconSize: 6,
  })

  // コメント表示ロジック
  const { displayedComments, removeComment, hideComment, start, stop } = useBotDisplay(messages)

  onMounted(start)
  onUnmounted(stop)
</script>
