<!-- src/console/game/WordAlchemy/components/WordAlchemyCodex.vue -->
<!-- 図鑑。分類順 (行) × 色のパレット順 (列) に並べる。未発見は「？」、発見済みは画像 (なければ色の四角) と、直近の名前 -->
<template>
  <div class="absolute inset-0 z-20 flex flex-col gap-3 bg-base-300/95 p-4 text-base-content">
    <div class="flex items-center gap-3">
      <h2 class="text-lg font-bold">{{ messages.title }}</h2>
      <span class="badge badge-neutral">{{ messages.discovered(found, total) }}</span>
      <span v-if="offline" class="badge badge-warning badge-sm">{{ messages.offline }}</span>
      <span v-if="discarded" class="badge badge-info badge-sm">{{ messages.discarded }}</span>
      <div class="ml-auto flex items-center gap-2">
        <template v-if="confirming">
          <span class="text-xs text-error">{{ messages.resetConfirm }}</span>
          <button class="btn btn-error btn-xs" @click="onReset">{{ messages.resetDo }}</button>
          <button class="btn btn-ghost btn-xs" @click="confirming = false">{{ messages.resetCancel }}</button>
        </template>
        <button v-else class="btn btn-ghost btn-xs text-error" @click="confirming = true">{{ messages.reset }}</button>
        <button class="btn btn-ghost btn-square btn-sm" :aria-label="messages.close" @click="emit('close')">
          <X :size="18" />
        </button>
      </div>
    </div>

    <div class="min-h-0 grow overflow-y-auto">
      <section v-for="group in groups" :key="group.category" class="mb-3">
        <h3 class="mb-1 text-sm opacity-70">{{ categoryLabel[group.category] }}</h3>
        <div class="grid grid-cols-8 gap-2">
          <div
            v-for="item in group.items"
            :key="item.id"
            class="flex h-20 flex-col items-center justify-center gap-1 rounded-lg bg-base-100/60 px-1"
            :title="titleOf(item)"
          >
            <template v-if="codex.entries[item.id]">
              <img v-if="item.image" :src="`images/WordAlchemy/items/${item.image}`" class="h-8 w-8 [image-rendering:pixelated]" alt="" />
              <div v-else class="h-8 w-8 rounded border border-white/20" :style="{ backgroundColor: colorCssMap[item.color] }" />
              <span class="w-full truncate text-center text-xs">{{ latestName(item.id) }}</span>
              <span class="text-[10px] opacity-60">{{ messages.finds(countFinds(codex, item.id)) }}</span>
            </template>
            <CircleHelp v-else :size="28" class="opacity-40" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CircleHelp, X } from '@lucide/vue'
  import { computed, ref } from 'vue'
  import { ALCHEMY_CATEGORIES } from '../ai/alchemyTypes'
  import { colorCssMap } from '../maps/WordAlchemyColorMap'
  import { itemList, type ItemDefinition } from '../maps/WordAlchemyItemMap'
  import { wordAlchemyMessages } from '../maps/WordAlchemyMessageMap'
  import { countFinds, type Codex } from '../scripts/codex'

  const props = defineProps<{ codex: Codex; found: number; total: number; offline: boolean; discarded: boolean }>()
  const emit = defineEmits<{ close: []; reset: [] }>()

  const messages = wordAlchemyMessages.codex
  const categoryLabel = wordAlchemyMessages.category

  /** 分類ごとにまとめる (itemList の並びが、そのまま分類順 → 色順) */
  const groups = computed(() =>
    ALCHEMY_CATEGORIES.map((category) => ({ category, items: itemList.filter((item) => item.category === category) }))
  )

  const confirming = ref(false)
  const onReset = () => {
    confirming.value = false
    emit('reset')
  }

  const latestName = (id: string) => {
    const names = props.codex.entries[id]?.names ?? []
    return names[names.length - 1] ?? ''
  }
  /** ホバーで、初回の名前と直近の名前の履歴を見られる */
  const titleOf = (item: ItemDefinition) => {
    const entry = props.codex.entries[item.id]
    return entry ? `${messages.firstName}: ${entry.firstName} / ${messages.recent}: ${entry.names.join('、')}` : ''
  }
</script>
