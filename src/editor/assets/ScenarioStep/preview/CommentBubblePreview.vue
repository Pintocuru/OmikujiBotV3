<!-- src/editor/assets/ScenarioStep/preview/CommentBubblePreview.vue -->
<template>
  <div class="w-full space-y-8 flex flex-col items-center">
    <CommentBubbleItem
      :key="bubbleKey"
      :botName="character ? character.displayName : null"
      :message="message ?? ''"
      :color="character ? character.color : defaultColor"
      class="cursor-pointer"
      @click="refresh"
    />
    <LayerImage
      :layers="character?.image?.[iconKey || 'default']?.src ?? []"
      :size="bubbleSettings.characterSize"
      :animation="character?.image?.[iconKey || 'default']?.animation"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { CharacterColorScheme } from '@/types/OmikujiData'
  import { CommentBubbleSchema } from '@/types/ui/CommentBubbleSchema'
  import type { BotMessageSlotsType } from '@/types/generator'
  import CommentBubbleItem from '@/ui/common/CommentBubbleItem.vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'

  // UI プレビュー共通の props(uiEditorRegistry の preview はすべてこれを受ける)
  // slots は使わない(CommentBubble には slots がない)
  const props = defineProps<{
    message?: string
    characterKey?: string
    iconKey?: string
    slots?: BotMessageSlotsType
  }>()

  // クリックで再抽選(message の加工は親が持つので、親に頼む)
  const emit = defineEmits<{ refresh: [] }>()

  const { data } = storeToRefs(useOmikujiStore())
  const bubbleSettings = computed(() => CommentBubbleSchema.parse(data.value.ui.settings.commentBubble ?? {}))
  const defaultColor = CharacterColorScheme.parse({})

  const character = computed(() => {
    if (!props.characterKey) return null
    return Object.values(data.value.assets.characters).find((c) => c.key === props.characterKey) ?? null
  })

  // フキダシを作り直すキー
  const bubbleKey = ref(0)
  const refresh = () => {
    bubbleKey.value++
    emit('refresh')
  }
</script>
