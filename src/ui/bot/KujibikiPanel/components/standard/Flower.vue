<!-- src/ui/KujibikiPanel/components/standard/Flower.vue -->
<template>
  <div class="relative flex items-center justify-center">
    <!-- レターカード -->
    <div class="relative w-xs bg-white rounded-lg shadow-lg border border-[#e8d5c4] overflow-hidden">
      <!-- コンテンツ -->
      <div class="relative p-4 flex flex-col gap-4">
        <!-- タイトル -->
        <div v-if="label" class="flex items-center gap-2 border-b border-[#e8d5c4] pb-3">
          <span class="font-serif text-xl font-medium text-[#8b6b55] tracking-wide">{{ label }}</span>
        </div>

        <!-- 運勢タイトル（slot0） -->
        <div v-if="currentSlot0" class="text-center py-1">
          <span class="font-serif text-4xl font-bold text-[#5d3a28]">
            {{ currentSlot0 }}
          </span>
        </div>

        <!-- メインメッセージ -->
        <div class="flex items-center justify-center">
          <p class="text-lg leading-relaxed text-[#4a3525] text-center wrap-break-word">
            {{ currentSlot1 || '--' }}
          </p>
        </div>

        <!-- サブ(slot2: 見出し / slot3: 本文) -->
        <div
          v-if="currentSlot2 || currentSlot3"
          class="flex flex-col items-center gap-1 border-t border-dashed border-[#e8d5c4] pt-3"
        >
          <span v-if="currentSlot2" class="font-serif text-xl font-medium tracking-wide text-[#8b6b55]">
            {{ currentSlot2 }}
          </span>
          <p v-if="currentSlot3" class="text-base leading-relaxed text-[#4a3525] text-center wrap-break-word">
            {{ currentSlot3 }}
          </p>
        </div>

        <!-- ユーザー名 -->
        <div v-if="currentName" class="text-right border-t border-dashed border-[#e8d5c4] pt-2">
          <span class="text-[#8b6b55]">{{ currentName }} 様</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessageBubbleType } from '@/types/generator'

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
