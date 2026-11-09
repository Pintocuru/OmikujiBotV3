<!-- src/ui/KujibikiPanel/components/fortune/BigBang.vue -->
<template>
  <div class="relative flex items-center justify-center">
    <div class="big-bang-card relative flex h-105 w-xs flex-col items-center gap-4 overflow-hidden rounded-xl p-6">
      <!-- 宇宙空間 -->
      <div class="space-stars pointer-events-none absolute inset-0" aria-hidden="true" />
      <div class="nebula nebula-one pointer-events-none absolute" aria-hidden="true" />
      <div class="nebula nebula-two pointer-events-none absolute" aria-hidden="true" />

      <!-- 地球を模したおみくじ箱 -->
      <div class="earth-scene pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div class="earth-orbit orbit-one absolute rounded-full" />
        <div class="earth-orbit orbit-two absolute rounded-full" />
        <div class="earth-glow absolute rounded-full" />
        <div class="earth relative overflow-hidden rounded-full">
          <div class="earth-land land-one absolute" />
          <div class="earth-land land-two absolute" />
          <div class="earth-land land-three absolute" />
          <div class="earth-shine absolute inset-0 rounded-full" />
        </div>
      </div>

      <!-- ヘッダー -->
      <div v-if="label" class="relative z-10 flex w-full items-center gap-2">
        <div class="h-px flex-1 bg-linear-to-r from-transparent to-cyan-200/80" />
        <span class="whitespace-nowrap font-serif text-lg tracking-[0.2em] text-cyan-100">{{ label }}</span>
        <div class="h-px flex-1 bg-linear-to-l from-transparent to-cyan-200/80" />
      </div>

      <!-- おみくじ結果 -->
      <div v-if="currentSlot0" class="result-plaque relative z-10 flex min-h-24 w-full items-center justify-center rounded-lg px-3 py-3">
        <span
          class="result-text relative block w-full text-center font-black tracking-wide"
          :style="{ fontSize: slot0FontSize }"
        >
          {{ currentSlot0 }}
        </span>
      </div>

      <!-- ユーザー名 -->
      <div v-if="currentName" class="relative z-10 flex items-center gap-1 text-cyan-50">
        <span class="text-lg font-semibold">{{ currentName }}</span>
        <span class="text-cyan-100/80">の地球規模の運勢</span>
      </div>

      <!-- メッセージ -->
      <div class="relative z-10 mt-auto w-full rounded-lg border border-cyan-100/20 bg-slate-950/65 p-3 backdrop-blur-sm">
        <p class="break-words text-center font-medium leading-relaxed tracking-wide text-white">
          {{ currentSlot1 }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { BotMessageBubbleType } from '@/types/generator'

  const props = defineProps<{
    messages: BotMessageBubbleType[]
    label: string
  }>()

  const current = computed(() => props.messages[0])
  const currentName = computed(() => current.value?.bubble?.name ?? null)
  const currentSlot0 = computed(() => current.value?.slots?.slot0 ?? null)
  const currentSlot1 = computed(() => current.value?.slots?.slot1 ?? null)

  // 短い結果は大きく、長い結果は最大3行に収まるよう段階的に縮小する
  const slot0FontSize = computed(() => {
    const length = [...(currentSlot0.value ?? '')].length
    if (length <= 4) return '2.25rem'
    if (length <= 8) return '1.75rem'
    if (length <= 14) return '1.25rem'
    return '0.9rem'
  })
</script>

<style scoped>
  .big-bang-card {
    isolation: isolate;
    background:
      radial-gradient(ellipse at 50% 42%, rgba(15, 91, 125, 0.3), transparent 55%),
      linear-gradient(160deg, #06172a 0%, #07101f 52%, #020611 100%);
    border: 1px solid rgba(125, 211, 252, 0.5);
    box-shadow:
      0 0 0 1px rgba(56, 189, 248, 0.12),
      0 0 38px rgba(14, 165, 233, 0.22),
      0 8px 32px rgba(0, 0, 0, 0.65),
      inset 0 1px 0 rgba(186, 230, 253, 0.15);
  }

  .space-stars {
    opacity: 0.7;
    background-image:
      radial-gradient(1px 1px at 12% 18%, #fff 99%, transparent),
      radial-gradient(1px 1px at 78% 13%, #bae6fd 99%, transparent),
      radial-gradient(2px 2px at 88% 39%, #fff 99%, transparent),
      radial-gradient(1px 1px at 24% 63%, #fff 99%, transparent),
      radial-gradient(1px 1px at 69% 76%, #bae6fd 99%, transparent),
      radial-gradient(2px 2px at 43% 31%, #fff 99%, transparent),
      radial-gradient(1px 1px at 9% 85%, #fff 99%, transparent);
  }

  .nebula {
    width: 15rem;
    height: 9rem;
    border-radius: 50%;
    filter: blur(35px);
    opacity: 0.2;
  }

  .nebula-one {
    top: 28%;
    left: -35%;
    background: #0ea5e9;
  }

  .nebula-two {
    top: 42%;
    right: -38%;
    background: #6366f1;
  }

  .earth-scene {
    z-index: 0;
    transform: translateY(-0.25rem);
    opacity: 0.72;
  }

  .earth {
    width: 13rem;
    height: 13rem;
    background:
      radial-gradient(ellipse at 35% 28%, rgba(186, 230, 253, 0.95), transparent 8%),
      radial-gradient(ellipse at 35% 35%, #38bdf8 0%, #0369a1 42%, #082f49 72%, #020617 100%);
    box-shadow:
      inset -1.2rem -0.8rem 2rem rgba(2, 6, 23, 0.9),
      inset 0.5rem 0.2rem 1rem rgba(186, 230, 253, 0.35),
      0 0 2rem rgba(56, 189, 248, 0.55);
  }

  .earth-land {
    background: linear-gradient(135deg, #86b879, #286b59 70%, #164e63);
    filter: drop-shadow(0 0 3px rgba(134, 239, 172, 0.3));
    opacity: 0.85;
  }

  .land-one {
    top: 18%;
    left: 24%;
    width: 34%;
    height: 27%;
    border-radius: 62% 38% 52% 48% / 42% 40% 60% 58%;
    transform: rotate(-24deg);
  }

  .land-two {
    top: 48%;
    left: 48%;
    width: 28%;
    height: 38%;
    border-radius: 38% 62% 44% 56% / 35% 45% 55% 65%;
    transform: rotate(18deg);
  }

  .land-three {
    top: 30%;
    left: 66%;
    width: 18%;
    height: 16%;
    border-radius: 55% 45% 60% 40%;
    transform: rotate(30deg);
  }

  .earth-shine {
    background: linear-gradient(115deg, rgba(255, 255, 255, 0.22), transparent 38%, transparent 70%, rgba(2, 6, 23, 0.45));
  }

  .earth-glow {
    width: 15rem;
    height: 15rem;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.25), transparent 68%);
    filter: blur(8px);
  }

  .earth-orbit {
    width: 16rem;
    height: 5rem;
    border: 1px solid rgba(186, 230, 253, 0.35);
    box-shadow: 0 0 10px rgba(56, 189, 248, 0.18);
  }

  .orbit-one {
    transform: rotate(-25deg);
  }

  .orbit-two {
    transform: rotate(55deg);
    opacity: 0.5;
  }

  .result-plaque {
    border: 1px solid rgba(186, 230, 253, 0.55);
    background: linear-gradient(145deg, rgba(8, 47, 73, 0.92), rgba(15, 23, 42, 0.96));
    box-shadow:
      0 0 20px rgba(14, 165, 233, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  .result-text {
    color: #e0f2fe;
    line-height: 1.2;
    overflow-wrap: anywhere;
    text-shadow: 0 0 10px rgba(56, 189, 248, 0.65);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
  }
</style>
