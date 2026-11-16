<!-- src/ui/KujibikiPanel/components/fortune/BigBang.vue -->
<template>
  <div class="relative flex items-center justify-center">
    <div class="big-bang-card relative flex min-h-105 w-xs flex-col items-center gap-4 overflow-hidden rounded-xl p-6">
      <BigBangSpace />
      <BigBangEarth />

      <!-- ヘッダー -->
      <div v-if="label" class="relative z-10 flex w-full items-center gap-2">
        <div class="h-px flex-1 bg-linear-to-r from-transparent to-cyan-200/80" />
        <span class="whitespace-nowrap font-serif text-lg tracking-[0.2em] text-cyan-100">{{ label }}</span>
        <div class="h-px flex-1 bg-linear-to-l from-transparent to-cyan-200/80" />
      </div>

      <BigBangResult v-if="currentSlot0" :text="currentSlot0 as string" />
      <BigBangUserName v-if="currentName" :name="currentName" />

      <!-- サブ(slot2: 見出し / slot3: 本文) -->
      <div
        v-if="currentSlot2 || currentSlot3"
        class="relative z-10 flex w-full flex-col items-center gap-1 border-t border-cyan-100/25 pt-3"
      >
        <span v-if="currentSlot2" class="whitespace-nowrap font-serif text-lg tracking-[0.2em] text-cyan-100">
          {{ currentSlot2 }}
        </span>
        <p v-if="currentSlot3" class="wrap-break-word text-lg text-center leading-relaxed text-white/90">
          {{ currentSlot3 }}
        </p>
      </div>

      <!-- メッセージ -->
      <div
        class="relative z-10 mt-auto w-full rounded-lg border border-cyan-100/20 bg-slate-950/65 p-3 backdrop-blur-sm"
      >
        <p class="wrap-break-word text-2xl text-center font-medium leading-relaxed tracking-wide text-white">
          {{ currentSlot1 }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { BotMessageBubbleType } from '@/types/generator'
  import BigBangSpace from './BigBangSpace.vue'
  import BigBangEarth from './BigBangEarth.vue'
  import BigBangResult from './BigBangResult.vue'
  import BigBangUserName from './BigBangUserName.vue'

  const props = defineProps<{
    messages: BotMessageBubbleType[]
    label: string
  }>()

  const current = computed(() => props.messages[0])
  const currentName = computed(() => current.value?.user?.userName ?? null)
  const currentSlot0 = computed(() => current.value?.slots?.slot0 ?? null)
  const currentSlot1 = computed(() => current.value?.slots?.slot1 ?? null)
  const currentSlot2 = computed(() => current.value?.slots?.slot2 ?? null)
  const currentSlot3 = computed(() => current.value?.slots?.slot3 ?? null)
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
</style>
