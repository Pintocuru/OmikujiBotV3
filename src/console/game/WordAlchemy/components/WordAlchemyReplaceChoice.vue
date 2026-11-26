<!-- src/console/game/WordAlchemy/components/WordAlchemyReplaceChoice.vue -->
<!-- すでに図鑑にある枠へ、また同じアイテムが出たときの、新旧の選択。盤面の上に出す (盤面は止まらない)。
     選ばずに閉じる (×・Esc) と、古いほうが残る。煮込みの確認 (盤面の下) が出ているときは、Esc は確認が使うので受けない -->
<template>
  <div class="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center">
    <div
      class="pointer-events-auto flex flex-col items-center gap-2 rounded-xl border-2 border-sky-300 bg-black/85 px-4 py-3"
    >
      <div class="flex w-full items-center gap-2">
        <p class="grow text-sm font-bold text-sky-200">{{ messages.title }}</p>
        <button
          class="btn btn-ghost btn-square btn-xs"
          :aria-label="messages.close"
          :title="messages.close"
          @click="emit('answer', false)"
        >
          <X :size="14" />
        </button>
      </div>
      <div class="flex gap-3">
        <section
          v-for="card in cards"
          :key="card.label"
          class="flex w-56 flex-col items-center gap-1 rounded-lg bg-base-100/20 p-2 text-neutral-content"
        >
          <span class="text-xs opacity-70">{{ card.label }}</span>
          <img :src="card.icon" class="h-12 w-12 rounded" alt="" />
          <span class="w-full break-words text-center text-sm font-bold">{{ card.entry.name }}</span>
          <ul class="w-full text-xs opacity-80">
            <li v-for="(material, i) in card.entry.materials" :key="i" class="truncate">
              {{ material.text }}<span class="opacity-70"> — {{ material.userName }}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="flex gap-3">
        <button class="btn btn-ghost btn-sm" @click="emit('answer', false)">{{ messages.keepOld }}</button>
        <button class="btn btn-primary btn-sm" @click="emit('answer', true)">{{ messages.useNew }}</button>
      </div>
      <p class="text-[10px] opacity-60">{{ messages.hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { X } from '@lucide/vue'
  import { computed, onBeforeUnmount, onMounted } from 'vue'
  import { wordAlchemyMessages } from '../maps/WordAlchemyMessageMap'
  import { itemIconUrl } from '../scripts/itemIcon'
  import type { ReplaceChoice } from '../composables/useWordAlchemy'

  const props = defineProps<{
    choice: ReplaceChoice
    /** Esc で閉じてよいか (煮込みの確認が出ているときは false。Esc は確認の「やめる」になる) */
    escEnabled: boolean
  }>()
  const emit = defineEmits<{ answer: [useNew: boolean] }>()

  const messages = wordAlchemyMessages.replace

  const cards = computed(() => [
    {
      label: messages.old,
      entry: props.choice.old,
      icon: itemIconUrl(props.choice.category, props.choice.color, props.choice.old.name),
    },
    {
      label: messages.next,
      entry: props.choice.next,
      icon: itemIconUrl(props.choice.category, props.choice.color, props.choice.next.name),
    },
  ])

  const isTyping = (target: EventTarget | null) =>
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !props.escEnabled || isTyping(event.target)) return
    emit('answer', false)
  }
  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>
