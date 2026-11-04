<!-- src/ui/LifeHourglass/components/standard/SandBowl.vue -->
<template>
  <div class="flex flex-col items-end gap-1 select-none">
    <!-- 器のアイコン(大きい器から順に取る) -->
    <div class="flex flex-wrap items-center justify-end gap-1 text-2xl leading-none">
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

    <!-- 累計の砂粒(端数が見えなくなるため、隅に小さく表示) -->
    <div class="text-xs opacity-80 whitespace-nowrap">{{ formatGrains(grains) }} 粒</div>

    <!-- 世界観のメッセージ(showMessage が true のときだけ) -->
    <div v-if="showMessage" class="text-xs opacity-70 text-right leading-tight whitespace-nowrap">
      本日集めた人生 {{ formatGrains(grains) }}粒<br />
      視聴者があなたへ託した時間 {{ formatTrustedTime(grains) }}<br />
      今日も誰かの命の砂時計が ここへ注がれています
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import {
    LIFE_HOURGLASS_BOWLS,
    LIFE_HOURGLASS_DOME_COUNT_THRESHOLD,
    computeBowls,
    formatGrains,
    formatTrustedTime,
    type LifeHourglassBowlId,
  } from '../../composables/bowls'

  const props = withDefaults(
    defineProps<{
      /** 表示する砂粒(通算 or 今回の配信ぶんは、呼び出し側で選ぶ) */
      grains: number
      /** 画面の隅の小さなメッセージを出すか */
      showMessage?: boolean
      /** ギフトで砂粒が増えた回数(まとめて落ちる演出用) */
      giftPulse?: number
    }>(),
    { showMessage: true, giftPulse: 0 }
  )

  const counts = computed(() => computeBowls(props.grains))

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

  // ギフトの加算タイミングで、増えた器へ落ちる演出を出す
  watch(
    () => props.giftPulse,
    () => {
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
  .lh-bowl {
    display: inline-block;
  }

  .lh-bowl-merged {
    animation: lh-merge 0.7s ease;
  }

  .lh-bowl-dropped {
    animation: lh-drop 0.7s ease;
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
