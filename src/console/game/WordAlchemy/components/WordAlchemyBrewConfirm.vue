<!-- src/console/game/WordAlchemy/components/WordAlchemyBrewConfirm.vue -->
<!-- 煮込みの確認。材料が揃ったら、盤面の下に出す (盤面は止まらない)。Enter / Esc でも答えられる (キーは盤面が受ける) -->
<template>
  <div class="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center">
    <div
      class="pointer-events-auto flex flex-col items-center gap-2 rounded-xl border-2 border-amber-300 bg-black/85 px-4 py-3"
    >
      <p class="text-sm font-bold text-amber-200">{{ wordAlchemyMessages.confirm.question }}</p>
      <ul class="flex flex-wrap justify-center gap-2">
        <li
          v-for="(material, i) in materials"
          :key="i"
          class="rounded bg-white px-2 py-1 text-base font-bold text-neutral"
        >
          {{ material.text }}
        </li>
      </ul>
      <div class="flex gap-3">
        <button class="btn btn-primary btn-sm" @click="emit('answer', true)">
          {{ wordAlchemyMessages.confirm.yes }}
          <kbd class="kbd kbd-xs text-base-content">{{ wordAlchemyMessages.confirm.yesKey }}</kbd>
        </button>
        <button class="btn btn-ghost btn-sm" @click="emit('answer', false)">
          {{ wordAlchemyMessages.confirm.no }}
          <kbd class="kbd kbd-xs text-base-content">{{ wordAlchemyMessages.confirm.noKey }}</kbd>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { wordAlchemyMessages } from '../maps/WordAlchemyMessageMap'
  import type { BrewMaterial } from '../render/WordAlchemyStage'

  defineProps<{ materials: readonly BrewMaterial[] }>()
  const emit = defineEmits<{ answer: [yes: boolean] }>()
</script>
