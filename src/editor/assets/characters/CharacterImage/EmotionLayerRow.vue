<!-- src/editor/assets/characters/CharacterImage/EmotionLayerRow.vue -->
<!-- レイヤー1枚ぶん: パス入力・候補・(1枚目だけ)画像を検出・並び替え・削除・読み込み状態・プレビュー -->
<template>
  <div class="border rounded p-2 bg-base-200 space-y-1">
    <div class="flex items-center gap-2">
      <span class="badge badge-outline badge-sm">{{ index + 1 }}</span>
      <div class="flex-1" />

      <!-- 画像を検出 -->
      <button
        v-if="isFirst"
        type="button"
        class="btn btn-sm btn-outline gap-2"
        :disabled="detecting"
        @click="emit('detect')"
      >
        <span v-if="detecting" class="loading loading-spinner loading-xs" />
        <ScanSearch v-else class="w-4 h-4" />
        {{ t('characterImage.layer.detect') }}
      </button>

      <!-- 並び替え -->
      <div class="tooltip tooltip-top" :data-tip="t('characterImage.layer.moveUp')">
        <button
          type="button"
          class="btn btn-sm btn-ghost btn-square"
          :aria-label="t('characterImage.layer.moveUp')"
          :disabled="index === 0"
          @click="emit('moveUp')"
        >
          <ChevronUp class="w-4 h-4" />
        </button>
      </div>

      <!-- 並び替え -->
      <div class="tooltip tooltip-top" :data-tip="t('characterImage.layer.moveDown')">
        <button
          type="button"
          class="btn btn-sm btn-ghost btn-square"
          :aria-label="t('characterImage.layer.moveDown')"
          :disabled="index === total - 1"
          @click="emit('moveDown')"
        >
          <ChevronDown class="w-4 h-4" />
        </button>
      </div>

      <!-- 削除 -->
      <div class="tooltip tooltip-top" :data-tip="t('characterImage.layer.remove')">
        <button
          type="button"
          class="btn btn-sm btn-error btn-square"
          :aria-label="t('characterImage.layer.remove')"
          @click="emit('remove')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="flex items-center gap-1">
      <input
        type="text"
        class="input input-xs flex-1 min-w-0"
        :class="{ 'input-warning': status === 'error' }"
        :placeholder="t('characterImage.layer.path', { n: index + 1 })"
        :value="path"
        @input="emit('update:path', ($event.target as HTMLInputElement).value)"
      />
      <button type="button" class="btn btn-xs btn-outline gap-1 shrink-0" @click="emit('pick')">
        <FolderOpen class="w-3.5 h-3.5" />
        {{ t('characterImage.layer.candidates') }}
      </button>
    </div>

    <!-- 読み込みの状態 (編集画面だけ。配信表示は、読めない画像を黙って非表示にする) -->
    <p v-if="status === 'checking'" class="text-xs text-base-content/50">
      {{ t('characterImage.layer.status.checking') }}
    </p>
    <p v-else-if="status === 'error'" class="flex items-center gap-1 text-xs text-warning">
      <TriangleAlert class="w-3.5 h-3.5 shrink-0" />
      {{ t('characterImage.layer.status.error') }}
    </p>
    <p v-if="warning" class="flex items-start gap-1 text-xs text-warning">
      <TriangleAlert class="w-3.5 h-3.5 shrink-0 mt-0.5" />
      {{ warning }}
    </p>

    <ImagePreview :layers="path" :width="128" />
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ChevronDown, ChevronUp, FolderOpen, ScanSearch, TriangleAlert, X } from 'lucide-vue-next'
  import ImagePreview from '@/common/LayerImage/ImagePreview.vue'
  import { useLayerStatus } from './composables/useLayerStatus'

  const { t } = useI18n()

  const props = defineProps<{
    path: string
    index: number
    total: number
    isFirst: boolean /** 1枚目か (「画像を検出」を出す) */
    detecting: boolean
    warning: string /** 入力欄の下に出す警告 (検出で見つからなかったときなど) */
  }>()

  const emit = defineEmits<{
    'update:path': [path: string]
    detect: []
    pick: []
    moveUp: []
    moveDown: []
    remove: []
  }>()

  const { status } = useLayerStatus(() => props.path)
</script>
