<!-- src/ui/CommentBubble/generator/CommentBubble.vue -->
<template>
  <div class="relative pointer-events-none z-10 h-screen">
    <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end">
      <div class="relative flex flex-col items-center">
        <!-- コメント吹き出し（キャラクターの上） -->
        <div class="absolute bottom-full -translate-y-36 left-1/2 -translate-x-1/2 min-w-[320px]">
          <CommentDisplay
            :displayed-comments="displayedComments"
            :remove-comment="removeComment"
            :enter-motion="setting.bubbleMotion"
            :leave-motion="setting.bubbleMotion"
          />
        </div>

        <!-- キャラクター（キーが変わったら再マウントしてアニメを頭出し） -->
        <LayerImage
          v-if="shown && shown.layers.length > 0"
          :key="shown.key"
          :layers="shown.layers"
          :size="setting.characterSize"
          :animation="shown.animation"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { useCharacterManager } from '@/generator/scripts/CharacterManager/useCharacterManager'
  import { CommentBubbleSchema } from '@/ui/types'
  import { useFilteredBotMessages } from '@/ui/common/useFilteredBotMessages'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import CommentDisplay from './CommentDisplay.vue'
  import { useBotDisplay } from './composables/useBotDisplay'

  const appStore = useAppStore()

  const { characterMap, hasImage, iconSrc, getCharacterLayers, getCharacterAnimation } = useCharacterManager(
    () => appStore.data.assets.characters
  )

  // 設定（未設定ならスキーマの既定値）
  const setting = computed(() => appStore.data.ui.settings.commentBubble ?? CommentBubbleSchema.parse({}))

  // 全コメントを対象にする（characterKey での絞り込みなし）
  const { messages } = useFilteredBotMessages('commentBubble')
  const { displayedComments, removeComment, start, stop } = useBotDisplay(messages)

  // 表示中コメントのうち、画像を持つキャラの最新のもの（displayedComments は新しい順）
  const latestComment = computed(
    () => displayedComments.value.find((m) => m.display?.visible && hasImage(m.bubble.characterKey)) ?? null
  )

  // 表示するキャラクター: コメント中はそのキャラ(iconKeyの表情)、なければ常時表示キャラ(default固定)
  const shown = computed(() => {
    const msg = latestComment.value
    if (msg) {
      return {
        key: msg.bubble.characterKey as string,
        layers: getCharacterLayers(msg),
        animation: getCharacterAnimation(msg),
      }
    }

    const key = setting.value.persistentCharacter
    if (!key || !hasImage(key)) return null
    return {
      key,
      layers: iconSrc(key, 'default'),
      animation: characterMap.value[key]?.image.default?.animation,
    }
  })

  onMounted(start)
  onUnmounted(stop)
</script>
