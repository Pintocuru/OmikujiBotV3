<!-- src/ui/LiveClock/layouts/Steampunk.vue -->
<template>
  <div
    class="w-xs transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    :class="isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75 translate-y-4'"
    :style="rootStyle"
  >
    <!-- メインフレーム -->
    <div
      class="relative border-4 rounded-3xl overflow-hidden h-32.5"
      :style="{
        borderColor: 'var(--lc-accent)',
        backgroundColor: 'color-mix(in srgb, var(--lc-bg) 80%, black)',
      }"
    >
      <!-- リベット（四隅） -->
      <div
        v-for="position in rivetPositions"
        :key="position"
        class="absolute w-3 h-3 rounded-full border-2 shadow-inner z-10"
        :class="position"
        :style="{
          borderColor: 'var(--lc-accent)',
          backgroundColor: 'color-mix(in srgb, var(--lc-bg) 90%, black)',
        }"
      ></div>

      <!-- 背景の歯車 (装飾) -->
      <Cog
        class="absolute -right-4 -top-4 w-24 h-24 opacity-30 animate-spin-slow"
        :style="{ color: 'var(--lc-name)' }"
        :stroke-width="2"
      />
      <Cog
        class="absolute -left-6 -bottom-6 w-24 h-24 opacity-30 animate-spin-reverse"
        :style="{ color: 'var(--lc-name)' }"
        :stroke-width="2"
      />

      <!-- 蒸気パイプ（上部） -->
      <div
        class="absolute top-0 left-10 right-10 h-1.5 opacity-50 rounded-b-full"
        :style="{ backgroundColor: 'var(--lc-accent)' }"
      ></div>

      <div class="relative h-full flex flex-col items-center justify-center">
        <transition :name="transitionName" mode="out-in">
          <!-- 時計表示 -->
          <div v-if="!isFlipped" key="clock" class="flex flex-col items-center -mt-1">
            <!-- 圧力計風フレーム -->
            <div class="flex items-center gap-1">
              <!-- 時間ブロック -->
              <div class="flex items-baseline gap-0.5">
                <div
                  class="border-2 rounded-md px-1 shadow-inner"
                  :style="{
                    borderColor: 'var(--lc-accent)',
                    backgroundColor: 'color-mix(in srgb, var(--lc-bg) 90%, black)',
                  }"
                >
                  <span class="countdown font-mono font-black text-5xl" :style="{ color: 'var(--lc-text)' }">
                    <span :style="{ '--value': hours, '--digits': 2 }">
                      {{ hours }}
                    </span>
                  </span>
                </div>
              </div>

              <!-- コロン（ネジ風） -->
              <div class="flex flex-col gap-1.5 px-0.5 pb-1">
                <div
                  v-for="i in 2"
                  :key="i"
                  class="w-2 h-2 rounded-full border-2 transition-all duration-300"
                  :style="{
                    borderColor: 'var(--lc-accent)',
                    backgroundColor: colonVisible ? 'var(--lc-accent)' : 'transparent',
                  }"
                ></div>
              </div>

              <!-- 分ブロック -->
              <div class="flex items-baseline gap-0.5">
                <div
                  class="border-2 rounded-md px-1 shadow-inner"
                  :style="{
                    borderColor: 'var(--lc-accent)',
                    backgroundColor: 'color-mix(in srgb, var(--lc-bg) 90%, black)',
                  }"
                >
                  <span class="countdown font-mono font-black text-5xl" :style="{ color: 'var(--lc-text)' }">
                    <span :style="{ '--value': minutes, '--digits': 2 }">
                      {{ minutes }}
                    </span>
                  </span>
                </div>
              </div>

              <!-- 秒（オプション） -->
              <div v-if="settings.isSecond" class="flex items-end pb-0.5 pl-1">
                <div
                  class="border rounded px-1 py-0.5 shadow-inner"
                  :style="{
                    borderColor: 'var(--lc-accent)',
                    backgroundColor: 'color-mix(in srgb, var(--lc-bg) 90%, black)',
                  }"
                >
                  <span
                    class="countdown font-mono font-bold text-3xl leading-none"
                    :style="{ color: 'var(--lc-text)' }"
                  >
                    <span :style="{ '--value': seconds, '--digits': 2 }">
                      {{ seconds }}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <!-- 日付表示 -->
            <div
              v-if="settings.isDate"
              class="flex items-center justify-center text-base font-mono font-bold"
              :style="{ color: 'var(--lc-name)' }"
            >
              <span class="text-lg"> {{ year }}/{{ month }}/{{ date }} ({{ day }}) </span>
            </div>

            <!-- ゲージバー風メッセージ -->
            <div v-if="defaultMessage" class="w-full">
              <div
                class="relative rounded px-3 py-0.5 overflow-hidden border"
                :style="{
                  borderColor: 'color-mix(in srgb, var(--lc-accent) 50%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--lc-bg) 95%, black)',
                }"
              >
                <!-- 装飾ライン -->
                <div
                  class="absolute left-0 top-0 bottom-0 w-1 opacity-70"
                  :style="{ backgroundColor: 'var(--lc-accent)' }"
                ></div>
                <div
                  class="absolute right-0 top-0 bottom-0 w-1 opacity-70"
                  :style="{ backgroundColor: 'var(--lc-accent)' }"
                ></div>
                <div
                  class="text-base font-bold text-center line-clamp-1 pl-1 opacity-80"
                  :style="{ color: 'var(--lc-text)' }"
                >
                  <RotatingMessage :message="defaultMessage" />
                </div>
              </div>
            </div>
          </div>

          <!-- メッセージ表示 -->
          <div v-else key="msg" class="w-full px-6 flex flex-col items-center gap-2">
            <!-- スチームパンク風テキストフレーム -->
            <div
              class="relative border rounded-lg p-1 w-full"
              :style="{
                borderColor: 'var(--lc-accent)',
                backgroundColor: 'color-mix(in srgb, var(--lc-bg) 85%, transparent)',
              }"
            >
              <p
                class="text-xl font-bold leading-tight text-center line-clamp-3"
                :style="{ color: 'var(--lc-text)' }"
                v-html="currentMsg"
              ></p>
            </div>
            <!-- 圧力インジケーター風ドット -->
            <div class="flex gap-2 items-center">
              <div class="w-1 h-1 rounded-full" :style="{ backgroundColor: 'var(--lc-accent)' }"></div>
              <div
                v-for="i in 3"
                :key="i"
                class="w-2 h-2 rounded-full border animate-bounce"
                :style="{
                  borderColor: 'var(--lc-accent)',
                  animationDelay: `${i * 0.25}s`,
                }"
              ></div>
              <div class="w-1 h-1 rounded-full" :style="{ backgroundColor: 'var(--lc-accent)' }"></div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 蒸気パイプ（下部） -->
      <div
        class="absolute bottom-0 left-16 right-16 h-1.5 opacity-50 rounded-t-full"
        :style="{ backgroundColor: 'var(--lc-accent)' }"
      ></div>

      <!-- サイドバルブ（左右共通） -->
      <div
        v-for="side in sidePositions"
        :key="side.side"
        class="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5"
        :class="side.class"
      >
        <div class="w-4 h-2 rounded-r-sm opacity-70" :style="{ backgroundColor: 'var(--lc-accent)' }"></div>
        <div class="w-5 h-3 rounded-r-md shadow opacity-70" :style="{ backgroundColor: 'var(--lc-accent)' }"></div>
        <div class="w-4 h-2 rounded-r-sm opacity-70" :style="{ backgroundColor: 'var(--lc-accent)' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { Cog } from 'lucide-vue-next'
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

  // リベットの位置クラス
  const rivetPositions = ['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2']

  // サイドバルブの位置設定
  const sidePositions = [
    { side: 'left', class: '-left-2' },
    { side: 'right', class: '-right-2' },
  ]

  // トランジション名
  const transitionName = ref('steam-up')
  watch(
    () => props.isFlipped,
    (next) => {
      transitionName.value = next ? 'steam-up' : 'piston-down'
    }
  )
