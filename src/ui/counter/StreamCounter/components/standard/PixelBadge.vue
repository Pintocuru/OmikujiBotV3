<!-- src/ui/StreamCounter/components/standard/PixelBadge.vue -->
<template>
  <!-- 並べ方: 横並び(折り返しあり) -->
  <div class="flex flex-wrap justify-center gap-4 py-2">
    <div
      v-for="(key, index) in keys"
      :key="key"
      class="relative w-32 h-28 flex items-center justify-center overflow-hidden border-4 border-current shadow-xl transition duration-150 pixel-badge"
      :style="{
        color: pickCounterColor(colors, index).accent,
        backgroundColor: pickCounterColor(colors, index).background,
        animationDelay: `${index * 0.08}s`,
      }"
    >
      <!-- corner -->
      <span class="absolute -top-px -left-px w-8 h-8 border-t-6 border-l-6 border-current" />
      <span class="absolute -top-px -right-px w-8 h-8 border-t-6 border-r-6 border-current" />
      <span class="absolute -bottom-px -left-px w-8 h-8 border-b-6 border-l-6 border-current" />
      <span class="absolute -bottom-px -right-px w-8 h-8 border-b-6 border-r-6 border-current" />

      <!-- content -->
      <div class="relative flex flex-col items-center justify-center">
        <!-- アイコン -->
        <div :style="{ color: pickCounterColor(colors, index).name }">
          <LabelText :label="getLabel(key)" />
        </div>

        <!-- 数値 -->
        <div class="flex items-baseline justify-center whitespace-nowrap">
          <TransitionGroup
            name="seven-seg"
            tag="span"
            class="inline-flex"
            enter-active-class="transition-all duration-100"
            enter-from-class="opacity-0 scale-250"
            leave-to-class="opacity-0 scale-30"
            leave-active-class="absolute"
          >
            <span
              :key="formatCounterValue(counters[key] ?? 0)"
              class="text-4xl font-bold transition-all duration-300"
              :style="{ color: pickCounterColor(colors, index).text }"
            >
              {{ formatCounterValue(counters[key] ?? 0) }}
            </span>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, toRef } from 'vue'
  import type { CharacterColorType } from '@/types/OmikujiData/'
  import LabelText from '../../parts/LabelText.vue'
  import { formatCounterValue, pickCounterColor } from '../../composables/useStreamCounterDisplay'
  import { useLabelResolver } from '../../composables/useLiverLabelResolver'

  const props = defineProps<{
    keys: string[]
    counters: Record<string, number>
    variableLabels: Record<string, string>
    colors: CharacterColorType[]
  }>()

  // ラベルはアイコン表示
  const { getLabel } = useLabelResolver(toRef(props, 'variableLabels'), ref('lucide'))
</script>

<style scoped>
  .pixel-badge {
    animation: badgeDrop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes badgeDrop {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
