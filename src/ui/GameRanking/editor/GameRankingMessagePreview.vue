<!-- src/ui/GameRanking/editor/GameRankingMessagePreview.vue -->
<template>
  <HudPreview :isAdminOnly="true">
    <GameRankingSelector :rankingMessages="rankingMessages" :settings="ranking" :fontFamily="fontFamily" />
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { GameRankingSchema } from '@/types/ui/GameRankingSchema'
  import { BotMessageSchema, toRankingEntry, type BotMessageSlotsType } from '@/types/generator'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import GameRankingSelector from '@/ui/GameRanking/GameRankingSelector.vue'

  // UI プレビュー共通の props。gameRanking は slots だけを使う(bubble がない)
  const props = defineProps<{
    message?: string
    characterKey?: string
    iconKey?: string
    slots?: BotMessageSlotsType
  }>()

  const { data } = storeToRefs(useOmikujiStore())
  const fontFamily = computed(() => data.value.ui.fontFamily)
  const ranking = computed(() => GameRankingSchema.parse(data.value.ui.settings.gameRanking ?? {}))

  // 本番と同じ変換(BotMessage → ranking)を通す。得点などが不正なら表示しない
  const rankingMessages = computed(() => {
    const parsed = BotMessageSchema.safeParse({
      id: 'preview-ranking',
      uiKey: 'gameRanking',
      user: { userId: 'preview', userName: 'テストユーザー' },
      slots: props.slots ?? {},
    })
    const entry = parsed.success ? toRankingEntry(parsed.data) : null
    return entry ? [entry] : []
  })
</script>