</script>

<style scoped>
  /* 歯車回転アニメーション */
  .animate-spin-slow {
    animation: spin 8s linear infinite;
  }
  .animate-spin-reverse {
    animation: spin 10s linear infinite reverse;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* ─── steam-up: 時計 → メッセージ ─────────────────────────
     退場: 上へスケールアップしながら蒸気のようにフェードアウト
     登場: 下から圧力で押し上げられるようにバウンス登場          */
  .steam-up-leave-active {
    transition: all 0.28s cubic-bezier(0.4, 0, 1, 1);
  }
  .steam-up-leave-to {
    opacity: 0;
    transform: translateY(-18px) scaleY(0.7) scaleX(1.1);
    filter: blur(6px);
  }

  .steam-up-enter-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .steam-up-enter-from {
    opacity: 0;
    transform: translateY(24px) scale(0.85);
    filter: blur(4px);
  }

  /* ─── piston-down: メッセージ → 時計 ──────────────────────
     退場: 下に沈んでスケールダウン（ピストンが戻る）
     登場: 上からガコンと降りてくる（歯車が噛み合う衝撃）      */
  .piston-down-leave-active {
    transition: all 0.28s cubic-bezier(0.4, 0, 0.6, 1);
  }
  .piston-down-leave-to {
    opacity: 0;
    transform: translateY(18px) scaleY(0.75) scaleX(1.05);
    filter: blur(4px);
  }

  .piston-down-enter-active {
    /* 少し硬めのバウンスで「重い歯車が落ちてくる」質感 */
    transition: all 0.48s cubic-bezier(0.22, 1.8, 0.36, 1);
  }
  .piston-down-enter-from {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
    filter: blur(3px);
  }
</style>
