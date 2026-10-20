<!-- src/editor/assets/PostFlow/preview/PostActionPreview.vue -->
<template>
  <div class="h-full flex flex-col items-center justify-center space-y-4">
    <!-- メッセージアクション -->
    <div v-if="action.kind === 'message'" class="w-full space-y-8 flex flex-col items-center">
      <CommentBubbleItem
        :key="messageKey"
        :botName="character ? character.displayName : null"
        :message="processedMessage"
        :color="character ? character.color : defaultColor"
        @click="refreshMessage"
        class="cursor-pointer"
      />
      <LayerImage
        :layers="character?.image?.[action.iconKey]?.src ?? []"
        :size="bubbleSettings.characterSize"
        :animation="character?.image?.[action.iconKey]?.animation"
      />
    </div>

    <!-- サウンドアクション -->
    <div v-else-if="action.kind === 'sound'" class="w-full text-center">
      <Volume2 :size="80" class="mx-auto text-blue-500" />
      <p class="text-sm opacity-70 mt-2">{{ t('postFlow.actionPreview.sound') }}</p>
    </div>

    <!-- WordPartyアクション -->
    <div v-else-if="action.kind === 'wordParty'" class="w-full text-center">
      <PartyPopper :size="80" class="mx-auto text-purple-500" />
      <p class="text-sm opacity-70 mt-2">WordParty</p>
    </div>

    <!-- アクションセット呼び出し -->
    <div v-else-if="action.kind === 'flowCall'" class="w-full text-center">
      <MessagesSquare :size="80" class="mx-auto text-red-500" />
      <p class="text-sm opacity-70 mt-2">{{ t('postFlow.actionPreview.actionSet') }}</p>
    </div>

    <!-- 評価ブロックなど、プレビューがない場合 -->
    <div v-else class="w-full text-center opacity-60">
      <div class="flex flex-col items-center space-y-2">
        <Settings :size="64" class="text-gray-400" />
        <p class="text-sm">{{ t('postFlow.actionPreview.none') }}</p>
      </div>
    </div>

    <!-- テストボタン -->
    <div class="w-full text-center mt-2">
      <WordPartyTestButton
        v-if="action.kind === 'wordParty'"
        :id="action.wordPartyId"
        :pattern="null"
        :repeat="action.repeat"
      />
      <SoundTestButton
        v-if="soundEnabled && (action.kind === 'sound' || action.kind === 'message')"
        :sound="action.sound"
        :soundPath="action.soundPath"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { Volume2, PartyPopper, MessagesSquare, Settings } from 'lucide-vue-next'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { CharacterColorScheme } from '@/types/OmikujiData'
  import type { PostFlowType } from '@/types/OmikujiData'
  import SoundTestButton from './SoundTestButton.vue'
  import WordPartyTestButton from './WordPartyTestButton.vue'
  import { processTestPlaceholder } from './TestPlaceholderProcessor'
  import CommentBubbleItem from '@/ui/common/CommentBubbleItem.vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { CommentBubbleSchema } from '@/ui/types/CommentBubbleSchema'

  const { t } = useI18n()

  const props = defineProps<{
    action: PostFlowType
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const soundEnabled = computed(() => data.value.settings.generator.soundEnabled)
  const characters = computed(() => data.value.assets.characters)
  const bubbleSettings = computed(() => data.value.ui.settings.commentBubble ?? CommentBubbleSchema.parse({}))
  const defaultColor = CharacterColorScheme.parse({})

  // リフレッシュキー
  const messageKey = ref(0)
  const refreshMessage = () => messageKey.value++

  // キャラクター取得
  const character = computed(() => {
    if (props.action.kind !== 'message') return null
    const key = props.action.characterKey
    if (key === null) return null
    return Object.values(characters.value).find((c) => c.key === key) ?? null
  })

  // メッセージ処理
  const processedMessage = computed(() => {
    const _ = messageKey.value

    if (props.action.kind !== 'message') return t('postFlow.actionPreview.invalid')
    const content = props.action.message
    if (!content) return t('postFlow.actionPreview.noMessage')
    const processed = processTestPlaceholder(content, data.value.assets.placeholders)
    if (!processed) return t('postFlow.actionPreview.hidden')
    return transformIconPlaceholdersPreview(processed.text)
  })

  function transformIconPlaceholdersPreview(raw: string): string {
    return raw.replace(/\{\{icon\s+([^\}]+)\}\}/g, (_, userId) => {
      // userId の頭文字を使った placeholder
      const initial = String(userId).charAt(0).toUpperCase()

      return `
      <span class="avatar placeholder mr-1 inline-flex">
        <span class="bg-neutral text-neutral-content w-6 h-6 rounded-full flex items-center justify-center text-sm">
          ${initial}
        </span>
      </span>
    `
    })
  }
</script>
