<!-- src/console/game/WordAlchemy/components/WordAlchemyTopBar.vue -->
<!-- 上部バー。ゲーム名、オートの表示、コメント接続の状態、やめる (誤操作防止に 2 回押し) -->
<template>
  <header class="flex h-10 shrink-0 items-center gap-3 bg-base-300 px-3 text-sm">
    <span class="font-bold">{{ wordAlchemyMessages.title }}</span>
    <span v-if="phase === 'running'" class="opacity-80">{{ potMap[potType].label }}</span>
    <span v-if="phase === 'running' && commentSource === 'auto'" class="badge badge-warning badge-sm">
      {{ wordAlchemyMessages.bar.auto }}
    </span>
    <span v-if="commentStatus === 'connecting'" class="opacity-70">{{ wordAlchemyMessages.comments.connecting }}</span>
    <button v-else-if="commentStatus === 'error'" class="btn btn-error btn-xs" @click="emit('reconnect')">
      {{ wordAlchemyMessages.comments.error }} / {{ wordAlchemyMessages.comments.retry }}
    </button>
    <button v-if="phase === 'running'" class="btn btn-ghost btn-xs ml-auto" @click="onAbort" @blur="confirming = false">
      {{ confirming ? wordAlchemyMessages.bar.abortConfirm : wordAlchemyMessages.bar.abort }}
    </button>
  </header>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { wordAlchemyMessages } from '../maps/WordAlchemyMessageMap'
  import { potMap, type PotKey } from '../maps/WordAlchemyPotMap'
  import type { CommentSource, CommentStatus, WordAlchemyPhase } from '../composables/useWordAlchemy'

  defineProps<{ potType: PotKey; phase: WordAlchemyPhase; commentSource: CommentSource; commentStatus: CommentStatus }>()
  const emit = defineEmits<{ abort: []; reconnect: [] }>()

  const confirming = ref(false)
  const onAbort = () => {
    if (!confirming.value) {
      confirming.value = true
      return
    }
    confirming.value = false
    emit('abort')
  }
</script>
