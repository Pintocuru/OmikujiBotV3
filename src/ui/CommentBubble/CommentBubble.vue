<!-- src/ui/CommentBubble/CommentBubble.vue -->
<template>
  <CommentBubbleSelector
    :displayedComments="displayedComments"
    :removeComment="removeComment"
    :shown="shown"
    :settings="setting"
    :fontFamily="appStore.data.ui.fontFamily"
  />
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { useCharacterManager } from '@/generator/scripts/CharacterManager/useCharacterManager'
  import { CommentBubbleSchema, ShownCharacter } from '@/types/ui'
  import { useFilteredBotMessages } from '@/ui/common/useFilteredBotMessages'
  import CommentBubbleSelector from './CommentBubbleSelector.vue'
  import { useBotDisplay } from '@/ui/common/useBotDisplay'

  const appStore = useAppStore()

  const { characterMap, hasImage, iconSrc, getCharacterLayers, getCharacterAnimation } = useCharacterManager(
    () => appStore.data.assets.characters
  )

  // 設定（未設定ならスキーマの既定値）
  const setting = computed(() => CommentBubbleSchema.parse(appStore.data.ui.settings.commentBubble ?? {}))

  // 全コメントを対象にする（characterKey での絞り込みなし）
  const { messages } = useFilteredBotMessages('commentBubble')
  const { displayedComments, removeComment, start, stop } = useBotDisplay(messages)

  // 表示中コメントのうち、画像を持つキャラの最新のもの（displayedComments は新しい順）
  const latestComment = computed(
    () => displayedComments.value.find((m) => m.display?.visible && hasImage(m.bubble.characterKey)) ?? null
  )

  // 表示するキャラクター: コメント中はそのキャラ(iconKeyの表情)、なければ常時表示キャラ(default固定)
  const shown = computed<ShownCharacter | null>(() => {
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
