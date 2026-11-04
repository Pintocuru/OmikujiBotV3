<!-- src/ui/CommentBubble/editor/CommentBubblePreview.vue -->
<template>
  <HudPreview :isHeight="false">
    <div :class="useFontFamily(fontFamily)">
      <div class="relative h-90 overflow-hidden">
        <component
          :is="currentComponent"
          v-if="currentComponent"
          :displayedComments="displayedComments"
          :removeComment="removeComment"
          :shown="shown"
          :settings="settings"
        />
        <div v-else-if="loadError" class="alert alert-error m-2 text-sm" role="alert">{{ loadError }}</div>
      </div>
    </div>

    <template #hud>
      <div class="flex justify-center mt-2">
        <button type="button" class="btn btn-ghost btn-sm" @click="replay">再表示</button>
      </div>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, provide, ref, shallowRef, watch, type Component } from 'vue'
  import { CharacterColorScheme, type CharacterType, type FontFamilyType } from '@/types/OmikujiData'
  import type { CommentBubbleType, ShownCharacter } from '@/types/ui'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import { withDisplay, type DisplayedBotMessage } from '@/ui/common/useBotDisplay'
  import { getCommentBubbleComponent } from '../CommentBubbleRegistry'
  import { previewColorKey } from '../parts/previewColor'
  import HudPreview from '@/editor/parts/HudPreview.vue'

  const props = defineProps<{
    settings: CommentBubbleType
    fontFamily?: FontFamilyType
    characterKey?: string | null // プレビューに使うキャラ(未指定ならキャラなし)
    character?: CharacterType | null
  }>()

  // 色はキャラの色に固定(CommentDisplay 側の store 参照を上書き)
  const color = computed(() => props.character?.color ?? CharacterColorScheme.parse({}))
  provide(previewColorKey, color)

  // --- 表示タイプの読み込み(CommentBubbleSelector と同じ仕組み。未登録の通知は出さない) ---
  const currentComponent = shallowRef<Component | null>(null)
  const loadError = ref('')

  watch(
    () => props.settings.component,
    async (id) => {
      currentComponent.value = null
      loadError.value = ''

      const definition = getCommentBubbleComponent(id)
      if (!definition) {
        loadError.value = `未登録の表示タイプ: ${id}`
        return
      }
      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[CommentBubblePreview] Component load failed: ${id}`, error)
        loadError.value = `表示タイプ「${id}」の読み込みに失敗しました`
      }
    },
    { immediate: true }
  )

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
  const SAMPLE_MESSAGES = ['これはプレビュー表示です。', '実際の表示タイプと同じ配置で確認できます。']

  const buildSamples = (): DisplayedBotMessage[] => {
    const message = SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)]

    return [
      withDisplay({
        id: 'preview-0',
        timestamp: new Date().toISOString(),
        delaySeconds: 0,
        uiKey: 'commentBubble',
        bubble: {
          name: props.character?.displayName ?? 'テストユーザー',
          message,
          characterKey: props.characterKey ?? null,
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
