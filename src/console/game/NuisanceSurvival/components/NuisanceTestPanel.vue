<!-- src/console/game/NuisanceSurvival/components/NuisanceTestPanel.vue -->
<!-- テストコメント: 想定ユーザー数でコメントを投稿して、邪魔者を出す (H キーで隠せる。OBS でキャプチャするとき用) -->
<template>
  <div class="card absolute bottom-2 left-2 w-64 border border-base-300 bg-base-200 text-base-content shadow-lg">
    <div class="card-body gap-2 p-2">
      <button type="button" class="flex items-center justify-between text-left text-sm" @click="collapsed = !collapsed">
        <span>{{ nuisanceSurvivalMessages.test.title }}</span>
        <span class="text-xs opacity-60">{{ collapsed ? '▶' : '▼' }}</span>
      </button>

      <template v-if="!collapsed">
        <div class="flex flex-col gap-1">
          <span class="text-xs opacity-60">{{ nuisanceSurvivalMessages.test.expectedUsers }}</span>
          <div class="join w-full">
            <button
              v-for="n in MOCK_USER_POOL_PRESETS"
              :key="n"
              type="button"
              class="btn btn-xs join-item flex-1"
              :class="userCount === n ? 'btn-accent' : ''"
              @click="userCount = n"
            >
              {{ nuisanceSurvivalMessages.test.people(n) }}
            </button>
          </div>
          <div class="join w-full">
            <button
              v-for="mode in pickModes"
              :key="mode"
              type="button"
              class="btn btn-xs join-item flex-1"
              :class="pickMode === mode ? 'btn-accent' : ''"
              @click="pickMode = mode"
            >
              {{ nuisanceSurvivalMessages.test.pickMode[mode] }}
            </button>
          </div>
        </div>

        <label class="flex items-center gap-2 text-xs opacity-80">
          {{ nuisanceSurvivalMessages.test.interval }}
          <input
            v-model.number="intervalSeconds"
            type="number"
            step="0.1"
            min="0.1"
            class="input input-bordered input-xs w-20"
          />
        </label>

        <div class="join w-full">
          <button type="button" class="btn btn-xs btn-neutral join-item flex-1" @click="sendComment">
            {{ nuisanceSurvivalMessages.test.send }}
          </button>
          <button
            type="button"
            class="btn btn-xs join-item flex-1"
            :class="isRunning ? 'btn-ghost' : 'btn-primary'"
            @click="toggleAuto"
          >
            {{ isRunning ? nuisanceSurvivalMessages.test.stop : nuisanceSurvivalMessages.test.auto }}
          </button>
          <button type="button" class="btn btn-xs btn-warning join-item flex-1" @click="burst">
            {{ nuisanceSurvivalMessages.test.burst }}
          </button>
        </div>

        <p class="truncate text-xs opacity-60">
          {{ notice || nuisanceSurvivalMessages.test.sent(sentCount) }}
        </p>
        <p class="text-[10px] opacity-40">{{ nuisanceSurvivalMessages.test.hint }}</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { MOCK_USER_PICK_MODE_LABELS, MOCK_USER_POOL_PRESETS, type MockUserPickMode } from '@/common/MockUser'
  import { useTestComments } from '../composables/useTestComments'
  import { nuisanceSurvivalMessages } from '../maps/NuisanceSurvivalMessageMap'

  const { userCount, pickMode, intervalSeconds, isRunning, sentCount, notice, sendComment, toggleAuto, burst } =
    useTestComments()

  const pickModes = Object.keys(MOCK_USER_PICK_MODE_LABELS) as MockUserPickMode[]
  const collapsed = ref(false)
</script>
