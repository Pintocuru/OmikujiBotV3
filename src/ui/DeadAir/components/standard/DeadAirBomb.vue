<!-- src/ui/DeadAir/components/standard/DeadAirBomb.vue -->
<template>
  <!-- ルート:背景色。全画面にするか(本番)、プレビュー枠に収めるかは Selector 側が決める -->
  <div class="absolute inset-0 overflow-hidden" :class="obstacle === 'white' ? 'bg-white' : 'bg-black'">
    <!-- 暗転オーバーレイ -->
    <div
      class="absolute inset-0 bg-black pointer-events-none z-10 transition-opacity duration-[800ms]"
      :style="{ opacity: darknessOpacity }"
      aria-hidden="true"
    />

    <!-- ゲームオーバー -->
    <Transition name="gameover">
      <div
        v-if="phase === 'gameOver'"
        class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
      >
        <p class="gameover-text">GAME OVER</p>
      </div>
    </Transition>

    <!-- 爆弾ウィジェット(右下固定)。プレビューでは小さく表示する -->
    <div class="absolute bottom-4 right-4 z-30" :class="{ 'origin-bottom-right scale-50': editorPreview }">
      <DeadAirBombWidget
        :phase="phase"
        :formatted-time="formattedTime"
        :is-warning="isWarning"
        :is-critical="isCritical"
        :current-lives="currentLives"
        :bonus-enabled="bonusEnabled"
        :bonus-fraction="bonusFraction"
        :optional-value="optionalValue"
        :optional-label="optionalLabel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { DeadAirPhase } from '../../composables/useDeadAirLogic'
  import DeadAirBombWidget from './parts/DeadAirBombWidget.vue'

  const props = withDefaults(
    defineProps<{
      obstacle: 'black' | 'white'
      phase: DeadAirPhase
      formattedTime: string
      isWarning: boolean
      isCritical: boolean
      currentLives: number
      bonusEnabled: boolean
      bonusFraction: number
      lifeFraction: number
      optionalValue: number | null
      optionalLabel: string
      editorPreview?: boolean
    }>(),
    { editorPreview: false }
  )

  const darknessOpacity = computed(() => (props.phase === 'gameOver' ? 1 : (1 - props.lifeFraction) * 0.72))
</script>

<style scoped>
  .gameover-text {
    font-family: 'Courier New', Courier, monospace;
    font-size: clamp(3rem, 10vw, 6rem);
    font-weight: 900;
    letter-spacing: 0.15em;
    color: #ef4444;
    text-shadow:
      0 0 20px rgba(239, 68, 68, 0.8),
      0 0 60px rgba(239, 68, 68, 0.4);
    animation: gameover-flicker 1.6s ease-in-out infinite alternate;
  }

  .gameover-enter-active {
    animation: gameover-enter 0.6s ease forwards;
  }

  @keyframes gameover-enter {
    from {
      opacity: 0;
      transform: scale(0.7);
      filter: blur(12px);
    }
    to {
      opacity: 1;
      transform: scale(1);
      filter: blur(0);
    }
  }

  @keyframes gameover-flicker {
    0%,
    80% {
      opacity: 1;
    }
    85% {
      opacity: 0.4;
    }
    90% {
      opacity: 1;
    }
    95% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
</style>
