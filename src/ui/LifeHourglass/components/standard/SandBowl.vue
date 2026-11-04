<!-- src/ui/LifeHourglass/components/standard/SandBowl.vue -->
<template>
  <!-- OBS に載せるため、円の背景を持つ。グローがはみ出す分の余白を p-6 で確保 -->
  <div class="flex pt-10 justify-center" :style="cssVars">
    <div class="lh-disc">
      <!-- 装飾: 輪(ゆっくり回る目盛り)・砂時計の透かし・落ちる砂 -->
      <svg class="lh-deco" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="96" class="lh-ring lh-ring-outer" />
        <circle cx="100" cy="100" r="91" class="lh-ring lh-ring-inner" />
        <g class="lh-spin">
          <circle cx="100" cy="100" r="85" class="lh-ring lh-ring-ticks" />
        </g>
        <g class="lh-hourglass">
          <path
            class="lh-glass"
            d="M66 40 L134 40 C134 78 112 92 104 100 C112 108 134 122 134 160 L66 160 C66 122 88 108 96 100 C88 92 66 78 66 40 Z"
          />
          <path class="lh-sand" d="M74 46 L126 46 C123 66 110 80 100 90 C90 80 77 66 74 46 Z" />
          <path class="lh-sand" d="M71 158 C84 144 95 136 100 136 C105 136 116 144 129 158 Z" />
          <line class="lh-stream" x1="100" y1="92" x2="100" y2="140" />
          <rect class="lh-cap" x="58" y="33" width="84" height="6" rx="3" />
          <rect class="lh-cap" x="58" y="161" width="84" height="6" rx="3" />
        </g>
      </svg>

      <!-- 舞う砂粒 -->
      <span
        v-for="(s, i) in SPARKLES"
        :key="i"
        class="lh-sparkle"
        :style="{
          left: `${s.left}%`,
          width: `${s.size}px`,
          height: `${s.size}px`,
          animationDelay: `${s.delay}s`,
          animationDuration: `${s.duration}s`,
        }"
      />

      <div class="lh-content">
        <!-- メイン: 累計の砂粒(カウントアップ演出) -->
        <div class="flex items-baseline whitespace-nowrap">
          <span
            class="lh-grains font-extrabold leading-none"
            :class="{ 'lh-grains-pop': grainsPop }"
            :style="{ fontSize: grainsFontSize }"
          >
            {{ grainsText }}
          </span>
        </div>

        <!-- 同接・ギフト合計・配信時間(配信時間は小さく) -->
        <div class="lh-stats flex items-baseline gap-3 whitespace-nowrap tabular-nums">
          <span class="text-sm font-bold">👥 {{ formatGrains(safe(viewer)) }}</span>
          <span class="text-sm font-bold">🎁 ¥{{ formatGrains(safe(giftTotal)) }}</span>
          <span class="text-xs opacity-70">⏱ {{ formatStreamTime(streamSeconds) }}</span>
        </div>

        <!-- サブ: 器のアイコン(大きい器から順に、最大 LIFE_HOURGLASS_MAX_BOWL_ICONS 個。超えた分は小さい器から省略) -->
        <div class="mt-1 flex flex-wrap items-center justify-center gap-1 text-base leading-none">
          <span
            v-for="entry in visibleBowls"
            :key="entry.key"
            :class="
              entry.label
                ? 'font-bold whitespace-nowrap'
                : [
                    'lh-bowl',
                    {
                      'lh-bowl-merged': mergedBowlId === entry.bowlId,
                      'lh-bowl-dropped': droppedBowlId === entry.bowlId,
                    },
                  ]
            "
          >
            {{ entry.icon }}<template v-if="entry.label"> {{ entry.label }}</template>
          </span>
          <span v-if="hasHiddenBowls" class="text-sm opacity-60">…</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, toRef, watch } from 'vue'
  import { CharacterColorScheme, type CharacterColorType } from '@/types/OmikujiData'
  import {
    LIFE_HOURGLASS_BOWLS,
    LIFE_HOURGLASS_DOME_COUNT_THRESHOLD,
    LIFE_HOURGLASS_MAX_BOWL_ICONS,
    computeBowls,
    formatGrains,
    formatStreamTime,
    type LifeHourglassBowlId,
  } from '../../composables/bowls'
  import { useAnimatedNumber } from '../../composables/useAnimatedNumber'

  const props = withDefaults(
    defineProps<{
      grains: number /** 表示する砂粒(通算 or 今回の配信ぶんは、呼び出し側で選ぶ) */
      color?: CharacterColorType /** 配色(name: 同接などの文字 / text: 数値 / background: 円の地 / accent: 輪・砂・光) */
      giftPulse?: number /** ギフトで砂粒が増えた回数(まとめて落ちる演出用) */
      viewer?: number /** 現在の同時接続数 */
      giftTotal?: number /** ギフト合計(円) */
      streamSeconds?: number /** 配信時間(秒) */
    }>(),
    { color: () => CharacterColorScheme.parse({}), giftPulse: 0, viewer: 0, giftTotal: 0, streamSeconds: 0 }
  )

  const safe = (n: number) => (Number.isFinite(n) ? n : 0)

  // --- 配色: CSS 変数に流して、スタイル側で使う ---
  const cssVars = computed(() => ({
    '--lh-bg': props.color.background,
    '--lh-text': props.color.text,
    '--lh-name': props.color.name,
    '--lh-accent': props.color.accent,
  }))

  // --- 舞う砂粒(位置・速さは固定。毎回同じ見た目にする) ---
  const SPARKLES = [
    { left: 18, delay: 0, duration: 7, size: 3 },
    { left: 30, delay: 2.5, duration: 9, size: 2 },
    { left: 44, delay: 4.5, duration: 8, size: 3 },
    { left: 50, delay: 6.5, duration: 8.5, size: 2 },
    { left: 56, delay: 1.2, duration: 10, size: 2 },
    { left: 68, delay: 5.5, duration: 7.5, size: 3 },
    { left: 80, delay: 3, duration: 9.5, size: 2 },
  ] as const

  const counts = computed(() => computeBowls(props.grains))

  // --- メインの数値: 増加分を滑らかにカウントアップ ---
  const animatedGrains = useAnimatedNumber(toRef(props, 'grains'), 1000)
  const grainsText = computed(() => formatGrains(animatedGrains.value))

  // 桁が増えても円からはみ出さないよう、文字数に応じて縮める(上限は 4.5rem)
  const grainsFontSize = computed(() => `min(4.5rem, ${(240 / Math.max(grainsText.value.length, 1)).toFixed(1)}cqw)`)

  // --- 器のアイコン: 大きい器から並べ、上限を超えた分(小さい器)は省略する ---
  type BowlEntry = { key: string; bowlId: LifeHourglassBowlId; icon: string; label?: string }

  const bowlEntries = computed<BowlEntry[]>(() => {
    const entries: BowlEntry[] = []
    for (const bowl of LIFE_HOURGLASS_BOWLS) {
      const count = counts.value[bowl.id]
      // 東京ドームが多いときは数字表記に切り替える(増え続けるのは東京ドームだけ)
      if (bowl.id === 'tokyoDome' && count >= LIFE_HOURGLASS_DOME_COUNT_THRESHOLD) {
        entries.push({ key: `${bowl.id}-summary`, bowlId: bowl.id, icon: bowl.icon, label: `× ${count}` })
        continue
      }
      for (let n = 1; n <= count; n++) entries.push({ key: `${bowl.id}-${n}`, bowlId: bowl.id, icon: bowl.icon })
    }
    return entries
  })
  const visibleBowls = computed(() => bowlEntries.value.slice(0, LIFE_HOURGLASS_MAX_BOWL_ICONS))
  const hasHiddenBowls = computed(() => bowlEntries.value.length > LIFE_HOURGLASS_MAX_BOWL_ICONS)

  // --- ギフトのとき、数値をぽんと弾ませる ---
  const grainsPop = ref(false)
  let popTimer: ReturnType<typeof setTimeout> | null = null
  const popGrains = () => {
    grainsPop.value = false
    // クラスを付け直してアニメーションを再生し直す
    requestAnimationFrame(() => {
      grainsPop.value = true
      if (popTimer) clearTimeout(popTimer)
      popTimer = setTimeout(() => {
        grainsPop.value = false
      }, 600)
    })
  }

  // --- 合体演出: 下の器の個数が減って上の器の個数が増えたら、増えた器を少し膨らませる ---
  const mergedBowlId = ref<LifeHourglassBowlId | null>(null)
  const droppedBowlId = ref<LifeHourglassBowlId | null>(null)
  let mergeTimer: ReturnType<typeof setTimeout> | null = null
  let dropTimer: ReturnType<typeof setTimeout> | null = null

  const flash = (id: LifeHourglassBowlId) => {
    mergedBowlId.value = id
    if (mergeTimer) clearTimeout(mergeTimer)
    mergeTimer = setTimeout(() => {
      mergedBowlId.value = null
    }, 700)
  }

  const flashDrop = (id: LifeHourglassBowlId) => {
    droppedBowlId.value = id
    if (dropTimer) clearTimeout(dropTimer)
    dropTimer = setTimeout(() => {
      droppedBowlId.value = null
    }, 700)
  }

  watch(counts, (now, before) => {
    const list = LIFE_HOURGLASS_BOWLS
    for (let i = 1; i < list.length; i++) {
      if (now[list[i].id] < before[list[i].id] && now[list[i - 1].id] > before[list[i - 1].id]) {
        flash(list[i - 1].id) // 繰り上がり先(上の器)を光らせる
        return
      }
    }
    // 合体でなければ、増えた最小の器を落ちる演出に(ギフトのときはまとめて落ちる)
    for (let i = list.length - 1; i >= 0; i--) {
      if (now[list[i].id] > before[list[i].id]) {
        flashDrop(list[i].id)
        return
      }
    }
  })

  // ギフトの加算タイミングで、増えた器へ落ちる演出と、数値のポップを出す
  watch(
    () => props.giftPulse,
    () => {
      popGrains()
      const list = LIFE_HOURGLASS_BOWLS
      const now = counts.value
      for (let i = list.length - 1; i >= 0; i--) {
        if (now[list[i].id] > 0) {
          flashDrop(list[i].id)
          return
        }
      }
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

  .lh-deco {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .lh-ring {
    fill: none;
    stroke: var(--lh-accent);
  }

  .lh-ring-outer {
    stroke-width: 1.6;
  }

  .lh-ring-inner {
    stroke-width: 0.5;
    opacity: 0.7;
  }

  .lh-ring-ticks {
    stroke-width: 3;
    stroke-dasharray: 1 6.1;
    opacity: 0.55;
  }

  .lh-spin {
    transform-box: view-box;
    transform-origin: center;
    animation: lh-spin 90s linear infinite;
  }

  /* 砂時計の透かし(文字の邪魔にならない濃さ) */
  .lh-hourglass {
    opacity: 0.3;
  }

  .lh-glass {
    fill: none;
    stroke: var(--lh-accent);
    stroke-width: 1.4;
  }

  .lh-sand {
    fill: var(--lh-accent);
    opacity: 0.55;
  }

  .lh-cap {
    fill: var(--lh-accent);
  }

  .lh-stream {
    stroke: var(--lh-accent);
    stroke-width: 1.2;
    stroke-dasharray: 2 5;
    animation: lh-stream 1.2s linear infinite;
  }

  /* 舞う砂粒: 上から下へ、ゆっくり落ちて消える */
  .lh-sparkle {
    position: absolute;
    top: 10%;
    border-radius: 9999px;
    background: var(--lh-accent);
    box-shadow: 0 0 6px var(--lh-accent);
    opacity: 0;
    pointer-events: none;
    animation: lh-fall linear infinite;
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

  .lh-stats {
    color: var(--lh-name);
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

  .lh-bowl {
    display: inline-block;
  }

  .lh-bowl-merged {
    animation: lh-merge 0.7s ease;
  }

  .lh-bowl-dropped {
    animation: lh-drop 0.7s ease;
  }

  @keyframes lh-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes lh-stream {
    to {
      stroke-dashoffset: -7;
    }
  }

  @keyframes lh-fall {
    0% {
      top: 10%;
      opacity: 0;
    }
    15% {
      opacity: 0.9;
    }
    85% {
      opacity: 0.7;
    }
    100% {
      top: 90%;
      opacity: 0;
    }
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

  @keyframes lh-merge {
    0% {
      transform: scale(0.4);
      opacity: 0;
    }
    60% {
      transform: scale(1.4);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes lh-drop {
    0% {
      transform: translateY(-8px);
      opacity: 0;
    }
    60% {
      transform: translateY(2px);
      opacity: 1;
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
