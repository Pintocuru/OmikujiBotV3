<!-- src/ui/ToastWidgets/ViewBotToast.vue -->
<template>
  <div :class="!toastSettings.showToastsOnRight ? 'self-start' : 'self-end'">
    <div v-for="message in displayedComments.slice().reverse()" :key="message.id">
      <!-- ! を使用… -->
      <MotionWrapper
        v-model:visible="message.display!.visible"
        :motion="!toastSettings.showToastsOnRight ? 'slideRight' : 'slideLeft'"
        :leave-motion="!toastSettings.showToastsOnRight ? 'slideLeft' : 'slideRight'"
        :auto-hide="false"
        @after-leave="() => removeComment(message.id)"
      >
        <ToastBubbleItem
          :key="message.id"
          :message="message.bubble?.message"
          :color="getCharacterColor(message.bubble.characterKey)"
          :iconLayers="
            toastSettings.showToastsCharacter && message.bubble
              ? iconSrc(message.bubble.characterKey, message.bubble.iconKey)
              : []
          "
          :showToastsOnRight="toastSettings.showToastsOnRight"
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
  import ToastBubbleItem from './parts/ToastBubbleItem.vue'
  import { useBotDisplay } from '@/ui/common/useBotDisplay'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'
  import { useCharacterManager } from '@/generator/scripts/CharacterManager/useCharacterManager'
  import { ToastWidgetsSchema } from '@/types/ui'
  import { useFilteredBotMessages } from '../common/useFilteredBotMessages'

  // ストアから必要な情報を取得
  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const toastSettings = computed(() => data.value.ui.settings.toastWidgets ?? ToastWidgetsSchema.parse({}))
  const { iconSrc, getCharacterColor } = useCharacterManager()

  // ライセンス状態で閲覧できないなら表示させない
  const { messages } = useFilteredBotMessages('toastWidgets', {
    userIconSize: 6,
  })

  // コメント表示ロジック
  const { displayedComments, removeComment, hideComment, start, stop } = useBotDisplay(messages)

  onMounted(start)
  onUnmounted(stop)
</script>
