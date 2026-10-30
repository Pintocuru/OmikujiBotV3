<!-- src/editor/assets/ScenarioStep/preview/ScenarioStepPreview.vue -->
<template>
  <div class="h-full flex flex-col items-center justify-center space-y-4">
    <!-- message / gameScript: UI ごとのプレビュー(uiEditorRegistry に登録。無ければ CommentBubblePreview) -->
    <div v-if="previewProps" class="w-full">
      <component :is="previewComponent" v-bind="previewProps" @refresh="refreshMessage" />
    </div>

    <!-- 変数(評価ブロック):ソースコード風表示 -->
    <div v-else-if="action.kind === 'variable'" class="w-full px-2">
      <pre
        class="text-xs font-mono text-left bg-base-300 text-base-content rounded-lg p-3 max-h-64 overflow-auto whitespace-pre-wrap break-all"
      ><code>{{ action.message || t('scenarioStep.stepPreview.noMessage') }}</code></pre>
    </div>

    <!-- サウンド -->
    <div v-else-if="action.kind === 'sound'" class="w-full text-center">
      <Volume2 :size="80" class="mx-auto text-blue-500" />
      <p class="text-sm opacity-70 mt-2">{{ t('scenarioStep.stepPreview.sound') }}</p>
    </div>

    <!-- WordParty -->
    <div v-else-if="action.kind === 'wordParty'" class="w-full text-center">
      <PartyPopper :size="80" class="mx-auto text-purple-500" />
      <p class="text-sm opacity-70 mt-2">WordParty</p>
    </div>

    <!-- シナリオ呼び出し -->
    <div v-else-if="action.kind === 'scenarioCall'" class="w-full text-center">
      <MessagesSquare :size="80" class="mx-auto text-red-500" />
      <p class="text-sm opacity-70 mt-2">{{ t('scenarioStep.stepPreview.scenarioCall') }}</p>
    </div>

    <!-- 評価ブロックなど、プレビューがない場合 -->
    <div v-else class="w-full text-center opacity-60">
      <div class="flex flex-col items-center space-y-2">
        <Settings :size="64" class="text-gray-400" />
        <p class="text-sm">{{ t('scenarioStep.stepPreview.none') }}</p>
      </div>
    </div>

    <!-- テストボタン -->
    <div class="w-full text-center mt-2">
      <WordPartyTestButton v-if="action.kind === 'wordParty'" :id="action.wordPartyId" :repeat="action.repeat" />
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
  import { computed, ref, watch, type Component } from 'vue'
  import { storeToRefs } from 'pinia'
  import { Volume2, PartyPopper, MessagesSquare, Settings } from 'lucide-vue-next'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import type { ScenarioStepType } from '@/types/OmikujiData'
  import SoundTestButton from './SoundTestButton.vue'
  import WordPartyTestButton from './WordPartyTestButton.vue'
  import { processTestPlaceholder } from './TestPlaceholderProcessor'
  import CommentBubblePreview from './CommentBubblePreview.vue'
  import { getUiPreview } from '@/editor/ui/uiEditorRegistry'
  import { GameScriptManager } from '@/engine/GameScriptPlay/GameScriptManager'

  const { t } = useI18n()

  const props = defineProps<{
    action: ScenarioStepType
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const soundEnabled = computed(() => data.value.settings.generator.soundEnabled)
  // リフレッシュキー
  const messageKey = ref(0)
  const refreshMessage = () => messageKey.value++

  // メッセージ処理
  const processedMessage = computed(() => {
    const _ = messageKey.value

    if (props.action.kind !== 'message') return t('scenarioStep.stepPreview.invalid')
    const content = props.action.message
    if (!content) return t('scenarioStep.stepPreview.noMessage')
    const processed = processTestPlaceholder(content, data.value.assets.placeholders)
    return transformIconPlaceholdersPreview(processed.text)
  })

  // gameScript: sampleRun の返り値をプレビュー用メッセージにする
  const scriptManager = new GameScriptManager()
  const gameScriptMessage = ref('')
  let gameScriptRequestId = 0

  watch(
    () => {
      const a = props.action
      return a.kind === 'gameScript' ? ([a.scriptId, a.queryString, messageKey.value] as const) : null
    },
    async (args) => {
      if (!args) return
      const [scriptId, queryString] = args
      const requestId = ++gameScriptRequestId
      const result = await scriptManager.playSampleScript(scriptId, queryString)
      if (requestId !== gameScriptRequestId) return // 古い結果は破棄
      gameScriptMessage.value = transformIconPlaceholdersPreview(result)
    },
    { immediate: true }
  )

  // message / gameScript を UI のプレビューに渡す。gameScript は CommentBubblePreview 固定
  const previewComponent = computed<Component>(() =>
    props.action.kind === 'message' ? (getUiPreview(props.action.uiKey) ?? CommentBubblePreview) : CommentBubblePreview
  )
  const previewProps = computed(() => {
    const a = props.action
    if (a.kind === 'message') {
      return { message: processedMessage.value, slots: a.slots, characterKey: a.characterKey, iconKey: a.iconKey }
    }
    if (a.kind === 'gameScript') {
      return { message: gameScriptMessage.value, characterKey: a.characterKey, iconKey: 'default' }
    }
    return null
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
