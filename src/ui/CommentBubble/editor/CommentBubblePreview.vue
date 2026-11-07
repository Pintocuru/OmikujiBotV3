<!-- src/ui/CommentBubble/editor/CommentBubblePreview.vue -->
<template>
  <HudPreview :isHeight="false">
    <div class="relative h-100 overflow-hidden">
      <CommentBubbleSelector
        :displayedComments="displayedComments"
        :removeComment="removeComment"
        :shown="shown"
        :settings="settings"
        :fontFamily="fontFamily"
        editorPreview
      />
    </div>

    <template #hud>
      <div class="flex justify-center mt-2">
        <button type="button" class="btn btn-ghost btn-sm" @click="replay">
          {{ t('uiSettings.commentBubble.preview.replay') }}
        </button>
      </div>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, provide, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { CharacterColorSchema, type CharacterType, type FontFamilyType } from '@/types/OmikujiData'
  import type { CommentBubbleType, ShownCharacter } from '@/types/ui'
  import { withDisplay, type DisplayedBotMessage } from '@/ui/common/useBotDisplay'
  import { getCommentBubbleComponent } from '../CommentBubbleRegistry'
  import CommentBubbleSelector from '../CommentBubbleSelector.vue'
  import { previewColorKey } from '../parts/previewColor'
  import HudPreview from '@/editor/parts/HudPreview.vue'

  const props = defineProps<{
    settings: CommentBubbleType
    fontFamily?: FontFamilyType
    characterKey?: string // プレビューに使うキャラ(未指定ならキャラなし)
    character?: CharacterType | null
  }>()

  // 色はキャラの色に固定(CommentDisplay 側の store 参照を上書き)
  const color = computed(() => props.character?.color ?? CharacterColorSchema.parse({}))
  provide(previewColorKey, color)

  // --- キャラクター(hasCharacter な表示タイプだけ。default 画像、なければ最初に画像のある表情) ---
  const layers = computed(() => {
    const images = props.character?.image ?? {}
    const hasSrc = (src?: string[]) => (src ?? []).some((p) => p && p.trim() !== '')
    const entry = hasSrc(images['default']?.src) ? images['default'] : Object.values(images).find((i) => hasSrc(i.src))
    return { src: entry?.src ?? [], animation: entry?.animation }
  })

  const shown = computed<ShownCharacter | null>(() => {
    if (!getCommentBubbleComponent(props.settings.component)?.hasCharacter) return null
    if (!props.characterKey || layers.value.src.length === 0) return null
    return { key: props.characterKey, layers: layers.value.src, animation: layers.value.animation }
  })

  // --- サンプルコメント(displayedComments は新しい順) ---
  const { t } = useI18n()

  const buildSamples = (): DisplayedBotMessage[] => {
    const sampleKeys = ['sample1', 'sample2'] as const
    const message = t(`uiSettings.commentBubble.preview.${sampleKeys[Math.floor(Math.random() * sampleKeys.length)]}`)

    return [
      withDisplay({
        id: 'preview-0',
        timestamp: new Date().toISOString(),
        delaySeconds: 0,
        uiKey: 'commentBubble',
        bubble: {
          name: props.character?.displayName ?? t('uiSettings.commentBubble.preview.userName'),
          message,
          characterKey: props.characterKey ?? '',
          iconKey: 'default',
        },
      }),
    ]
  }

  const displayedComments = ref<DisplayedBotMessage[]>([])
  const removeComment = (id: string) => {
    displayedComments.value = displayedComments.value.filter((m) => m.id !== id)
  }

  // 入場アニメーションをやり直す
  const replay = async () => {
    displayedComments.value = []
    await nextTick()
    displayedComments.value = buildSamples()
  }

  onMounted(replay)
  watch(() => [props.settings.component, props.settings.bubbleMotion], replay)
</script>
