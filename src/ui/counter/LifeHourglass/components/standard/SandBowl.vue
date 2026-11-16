<!-- src/ui/LifeHourglass/components/standard/SandBowl.vue -->
<template>
  <!-- OBS に載せるため、円の背景を持つ -->
  <div class="flex pt-10 justify-center" :style="cssVars">
    <div class="lh-disc">
      <SandBowlDeco />
      <SandParticles :intensity="intensity" />

      <div class="lh-content">
        <!-- メイン: 累計の砂粒(カウントアップ演出) -->
        <div class="flex items-baseline whitespace-nowrap">
          <span
            class="lh-grains font-extrabold leading-none"
            :class="{ 'lh-grains-pop': pop.active.value }"
            :style="{ fontSize: grainsFontSize }"
          >
            {{ grainsText }}
          </span>
        </div>

        <SandBowlStats :viewer="viewer" :gift-total="giftTotal" :stream-seconds="streamSeconds" />

        <SandBowlIcons
          :bowls="visibleBowls"
          :has-hidden="hasHiddenBowls"
          :merged-bowl-id="mergedBowlId"
          :dropped-bowl-id="droppedBowlId"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, toRef, watch } from 'vue'
  import { CharacterColorSchema, type CharacterColorType } from '@/types/OmikujiData'
  import { computeBowls, formatGrains } from '../../composables/bowls'
  import { useAnimatedNumber } from '../../composables/useAnimatedNumber'
  import { useBowlEffects } from '../../composables/useBowlEffects'
  import { useBowlEntries } from '../../composables/useBowlEntries'
  import { usePop } from '../../composables/usePop'
  import { useViewerIntensity } from '../../composables/useViewerIntensity'
  import SandBowlDeco from './parts/SandBowlDeco.vue'
  import SandBowlIcons from './parts/SandBowlIcons.vue'
  import SandBowlStats from './parts/SandBowlStats.vue'
  import SandParticles from './parts/SandParticles.vue'

  const props = withDefaults(
    defineProps<{
      grains: number /** 表示する砂粒(通算 or 今回の配信ぶんは、呼び出し側で選ぶ) */
      color?: CharacterColorType /** 配色(name: 同接などの文字 / text: 数値 / background: 円の地 / accent: 輪・砂・光) */
      giftPulse?: number /** ギフトで砂粒が増えた回数(まとめて落ちる演出用) */
      viewer?: number /** 現在の同時接続数 */
      giftTotal?: number /** ギフト合計(円) */
      streamSeconds?: number /** 配信時間(秒) */
    }>(),
    { color: () => CharacterColorSchema.parse({}), giftPulse: 0, viewer: 0, giftTotal: 0, streamSeconds: 0 }
  )

  // --- 配色: CSS 変数に流して、子コンポーネントのスタイルでも使う ---
  const cssVars = computed(() => ({
    '--lh-bg': props.color.background,
    '--lh-text': props.color.text,
    '--lh-name': props.color.name,
    '--lh-accent': props.color.accent,
  }))

  // --- 数値のポップ: ギフト時、および同接が 5 秒前の記録を上回ったとき ---
  const pop = usePop()

  // --- 同接の強弱(砂粒の量・砂の流れ) ---
  const { intensity } = useViewerIntensity(toRef(props, 'viewer'), pop.trigger)

  // --- メインの数値: 増加分を滑らかにカウントアップ ---
  const animatedGrains = useAnimatedNumber(toRef(props, 'grains'), 1000)
  const grainsText = computed(() => formatGrains(animatedGrains.value))
  // 桁が増えても円からはみ出さないよう、文字数に応じて縮める(上限は 4.5rem)
  const grainsFontSize = computed(() => `min(4.5rem, ${(200 / Math.max(grainsText.value.length, 1)).toFixed(1)}cqw)`)

  // --- 器 ---
  const counts = computed(() => computeBowls(props.grains))
  const { visibleBowls, hasHiddenBowls } = useBowlEntries(counts)
  const { mergedBowlId, droppedBowlId, dropToSmallest } = useBowlEffects(counts)

  // ギフトの加算タイミングで、器へ落ちる演出と、数値のポップを出す
  watch(
    () => props.giftPulse,
    () => {
      pop.trigger()
      dropToSmallest()
    }
  )
</script>

<style scoped>
  /* ---- 円の背景 ---- */
  .lh-disc {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16rem;
    aspect-ratio: 1;
    border-radius: 9999px;
    overflow: hidden;
    color: var(--lh-text);
    background: radial-gradient(
      circle at 50% 38%,
      var(--lh-bg) 0%,
      var(--lh-bg) 45%,
      color-mix(in srgb, var(--lh-bg) 70%, var(--lh-accent)) 100%
    );
    box-shadow:
      0 0 24px color-mix(in srgb, var(--lh-accent) 55%, transparent),
      inset 0 0 36px color-mix(in srgb, var(--lh-accent) 28%, transparent);
  }

  /* ---- 中身 ---- */
  .lh-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    width: 72%;
    container-type: inline-size; /* 数値の文字サイズを cqw で円に合わせる */
  }

  .lh-grains {
    display: inline-block;
    font-variant-numeric: tabular-nums;
    transform-origin: center bottom;
    text-shadow: 0 0 10px color-mix(in srgb, var(--lh-accent) 45%, transparent);
  }

  .lh-grains-pop {
    animation: lh-grains-pop 0.6s ease;
  }

  @keyframes lh-grains-pop {
    0% {
      transform: scale(1);
    }
    30% {
      transform: scale(1.18);
      text-shadow: 0 0 14px var(--lh-accent);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
