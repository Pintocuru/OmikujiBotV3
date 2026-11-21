<!-- src/console/game/NuisanceSurvival/components/NuisanceMenu.vue -->
<!-- メニュー: タイトル・操作の説明・コンフィグ・スタート。上部バーのクリックで開く -->
<template>
  <div class="absolute inset-0 flex items-center justify-center bg-black/55 p-4" @click.self="emit('close')">
    <div class="rounded-box max-h-full w-full max-w-md overflow-y-auto bg-base-100 p-6 text-base-content shadow-2xl">
      <h2 class="text-center text-2xl font-black">{{ nuisanceSurvivalMessages.title }}</h2>
      <p class="mt-3 text-sm opacity-80">{{ nuisanceSurvivalMessages.menu.description }}</p>
      <p class="mt-2 text-xs opacity-60">{{ nuisanceSurvivalMessages.menu.howTo }}</p>

      <p v-if="!online" class="alert alert-warning mt-3 py-2 text-xs">{{ nuisanceSurvivalMessages.menu.offline }}</p>
      <p v-if="loadError" class="alert alert-warning mt-3 py-2 text-xs break-all">
        {{ nuisanceSurvivalMessages.menu.configLoadError(loadError) }}
      </p>
      <p v-if="saveError" class="alert alert-error mt-3 py-2 text-xs break-all">
        {{ nuisanceSurvivalMessages.menu.configSaveError(saveError) }}
      </p>

      <!-- コンフィグ -->
      <section v-if="showConfig" class="mt-4 flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <span class="text-sm">{{ nuisanceSurvivalMessages.config.presetsTitle }}</span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="id in presetIds"
              :key="id"
              type="button"
              class="btn btn-sm"
              :class="activePreset === id ? 'btn-primary' : 'btn-outline'"
              :title="nuisanceSurvivalMessages.config.presets[id].hint"
              @click="emit('applyPreset', id)"
            >
              {{ nuisanceSurvivalMessages.config.presets[id].label }}
            </button>
          </div>
        </div>
        <label v-for="key in keys" :key="key" class="flex flex-col gap-1">
          <span class="flex items-center gap-2">
            <span class="grow text-sm">{{ nuisanceSurvivalMessages.config.fields[key].label }}</span>
            <input
              :value="draft[key]"
              type="number"
              class="input input-bordered input-sm w-28 text-right"
              @input="emit('update', key, ($event.target as HTMLInputElement).valueAsNumber)"
              :min="limits[key].min"
              :max="limits[key].max"
              :step="limits[key].step"
            />
            <span class="w-6 text-xs opacity-70">{{ nuisanceSurvivalMessages.config.fields[key].unit }}</span>
          </span>
          <span v-if="nuisanceSurvivalMessages.config.fields[key].hint" class="text-xs opacity-60">
            {{ nuisanceSurvivalMessages.config.fields[key].hint }}
          </span>
        </label>
        <div class="flex items-center gap-2">
          <span class="grow text-xs opacity-60">{{ nuisanceSurvivalMessages.menu.configNote }}</span>
          <button type="button" class="btn btn-ghost btn-xs" @click="emit('resetConfig')">
            {{ nuisanceSurvivalMessages.menu.resetConfig }}
          </button>
        </div>
      </section>

      <div class="mt-5 flex items-center justify-center gap-3">
        <button type="button" class="btn btn-primary" @click="emit('start')">
          {{ nuisanceSurvivalMessages.menu.start }}
        </button>
        <button type="button" class="btn btn-outline" @click="showConfig = !showConfig">
          {{ nuisanceSurvivalMessages.menu.config }}
        </button>
        <button type="button" class="btn btn-ghost" @click="emit('close')">
          {{ nuisanceSurvivalMessages.menu.close }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { nuisanceSurvivalMessages } from '../maps/NuisanceSurvivalMessageMap'
  import type { CONFIG_LIMITS, ConfigPresetId, NuisanceConfigKey, NuisanceConfigType } from '../scripts/nuisanceConfig'

  defineProps<{
    /** フォームで編集中の値 (編集は、update で親に伝える) */
    draft: NuisanceConfigType
    limits: typeof CONFIG_LIMITS
    keys: NuisanceConfigKey[]
    presetIds: ConfigPresetId[]
    /** 入力欄の値と一致しているプリセット (なければ null) */
    activePreset: ConfigPresetId | null
    online: boolean
    loadError: string
    saveError: string
  }>()
  const emit = defineEmits<{
    start: []
    close: []
    resetConfig: []
    update: [key: NuisanceConfigKey, value: number]
    applyPreset: [id: ConfigPresetId]
  }>()

  const showConfig = ref(false)
</script>
