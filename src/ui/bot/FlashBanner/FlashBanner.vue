<!-- src/ui/FlashBanner/FlashBanner.vue -->
<template>
  <FlashBannerSelector
    :key="currentKey"
    :settings="settings"
    :message="message"
    :character-layers="characterLayers"
    :character-animation="characterAnimation"
    :color="color"
    :label-class="blinkClass"
  />
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, watch } from 'vue'
  import { FlashBannerSchema } from '@/types/ui'
  import FlashBannerSelector from './FlashBannerSelector.vue'
  import { useFlashBannerDefaultTemplate } from './composables/useFlashBannerDisplay'
  import { useDelayedBlink } from './composables/useDelayedBlink'
  import { useFilteredBotMessages } from '@/ui/common/useFilteredBotMessages'
  import { useBotDisplay } from '@/ui/common/useBotDisplay'
  import { usePlaceholderInterval } from '@/ui/common/usePlaceholderInterval'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { useCharacters } from '@/common/characters/useCharacters'

  const appStore = useAppStore()

  const { getCharacterLayers, getCharacterAnimation, getCharacterColor, isValidCharacter } = useCharacters(
    () => appStore.data.assets.characters
  )

  // 設定（未設定ならスキーマの既定値）
  const settings = computed(() => FlashBannerSchema.parse(appStore.data.ui?.settings?.flashBanner ?? {}))

  // コメント(1 件ずつ表示。キャラの絞り込みなし)
  const { messages } = useFilteredBotMessages('flashBanner', { userIconSize: 12 })
  const { displayedComments, start, stop } = useBotDisplay(messages)

  // 表示中のコメント(display.visible が true のもの。退場中のコメントは除く)
  const visibleComment = computed(() => displayedComments.value.find((m) => m.display.visible) ?? null)
  const isShowingDefault = () => visibleComment.value === null

  // コメントがないときの文言(slot0。プレースホルダーを一定間隔で解決し直す)
  const { template } = useFlashBannerDefaultTemplate()
  const {
    message: defaultText,
    commitIfPending,
    refreshPending,
    registerIntervalHook,
  } = usePlaceholderInterval(() => template.value)

  // インターバルのタイミングで、デフォルト表示中なら用意済みの文言を反映する
  registerIntervalHook(() => commitIfPending(isShowingDefault()))
  // slot0 が届いたら、次のインターバルを待たずに反映する
  watch(template, () => {
    refreshPending()
    commitIfPending(isShowingDefault())
  })
  // コメントが終わってデフォルトに戻るとき、用意済みの文言があれば反映する
  watch(visibleComment, (comment) => {
    if (!comment) commitIfPending(true)
  })

  // 表示する内容(何もなければ message は空 = 何も表示しない)
  const message = computed(() => visibleComment.value?.bubble.message ?? defaultText.value)

  // キャラクター(コメントのキャラ。slot0 の文言のときはなし)
  const characterLayers = computed(() => (visibleComment.value ? getCharacterLayers(visibleComment.value) : []))
  const characterAnimation = computed(() =>
    visibleComment.value ? getCharacterAnimation(visibleComment.value) : undefined
  )

  // 配色: キャラがいるときはそのキャラの色、いないときは設定の色
  const color = computed(() => {
    const key = visibleComment.value?.bubble.characterKey
    return key && isValidCharacter(key) ? getCharacterColor(key) : settings.value.color
  })

  // メッセージが切り替わったときに、ラベルを点滅させる(最初の表示では点滅しない)
  const currentKey = computed(() => visibleComment.value?.id ?? 'default')
  const { blinkClass, triggerBlink, stopBlink } = useDelayedBlink()
  watch(currentKey, () => triggerBlink(true))

  onMounted(start)
  onUnmounted(() => {
    stop()
    stopBlink()
  })
</script>
