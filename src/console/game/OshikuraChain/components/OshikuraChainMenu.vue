<!-- src/console/game/OshikuraChain/components/OshikuraChainMenu.vue -->
<!-- メニュー: 説明・難易度・コンフィグ・スタート -->
<template>
  <div class="absolute inset-0 flex items-center justify-center bg-black/55 p-4" @click.self="emit('close')">
    <div class="rounded-box max-h-full w-full max-w-md overflow-y-auto bg-base-100 p-6 text-base-content shadow-2xl">
      <h2 class="text-center text-2xl font-black">{{ oshikuraChainMessages.title }}</h2>
      <p class="mt-3 text-sm opacity-80">{{ oshikuraChainMessages.menu.description }}</p>
      <p class="mt-2 flex flex-wrap items-center gap-1 text-xs opacity-70">
        {{ oshikuraChainMessages.menu.howTo }}
        <kbd class="kbd kbd-sm">W</kbd>
        <kbd class="kbd kbd-sm">A</kbd>
        <kbd class="kbd kbd-sm">S</kbd>
        <kbd class="kbd kbd-sm">D</kbd>
        <span>コメントにぶつかると押し出せます。</span>
      </p>

      <p v-if="!online" class="alert alert-warning mt-3 py-2 text-xs">{{ oshikuraChainMessages.menu.offline }}</p>
      <p v-if="loadError" class="alert alert-warning mt-3 py-2 text-xs break-all">
        {{ oshikuraChainMessages.menu.configLoadError(loadError) }}
      </p>
      <p v-if="saveError" class="alert alert-error mt-3 py-2 text-xs break-all">
        {{ oshikuraChainMessages.menu.configSaveError(saveError) }}
      </p>

      <section class="mt-5 flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <span class="text-sm font-bold">{{ oshikuraChainMessages.menu.mode }}</span>
          <div class="join w-full">
            <button
              v-for="mode in GAME_MODES"
              :key="mode"
              type="button"
              class="btn btn-sm join-item flex-1"
              :class="draft.gameMode === mode ? 'btn-primary' : ''"
              @click="emit('gameMode', mode)"
            >
              {{ oshikuraChainMessages.menu.modes[mode] }}
            </button>
          </div>
          <p class="text-xs opacity-70">
            {{
              draft.gameMode === 'timeAttack'
                ? oshikuraChainMessages.menu.timeAttackHint(Math.round(draft.targetSeconds / 60))
                : oshikuraChainMessages.menu.enduranceHint(draft.multiplierMax)
            }}
          </p>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm font-bold">{{ oshikuraChainMessages.menu.commentSource }}</span>
          <div class="join w-full">
            <button
              v-for="source in COMMENT_SOURCES"
              :key="source"
              type="button"
              class="btn btn-sm join-item flex-1"
              :class="draft.commentSource === source ? 'btn-primary' : ''"
              @click="emit('commentSource', source)"
            >
              {{ oshikuraChainMessages.menu.commentSources[source] }}
            </button>
          </div>
          <p class="text-xs opacity-70">
            {{
              draft.commentSource === 'auto'
                ? oshikuraChainMessages.menu.autoHint(AUTO_COMMENT_INTERVAL_SECONDS)
                : oshikuraChainMessages.menu.liveHint
            }}
          </p>
        </div>
      </section>

      <section class="mt-5 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-bold">{{ oshikuraChainMessages.menu.difficulty }}</span>
          <span class="text-sm">{{ oshikuraChainMessages.menu.difficultyValue(draft.difficulty) }}</span>
        </div>
        <input
          type="range"
          class="range range-primary range-sm"
          min="1"
          max="5"
          step="1"
          :value="draft.difficulty"
          @input="emit('difficulty', Number(($event.target as HTMLInputElement).value) as DifficultyLevel)"
        />
        <div class="flex justify-between text-xs opacity-60">
          <span>やさしい</span>
          <span>むずかしい</span>
        </div>
        <p v-if="draft.gameMode === 'endurance'" class="text-center text-sm font-semibold">
          {{ oshikuraChainMessages.menu.estimate(DIFFICULTY_PROFILES[draft.difficulty].estimatedMinutes) }}
        </p>
        <p class="text-center text-xs opacity-60">
          {{
            draft.gameMode === 'endurance'
              ? oshikuraChainMessages.menu.difficultyHint
              : oshikuraChainMessages.menu.difficultyHintTimeAttack
          }}
        </p>
      </section>

      <section v-if="showConfig" class="mt-4 rounded-box bg-base-200 p-3">
        <template v-if="draft.gameMode === 'endurance'">
          <label class="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              class="checkbox checkbox-primary checkbox-sm"
              :checked="draft.resetMultiplierOnFirst"
              @change="emit('resetMultiplier', ($event.target as HTMLInputElement).checked)"
            />
            <span class="text-sm">{{ oshikuraChainMessages.menu.resetMultiplierOnFirst }}</span>
          </label>
          <p class="mt-2 text-xs opacity-60">{{ oshikuraChainMessages.menu.resetMultiplierHint }}</p>
        </template>
        <div class="mt-3 flex items-center justify-between gap-2">
          <span class="text-xs opacity-60">{{ oshikuraChainMessages.menu.configNote }}</span>
          <button type="button" class="btn btn-ghost btn-xs" @click="emit('resetConfig')">
            {{ oshikuraChainMessages.menu.resetConfig }}
          </button>
        </div>
      </section>

      <div class="mt-5 flex flex-wrap items-center justify-center gap-2">
        <button type="button" class="btn btn-primary" @click="emit('start')">
          {{
            draft.gameMode === 'timeAttack'
              ? oshikuraChainMessages.menu.startTimeAttack(draft.difficulty)
              : oshikuraChainMessages.menu.start(
                  draft.difficulty,
                  DIFFICULTY_PROFILES[draft.difficulty].estimatedMinutes
                )
          }}
        </button>
        <button type="button" class="btn btn-outline" @click="showConfig = !showConfig">
          {{ oshikuraChainMessages.menu.config }}
        </button>
        <button type="button" class="btn btn-ghost" @click="emit('close')">
          {{ oshikuraChainMessages.menu.close }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { oshikuraChainMessages } from '../maps/OshikuraChainMessageMap'
  import {
    COMMENT_SOURCES,
    DIFFICULTY_PROFILES,
    GAME_MODES,
    type CommentSource,
    type DifficultyLevel,
    type GameMode,
    type OshikuraChainConfig,
  } from '../scripts/nuisanceConfig'
  import { AUTO_COMMENT_INTERVAL_SECONDS } from '../scripts/nuisanceConstants'

  defineProps<{
    draft: OshikuraChainConfig
    online: boolean
    loadError: string
    saveError: string
  }>()
  const emit = defineEmits<{
    start: []
    close: []
    resetConfig: []
    difficulty: [value: DifficultyLevel]
    gameMode: [value: GameMode]
    commentSource: [value: CommentSource]
    resetMultiplier: [enabled: boolean]
  }>()

  const showConfig = ref(false)
</script>
