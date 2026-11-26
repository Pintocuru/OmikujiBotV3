<!-- src/console/game/WordAlchemy/components/WordAlchemyCodex.vue -->
<!-- 図鑑 (鍋ごとのタブ)。分類順 (行) × 色のパレット順 (列) に並べる。未発見は「？」、発見済みは DiceBear のアイコンと名前。
     ホバー (DaisyUI の tooltip) で、名前と素材元 (材料のことばと、出した視聴者) を見られる -->
<template>
  <div class="absolute inset-0 z-20 flex flex-col gap-3 bg-base-300/95 p-4 text-base-content">
    <div class="flex items-center gap-3">
      <h2 class="text-lg font-bold">{{ messages.title }}</h2>
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

    <div role="tablist" class="tabs tabs-box tabs-xs self-start">
      <button
        v-for="key in POT_KEYS"
        :key="key"
        role="tab"
        class="tab gap-1"
        :class="{ 'tab-active': key === activePot }"
        @click="activePot = key"
      >
        {{ potMap[key].label }}
        <span class="badge badge-neutral badge-xs">{{ messages.discovered(foundIn(key), total) }}</span>
      </button>
    </div>

    <div class="min-h-0 grow overflow-y-auto">
      <section v-for="(group, groupIndex) in groups" :key="group.category" class="mb-3">
        <h3 class="mb-1 text-sm opacity-70">{{ categoryLabel[group.category] }}</h3>
        <div class="grid grid-cols-8 gap-2">
          <div
            v-for="(item, col) in group.items"
            :key="item.id"
            class="tooltip"
            :class="tooltipPosition(groupIndex, col)"
          >
            <div v-if="entryOf(item.id)" class="tooltip-content max-w-56 whitespace-normal text-left">
              <p class="break-words font-bold">{{ entryOf(item.id)!.name }}</p>
              <p class="mt-1 text-[10px] opacity-70">{{ messages.materials }}</p>
              <ul class="text-xs">
                <li v-for="(material, i) in entryOf(item.id)!.materials" :key="i" class="break-words">
                  {{ material.text }}<span class="opacity-70"> — {{ material.userName }}</span>
                </li>
              </ul>
            </div>
            <div class="flex h-20 w-full flex-col items-center justify-center gap-1 rounded-lg bg-base-100/60 px-1">
              <template v-if="entryOf(item.id)">
                <img :src="iconOf(item, entryOf(item.id)!.name)" class="h-10 w-10 rounded" alt="" />
                <span class="w-full truncate text-center text-xs">{{ entryOf(item.id)!.name }}</span>
              </template>
              <CircleHelp v-else :size="28" class="opacity-40" />
            </div>
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
  import { itemList, type ItemDefinition } from '../maps/WordAlchemyItemMap'
  import { wordAlchemyMessages } from '../maps/WordAlchemyMessageMap'
  import { POT_KEYS, potMap, type PotKey } from '../maps/WordAlchemyPotMap'
  import { getEntry, type Codex } from '../scripts/codex'
  import { itemIconUrl } from '../scripts/itemIcon'

  const props = defineProps<{
    codex: Codex
    /** 最初に開く鍋のタブ (いま選んでいる鍋) */
    pot: PotKey
    /** その鍋で発見した数 (分母は total) */
    foundIn: (pot: PotKey) => number
    total: number
    offline: boolean
    discarded: boolean
  }>()
  const emit = defineEmits<{ close: []; reset: [] }>()

  const messages = wordAlchemyMessages.codex
  const categoryLabel = wordAlchemyMessages.category

  const activePot = ref<PotKey>(props.pot)

  /** 分類ごとにまとめる (itemList の並びが、そのまま分類順 → 色順) */
  const groups = computed(() =>
    ALCHEMY_CATEGORIES.map((category) => ({ category, items: itemList.filter((item) => item.category === category) }))
  )

  const entryOf = (itemId: string) => getEntry(props.codex, activePot.value, itemId)
  const iconOf = (item: ItemDefinition, name: string) => itemIconUrl(item.category, item.color, name)

  /**
   * tooltip の出す向き。スクロールする一覧の端で切れないように、左右の端の列は横へ、上の 2 分類は下へ、それ以外は上へ出す
   * (列は 8 色ぶん)
   */
  const tooltipPosition = (groupIndex: number, col: number) => {
    if (col === 0) return 'tooltip-right'
    if (col === groups.value[groupIndex].items.length - 1) return 'tooltip-left'
    return groupIndex < 2 ? 'tooltip-bottom' : 'tooltip-top'
  }

  const confirming = ref(false)
  const onReset = () => {
    confirming.value = false
    emit('reset')
  }
</script>
