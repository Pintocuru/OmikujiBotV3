<!-- src/ui/LifeHourglass/components/standard/parts/SandBowlIcons.vue -->
<template>
  <!-- サブ: 器のアイコン(大きい器から順。超えた分は小さい器から省略) -->
  <div class="lh-bowls mt-1 flex flex-nowrap items-center justify-center leading-none">
    <span
      v-for="entry in bowls"
      :key="entry.key"
      :class="
        entry.label
          ? 'lh-bowl-label font-bold whitespace-nowrap'
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
  </div>
</template>

<script setup lang="ts">
  import type { LifeHourglassBowlId } from '../../../composables/bowls'
  import type { BowlEntry } from '../../../composables/useBowlEntries'

  defineProps<{
    bowls: BowlEntry[]
    hasHidden: boolean
    mergedBowlId: LifeHourglassBowlId | null
    droppedBowlId: LifeHourglassBowlId | null
  }>()
</script>

<style scoped>
  /* 1 行に収めるため、アイコンは負のマージンで重ねる(後ろのアイコンが手前) */
  .lh-bowls {
    font-size: 1.8rem;
  }

  .lh-bowl {
    display: inline-block;
    position: relative;
    flex-shrink: 0;
  }

  .lh-bowl + .lh-bowl {
    margin-left: -0.8em;
  }

  .lh-bowl-label {
    margin-left: 0.4rem;
    font-size: 1rem;
  }

  .lh-bowl-more {
    flex-shrink: 0;
    margin-left: 0.2rem;
  }

  .lh-bowl-merged {
    z-index: 2;
    animation: lh-merge 0.7s ease;
  }

  .lh-bowl-dropped {
    z-index: 2;
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
