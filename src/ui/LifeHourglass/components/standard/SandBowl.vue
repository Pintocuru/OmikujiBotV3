<!-- src/ui/LifeHourglass/components/standard/SandBowl.vue -->
<template>
  <div class="flex flex-col items-center gap-1 select-none">
    <!-- メイン: 累計の砂粒(カウントアップ演出) -->
    <div class="flex items-baseline gap-1 whitespace-nowrap">
      <span class="lh-grains text-7xl font-extrabold leading-none" :class="{ 'lh-grains-pop': grainsPop }">
        {{ formatGrains(animatedGrains) }}
      </span>
    </div>

    <!-- 同接・ギフト合計・配信時間(配信時間は小さく) -->
    <div class="flex items-baseline gap-3 whitespace-nowrap tabular-nums">
      <span class="text-sm font-bold">👥 {{ formatGrains(safe(viewer)) }}</span>
      <span class="text-sm font-bold">🎁 ¥{{ formatGrains(safe(giftTotal)) }}</span>
      <span class="text-xs opacity-70">⏱ {{ formatStreamTime(streamSeconds) }}</span>
    </div>

    <!-- サブ: 器のアイコン(大きい器から順に取る) -->
    <div class="flex flex-wrap items-center justify-end gap-1 text-xl leading-none">
      <template v-for="bowl in LIFE_HOURGLASS_BOWLS" :key="bowl.id">
        <!-- 東京ドームが多いときは数字表記に切り替える(増え続けるのは東京ドームだけ) -->
        <span
          v-if="bowl.id === 'tokyoDome' && counts.tokyoDome >= LIFE_HOURGLASS_DOME_COUNT_THRESHOLD"
          class="font-bold whitespace-nowrap"
        >
          🏟️ × {{ counts.tokyoDome }}
        </span>
        <template v-else>
          <span
            v-for="n in counts[bowl.id]"
            :key="`${bowl.id}-${n}`"
            class="lh-bowl"
            :class="{ 'lh-bowl-merged': mergedBowlId === bowl.id, 'lh-bowl-dropped': droppedBowlId === bowl.id }"
          >
            {{ bowl.icon }}
          </span>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, toRef, watch } from 'vue'
  import {
    LIFE_HOURGLASS_BOWLS,
    LIFE_HOURGLASS_DOME_COUNT_THRESHOLD,
    computeBowls,
    formatGrains,
    formatStreamTime,
    type LifeHourglassBowlId,
  } from '../../composables/bowls'
  import { useAnimatedNumber } from '../../composables/useAnimatedNumber'

  const props = withDefaults(
    defineProps<{
      /** 表示する砂粒(通算 or 今回の配信ぶんは、呼び出し側で選ぶ) */
      grains: number
      /** 画面の隅の小さなメッセージを出すか */
      showMessage?: boolean
      /** ギフトで砂粒が増えた回数(まとめて落ちる演出用) */
      giftPulse?: number
      /** 現在の同時接続数 */
      viewer?: number
      /** ギフト合計(円) */
      giftTotal?: number
      /** 配信時間(秒) */
      streamSeconds?: number
    }>(),
    { showMessage: true, giftPulse: 0, viewer: 0, giftTotal: 0, streamSeconds: 0 }
  )

  const safe = (n: number) => (Number.isFinite(n) ? n : 0)

  const counts = computed(() => computeBowls(props.grains))

  // --- メインの数値: 増加分を滑らかにカウントアップ ---
  const animatedGrains = useAnimatedNumber(toRef(props, 'grains'), 1000)

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
  .lh-grains {
    display: inline-block;
    font-variant-numeric: tabular-nums;
    transform-origin: right bottom;
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

  @keyframes lh-grains-pop {
    0% {
      transform: scale(1);
    }
    30% {
      transform: scale(1.18);
      text-shadow: 0 0 12px rgba(255, 215, 0, 0.9);
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
