<!-- src/ui/GameRanking/layouts/RankStandard/GameRankingList.vue -->
<template>
  <div v-if="settings" class="rank-card flex flex-col rounded-2xl shadow-xl" :style="rootStyle">
    <div class="flex flex-col p-2">
      <div class="space-y-1">
        <div
          v-for="(msg, index) in displayMessages"
          :key="`${msg.id}-${index}`"
          class="rank-row flex items-center gap-1 p-1 rounded-lg transition-all"
          :style="getRowStyle(index)"
        >
          <!-- スコア順のときだけ順位バッジを表示 -->
          <div v-if="settings.sortOrder === 'high' || settings.sortOrder === 'low'" class="shrink-0">
            <div
              class="ml-1 inline-flex h-6 min-w-6 items-center justify-center rounded-lg px-2 text-sm font-bold"
              :style="getRankBadgeStyle(index)"
            >
              {{ index + 1 }}
            </div>
          </div>

          <!-- 名前 -->
          <div class="grow min-w-0 items-center flex flex-nowrap">
            <!-- アイコン -->
            <div class="mr-1 shrink-0">
              <div class="h-7 w-7 overflow-hidden rounded-full">
                <img
                  :src="msg.user?.profileImage || getAvatarUrl(msg.user?.userName ?? 'Anonymous')"
                  class="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>

            <!-- 名前 -->
            <span class="text-lg font-bold truncate" :style="{ color: medal && index < 3 ? '#333' : 'var(--rk-name)' }">
              {{ msg.slots.listName || msg.user.userName || 'Anonymous' }}
            </span>
            <!-- symbol -->
            <span
              v-if="msg.slots.symbol"
              class="text-base font-semibold truncate ml-2"
              :style="{ opacity: 0.6 }"
            >
              {{ msg.slots.symbol }}
            </span>
          </div>

          <!--スコア -->
          <div class="shrink-0">
            <div
              class="inline-flex h-8 items-center justify-center rounded-lg px-3 text-lg font-bold"
              :style="scoreBadgeStyle"
            >
              {{ msg.slots.label || msg.slots.score }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { generateDummyMessages } from '@/common/MockUser/MockGenerators'
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'
  import { BotMessageRankingType } from '@/types/generator'
  import { GameRankingType } from '@/types/ui'

  const props = defineProps<{
    listMessages: BotMessageRankingType[]
    settings: GameRankingType
    medal?: boolean // true: 1〜3位の行背景を金・銀・銅の固定色にする
  }>()

  // 表示用メッセージ（空の場合はダミーを生成）
  const displayMessages = computed(() => {
    if (props.listMessages.length > 0) {
      let data = [...props.listMessages]

      switch (props.settings.sortOrder) {
        case 'high':
          data.sort((a, b) => {
            const diff = b.slots.score - a.slots.score
            if (diff !== 0) return diff
            return b.user.timestamp - a.user.timestamp
          })
          break
        case 'low':
          data.sort((a, b) => {
            const diff = a.slots.score - b.slots.score
            if (diff !== 0) return diff
            return b.user.timestamp - a.user.timestamp
          })
          break
        case 'new':
        default:
          data.sort((a, b) => b.user.timestamp - a.user.timestamp)
          break
      }

      return data.slice(0, props.settings.limit || 10)
    }

    return generateDummyMessages(props.settings)
  })

  // CharacterColorScheme の4色(name/text/background/accent)を CSS 変数として流し込む
  const rootStyle = computed(() => ({
    '--rk-name': props.settings.color.name,
    '--rk-text': props.settings.color.text,
    '--rk-bg': props.settings.color.background,
    '--rk-accent': props.settings.color.accent,
    backgroundColor: 'var(--rk-bg)',
    color: 'var(--rk-text)',
  }))

  const mix = (color: string, percent: number) => `color-mix(in srgb, ${color} ${percent}%, transparent)`

  // 上位3位の行の背景(accent の濃淡で表現)
  const RANK_ROW_ALPHA = [70, 45, 25] as const
  // 金・銀・銅(medal 指定時のみ)
  const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'] as const

  const getRowStyle = (index: number) => {
    if (props.medal) {
      const color = MEDAL_COLORS[index]
      // メダル行は背景が固定色なので、テキスト色も固定にして可読性を確保
      return color ? { backgroundColor: color, color: '#333' } : {}
    }
    const alpha = RANK_ROW_ALPHA[index]
    return alpha ? { backgroundColor: mix('var(--rk-accent)', alpha) } : {}
  }

  // 順位バッジ
  const getRankBadgeStyle = (index: number) =>
    index < RANK_ROW_ALPHA.length
      ? { backgroundColor: 'var(--rk-accent)', color: 'var(--rk-bg)' }
      : { backgroundColor: mix('var(--rk-text)', 15), color: 'var(--rk-text)' }

  // スコアバッジ
  const scoreBadgeStyle = {
    backgroundColor: 'var(--rk-accent)',
    color: 'var(--rk-bg)',
  }
</script>

<style scoped>
  .rank-card {
    animation: fadeIn 0.3s ease-in;
  }

  .rank-row:hover {
    background-color: color-mix(in srgb, var(--rk-text) 10%, transparent);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
