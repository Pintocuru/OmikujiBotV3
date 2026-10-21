<!-- src/editor/assets/PostFlow/Message/PlaceholderPanel.vue -->
<template>
  <div class="w-64 shrink-0 flex flex-col bg-base-100">
    <!-- ヘッダー -->
    <div class="px-3 py-2 bg-base-200 border-b border-base-300 shrink-0 flex items-center justify-between">
      <span class="text-xs font-semibold text-base-content">{{ t('postFlow.placeholderPanel.title') }}</span>
      <div class="flex gap-1">
        <button class="btn btn-xs btn-ghost gap-1" :title="t('postFlow.placeholderPanel.inlineTip')" @click="emit('openInlinePh')">
          <Braces :size="12" />
          {{ t('postFlow.placeholderPanel.inline') }}
        </button>
        <button class="btn btn-xs btn-ghost gap-1" @click="showAddPlaceholder = !showAddPlaceholder">
          <Plus :size="12" />
          {{ t('postFlow.common.add') }}
        </button>
      </div>
    </div>

    <!-- 新規プレースホルダー追加フォーム -->
    <div v-if="showAddPlaceholder" class="px-3 py-2 border-b border-base-300 bg-warning/10 shrink-0">
      <p class="text-xs font-semibold text-warning mb-1">{{ t('postFlow.placeholderPanel.newTitle') }}</p>
      <div class="flex gap-1">
        <input
          v-model="newPlaceholderKey"
          type="text"
          class="input input-bordered input-xs flex-1 font-mono"
          :placeholder="t('postFlow.placeholderPanel.keyPlaceholder')"
          @keydown.enter="createNewPlaceholder"
        />
        <button class="btn btn-xs btn-warning" :disabled="!newPlaceholderKey.trim()" @click="createNewPlaceholder">
          {{ t('postFlow.placeholderPanel.create') }}
        </button>
      </div>
    </div>

    <!-- スクロールエリア -->
    <div class="flex-1 overflow-y-auto">
      <!-- デフォルトプレースホルダー -->
      <div class="divider my-1 px-2 text-xs">{{ t('postFlow.placeholderPanel.defaults') }}</div>
      <div class="px-2 pt-2 pb-1">
        <div class="flex flex-wrap gap-1">
          <button
            v-for="ph in defaultPlaceholderList"
            :key="ph.key"
            class="badge badge-ghost badge-sm font-mono cursor-pointer hover:badge-accent transition-colors"
            :class="{ 'badge-accent': usedKeys.has(ph.key) }"
            :title="t('postFlow.placeholderPanel.exampleTip', { label: ph.label, short: ph.short })"
            @click="emit('insert', ph.key)"
          >
            {{ ph.key }}
          </button>
        </div>
      </div>

      <div class="divider my-1 px-2 text-xs">{{ t('postFlow.placeholderPanel.userDefined') }}</div>

      <div v-if="sortedUserPlaceholders.length === 0" class="p-4 text-center text-xs text-base-content/40">
        {{ t('postFlow.placeholderPanel.none') }}
      </div>

      <div
        v-for="ph in sortedUserPlaceholders"
        :key="ph.key"
        class="border-b border-base-200 last:border-0"
        :class="{ 'bg-primary/5': usedKeys.has(ph.key) }"
      >
        <!-- ヘッダー行 -->
        <div
          class="flex items-center gap-1 px-2 py-1.5 cursor-pointer hover:bg-base-200 group"
          @click="togglePlaceholder(ph.key)"
        >
          <ChevronRight
            :size="12"
            class="text-base-content/40 transition-transform shrink-0"
            :class="{ 'rotate-90': expandedKeys.has(ph.key) }"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1">
              <span class="text-xs font-mono font-semibold truncate">{{ ph.key }}</span>
              <span v-if="usedKeys.has(ph.key)" class="badge badge-primary badge-xs shrink-0">{{ t('postFlow.placeholderPanel.inUse') }}</span>
            </div>
            <p class="text-xs text-base-content/50 truncate">{{ ph.name }}</p>
          </div>
          <button
            class="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            :title="t('postFlow.placeholderPanel.insertTip')"
            @click.stop="emit('insert', ph.key)"
          >
            <CornerDownLeft :size="12" />
          </button>
        </div>

        <!-- 展開: 値一覧 -->
        <div v-if="expandedKeys.has(ph.key)" class="bg-base-200/60 px-2 pb-2">
          <button class="btn btn-xs btn-primary w-full gap-1 mt-1 mb-2" @click="emit('insert', ph.key)">
            <CornerDownLeft :size="11" />
            {{ t('postFlow.placeholderPanel.insertKey', { ph: `<<${ph.key}>>` }) }}
          </button>

          <div class="space-y-1">
            <div
              v-for="(val, idx) in handelNormalizedValues(ph.values)"
              :key="idx"
              class="flex items-center gap-1 group"
            >
              <span class="badge badge-xs badge-ghost font-mono shrink-0">{{ val.weight }}</span>
              <input
                type="text"
                class="input input-xs input-bordered flex-1 font-mono text-xs"
                :value="val.content"
                @change="updatePlaceholderValue(ph.key, idx, $event)"
              />
              <button
                class="btn btn-xs btn-ghost btn-circle opacity-0 group-hover:opacity-100 shrink-0"
                @click="removePlaceholderValue(ph.key, idx)"
              >
                <Trash2 :size="10" />
              </button>
            </div>
          </div>

          <button class="btn btn-xs btn-ghost gap-1 mt-1 w-full" @click="addPlaceholderValue(ph.key)">
            <Plus :size="10" />
            {{ t('postFlow.placeholderPanel.addValue') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { Plus, ChevronRight, CornerDownLeft, Trash2, Braces } from 'lucide-vue-next'
  import { usePlaceholderEditor } from './usePlaceholderEditor'
  import { toRef } from 'vue'
  import { handelNormalizedValues } from '@/types/OmikujiData'

  const { t } = useI18n()

  const props = defineProps<{
    draftText: string
    isCommentMode?: boolean
  }>()

  const emit = defineEmits<{
    insert: [key: string]
    openInlinePh: []
  }>()

  const {
    showAddPlaceholder,
    newPlaceholderKey,
    expandedKeys,
    defaultPlaceholderList,
    sortedUserPlaceholders,
    usedKeys,
    togglePlaceholder,
    updatePlaceholderValue,
    removePlaceholderValue,
    addPlaceholderValue,
    createNewPlaceholder,
  } = usePlaceholderEditor(toRef(props, 'draftText'), props.isCommentMode)
</script>
