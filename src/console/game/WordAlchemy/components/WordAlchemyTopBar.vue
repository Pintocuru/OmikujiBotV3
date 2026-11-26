<!-- src/console/game/WordAlchemy/components/WordAlchemyTopBar.vue -->
<!-- 上部バー。ゲーム名、鍋 (ゲーム中も変えられる)、オートの表示、コメント接続の状態、やめる (誤操作防止に 2 回押し) -->
<template>
  <ToolTopBar :title="wordAlchemyMessages.title">
    <span v-if="phase === 'running'" class="tooltip tooltip-bottom" :data-tip="wordAlchemyMessages.bar.potChange">
      <!-- 選んだあと、フォーカスを外す (入力欄扱いで、WASD や Enter / Esc が効かなくなるのを防ぐ) -->
      <select
        v-model="potType"
        class="select select-ghost select-xs w-auto"
        :aria-label="wordAlchemyMessages.pot"
        @change="($event.target as HTMLSelectElement).blur()"
        @keyup.esc="($event.target as HTMLSelectElement).blur()"
      >
        <option v-for="key in POT_KEYS" :key="key" :value="key" class="text-base-content">
          {{ potMap[key].label }}
        </option>
      </select>
    </span>
    <span v-if="phase === 'running' && commentSource === 'auto'" class="badge badge-warning badge-sm">
      {{ wordAlchemyMessages.bar.auto }}
    </span>
    <span v-if="commentStatus === 'connecting'" class="opacity-70">{{ wordAlchemyMessages.comments.connecting }}</span>
    <button v-else-if="commentStatus === 'error'" class="btn btn-error btn-xs" @click="emit('reconnect')">
      {{ wordAlchemyMessages.comments.error }} / {{ wordAlchemyMessages.comments.retry }}
    </button>
    <span v-if="codexOffline" class="badge badge-warning badge-sm">{{ wordAlchemyMessages.codex.offline }}</span>
    <span v-if="recordError" class="badge badge-warning badge-sm" :title="recordError">{{
      wordAlchemyMessages.recordFailed
    }}</span>
    <span
      class="badge badge-sm"
      :class="aiUsage.last === 'failed' || aiUsage.last === 'limited' ? 'badge-warning' : 'badge-ghost'"
      :title="wordAlchemyMessages.ai.usage(aiUsage.ai, aiUsage.mock)"
    >
      {{ wordAlchemyMessages.ai.status[aiUsage.last] }}
    </span>
    <template #actions>
      <button class="btn btn-ghost btn-xs gap-1" @click="emit('openCodex')">
        <BookOpen :size="14" />
        {{ wordAlchemyMessages.codex.discovered(found, total) }}
      </button>
      <button
        class="btn btn-ghost btn-square btn-xs"
        :aria-label="wordAlchemyMessages.ai.open"
        :title="wordAlchemyMessages.ai.open"
        @click="emit('openAiSettings')"
      >
        <KeyRound :size="14" />
      </button>
      <ConfirmButton
        v-if="phase === 'running'"
        :label="wordAlchemyMessages.bar.abort"
        :confirm-label="wordAlchemyMessages.bar.abortConfirm"
        @confirm="emit('abort')"
      />
    </template>
  </ToolTopBar>
</template>

<script setup lang="ts">
  import { BookOpen, KeyRound } from '@lucide/vue'
  import ConfirmButton from '@/console/parts/ConfirmButton.vue'
  import ToolTopBar from '@/console/parts/ToolTopBar.vue'
  import { wordAlchemyMessages } from '../maps/WordAlchemyMessageMap'
  import { POT_KEYS, potMap, type PotKey } from '../maps/WordAlchemyPotMap'
  import type { AiLast, CommentSource, CommentStatus, WordAlchemyPhase } from '../composables/useWordAlchemy'

  defineProps<{
    aiUsage: { last: AiLast; ai: number; mock: number }
    recordError: string
    found: number
    total: number
    codexOffline: boolean
    phase: WordAlchemyPhase
    commentSource: CommentSource
    commentStatus: CommentStatus
  }>()
  /** 鍋の種類 (ゲーム中に変えると、鍋の中身は捨てられる) */
  const potType = defineModel<PotKey>('potType', { required: true })
  const emit = defineEmits<{ abort: []; reconnect: []; openCodex: []; openAiSettings: [] }>()
</script>
