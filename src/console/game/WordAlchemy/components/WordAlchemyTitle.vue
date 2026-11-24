<!-- src/console/game/WordAlchemy/components/WordAlchemyTitle.vue -->
<!-- タイトル。盤面に重ねて表示し、スタートで消える -->
<template>
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/70 text-center">
    <h1 class="text-4xl font-bold text-amber-200">{{ wordAlchemyMessages.title }}</h1>
    <p class="text-sm opacity-80">{{ wordAlchemyMessages.hint }}</p>
    <label class="flex items-center gap-2 text-sm">
      {{ wordAlchemyMessages.pot }}
      <select v-model="potType" class="select select-bordered select-sm text-base-content">
        <option v-for="key in POT_KEYS" :key="key" :value="key">{{ potMap[key].label }}</option>
      </select>
    </label>
    <div class="flex gap-3">
      <button class="btn btn-primary" @click="emit('start', 'live')">{{ wordAlchemyMessages.startLive }}</button>
      <button class="btn btn-ghost" @click="emit('start', 'auto')">{{ wordAlchemyMessages.startAuto }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { wordAlchemyMessages } from '../maps/WordAlchemyMessageMap'
  import { POT_KEYS, potMap, type PotKey } from '../maps/WordAlchemyPotMap'
  import type { CommentSource } from '../composables/useWordAlchemy'

  const potType = defineModel<PotKey>('potType', { required: true })
  const emit = defineEmits<{ start: [source: CommentSource] }>()
</script>
