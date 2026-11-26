<!-- src/console/control/Amidakuji/components/setup/PlayersSection.vue -->
<template>
  <div class="card bg-base-200 shadow-sm p-3 flex flex-col gap-2">
    <div class="font-bold text-sm flex items-center justify-between">
      <span>参加者の募集</span>
      <span class="text-xs opacity-70">{{ players.length }}/{{ PLAYER_MAX }}人</span>
    </div>

    <!-- コメント募集 -->
    <div class="flex flex-col gap-1.5 border-t border-base-300 pt-2">
      <label class="text-xs opacity-80">合言葉 (空なら全コメント):</label>
      <input
        v-model="keyword"
        type="text"
        placeholder="例: あみだ"
        class="input input-xs input-bordered w-full"
        :disabled="isRecruiting"
      />
      <button
        type="button"
        class="btn btn-xs mt-1 font-bold"
        :class="isRecruiting ? 'btn-error' : 'btn-success'"
        @click="isRecruiting ? stopRecruiting() : startRecruiting()"
      >
        {{ isRecruiting ? '募集を締切る' : 'コメント募集開始' }}
      </button>
      <div v-if="joinError" class="text-error text-xs">{{ joinError }}</div>
    </div>

    <!-- 手動追加 -->
    <div class="flex flex-col gap-1 border-t border-base-300 pt-2">
      <label class="text-xs opacity-80">手動追加 (改行で複数人):</label>
      <textarea
        v-model="manualInputText"
        rows="2"
        placeholder="名前1&#10;名前2"
        class="textarea textarea-bordered textarea-xs w-full"
      />
      <button
        type="button"
        class="btn btn-xs btn-outline mt-1"
        :disabled="!manualInputText.trim()"
        @click="handleManualAdd"
      >
        手動で追加
      </button>
    </div>

    <div v-if="notice" class="text-warning text-xs">{{ notice }}</div>

    <!-- 参加者一覧 (削除可能) -->
    <div v-if="players.length > 0" class="mt-2 flex flex-col gap-1">
      <div class="text-xs font-semibold opacity-80">参加者一覧:</div>
      <div class="max-h-28 overflow-y-auto flex flex-col gap-1 pr-1">
        <div
          v-for="(p, idx) in players"
          :key="p.id"
          class="flex items-center justify-between bg-base-100 rounded px-2 py-0.5 text-xs"
        >
          <span class="truncate max-w-42" :title="p.name"> {{ idx + 1 }}. {{ p.name }} </span>
          <button type="button" class="text-error hover:font-bold px-1" title="削除" @click="removePlayer(p.id)">
            ×
          </button>
        </div>
      </div>
      <div class="text-[10px] opacity-60">削除した人は、コメントしても再参加しません</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { PLAYER_MAX } from '../../scripts/amidakujiConstants'
  import { useAmidakujiContext } from '../../composables/useAmidakujiContext'

  const { players, notice, commentJoin, addManualPlayers, removePlayer } = useAmidakujiContext()
  const { isRecruiting, keyword, error: joinError, startRecruiting, stopRecruiting } = commentJoin

  const manualInputText = ref('')

  const handleManualAdd = () => {
    if (!manualInputText.value.trim()) return
    addManualPlayers(manualInputText.value)
    manualInputText.value = ''
  }
</script>
