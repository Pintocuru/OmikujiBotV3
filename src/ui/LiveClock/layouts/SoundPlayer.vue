<!-- src/ui/LiveClock/layouts/SoundPlayer.vue -->
<template>
  <div class="w-md transition-all duration-500 ease-out" :style="rootStyle">
    <div
      class="cyber-frame relative border px-4 overflow-hidden"
      :style="{
        borderColor: 'var(--lc-accent)',
        backgroundColor: 'color-mix(in srgb, var(--lc-bg) 85%, transparent)',
      }"
    >
      <div class="relative h-38 flex items-center">
        <transition name="cyber-slide" mode="out-in">
          <!-- 時計表示 -->
          <div v-if="!isFlipped" key="clock" class="w-full">
            <!-- 日付表示 -->
            <div
              v-if="settings.isDate && !isFlipped"
              class="font-mono text-2xl font-bold -mb-3"
              :style="{ color: 'var(--lc-name)' }"
            >
              {{ year }}/{{ month }}/{{ date }} ({{ day }})
            </div>

            <!-- 時刻表示 -->
            <div
              class="flex items-baseline font-mono text-8xl font-black leading-none tracking-tighter"
              :style="{ color: 'var(--lc-text)' }"
            >
              <span>{{ hours }}</span>
              <span class="mx-1 transition-opacity duration-100" :class="{ 'opacity-20': !colonVisible }">:</span>
              <span>{{ minutes }}</span>

              <!-- 秒表示 -->
              <span v-if="settings.isSecond" class="pl-3 text-6xl leading-none">{{ seconds }}</span>
            </div>

            <div class="flex items-center gap-1 -mt-1">
              <!-- ON_AIR バッジ（アクセントカラー） -->
              <div
                class="px-1 text-base rounded-sm font-bold animate-pulse"
                :style="{
                  backgroundColor: 'var(--lc-accent)',
                  color: 'var(--lc-bg)',
                  animationDuration: '6s',
                }"
              >
                ON_AIR
              </div>

              <!-- 下部メッセージ -->
              <div class="text-xl truncate font-bold line-clamp-1 opacity-80" :style="{ color: 'var(--lc-text)' }">
                <RotatingMessage :message="defaultMessage" />
              </div>
            </div>
          </div>

          <!-- メッセージ表示 -->
          <div v-else key="msg" class="w-full" :style="{ color: 'var(--lc-text)' }">
            <div class="flex items-center gap-2 text-lg tracking-[0.2em]" :style="{ color: 'var(--lc-accent)' }">
              <span class="animate-pulse">▶▶</span>
              <span>SIGNAL_RECEIVED</span>
            </div>

            <p class="text-3xl font-bold leading-tight line-clamp-3" v-html="currentMsg"></p>

            <!-- プログレスバー -->
            <div
              class="mt-2 w-full relative overflow-hidden h-1"
              :style="{ backgroundColor: 'color-mix(in srgb, var(--lc-accent) 25%, transparent)' }"
            >
              <div
                class="absolute inset-0 w-1/3 cyber-progress-anim"
                :style="{ backgroundColor: 'var(--lc-accent)' }"
              ></div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 角パーツ（アクセントカラー） -->
      <div
        class="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2"
        :style="{ borderColor: 'var(--lc-accent)' }"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2"
        :style="{ borderColor: 'var(--lc-accent)' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { LiveClockType } from '@/types/ui'
  import { useLiveClockTime } from '../composables/useLiveClockTime'
  import RotatingMessage from '../composables/RotatingMessage.vue'

  const props = defineProps<{
    settings: LiveClockType
    defaultMessage: string
    isMounted: boolean
    isFlipped: boolean
    currentMsg: string
  }>()

  const { hours, minutes, seconds, colonVisible, year, month, date, day } = useLiveClockTime()

  // CharacterColorScheme の4色(name/text/background/accent)を CSS 変数として定義
  const rootStyle = computed(() => ({
    '--lc-name': props.settings.color.name,
    '--lc-text': props.settings.color.text,
    '--lc-bg': props.settings.color.background,
    '--lc-accent': props.settings.color.accent,
  }))
</script>

<style scoped>
  /* サイバーパンク特有の形状 (右下を斜めにカット) */
  .cyber-frame {
    clip-path: polygon(0 0, 100% 0, 100% 75%, 95% 100%, 0 100%);
  }

  /* 独自のプログレスバーアニメーション */
  .cyber-progress-anim {
    animation: cyber-data-move 2s infinite linear;
  }

  @keyframes cyber-data-move {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(300%);
    }
  }

  /* アニメーション: スライド (Tailwindのtransitionでは表現しきれないカスタム挙動) */
  .cyber-slide-enter-active,
  .cyber-slide-leave-active {
    transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .cyber-slide-enter-from {
    opacity: 0;
    transform: translateX(20px) skewX(-10deg);
  }

  .cyber-slide-leave-to {
    opacity: 0;
    transform: translateX(-20px) skewX(10deg);
  }
</style>
