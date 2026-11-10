<!-- src/editor/parts/MessageTextDialog/PlaceholderPanel.vue -->
<template>
  <div class="w-64 shrink-0 flex flex-col bg-base-100">
    <!-- ヘッダー -->
    <div class="px-2 py-1 bg-base-200 border-b border-base-300 shrink-0 flex items-center justify-between">
      <!-- タイトル -->
      <span class="text-xs font-semibold text-base-content">{{ t('scenarioStep.placeholderPanel.title') }}</span>

      <!-- 簡易追加ボタンー -->
      <div class="flex gap-1 tooltip tooltip-bottom" :data-tip="t('scenarioStep.placeholderPanel.inlineTip')">
        <button class="btn btn-xs btn-neutral gap-2" @click="emit('openInlinePh')">
          <Braces class="w-4 h-4" />
          {{ t('scenarioStep.placeholderPanel.inline') }}
        </button>
      </div>
    </div>

    <!-- スクロールエリア -->
    <div class="flex-1 overflow-y-auto">
      <!-- デフォルトプレースホルダー -->
      <div class="divider my-1 px-2 text-xs">{{ t('scenarioStep.placeholderPanel.defaults') }}</div>
      <div class="px-2 pt-2 pb-1">
        <div class="flex flex-wrap gap-1">
          <button
            v-for="ph in defaultPlaceholderList"
            :key="ph.key"
            class="badge badge-ghost badge-sm font-mono cursor-pointer hover:badge-accent transition-colors"
            :class="{ 'badge-accent': usedKeys.has(ph.key) }"
            :title="t('scenarioStep.placeholderPanel.exampleTip', { label: ph.label, short: ph.short })"
            @click="emit('insert', ph.key)"
          >
            {{ ph.key }}
          </button>
        </div>
      </div>

      <!-- ユーザー定義プレースホルダー -->
      <div class="divider my-1 px-2 text-xs">{{ t('scenarioStep.placeholderPanel.userDefined') }}</div>
      <div v-if="sortedUserPlaceholders.length === 0" class="p-4 text-center text-xs text-base-content/40">
        {{ t('scenarioStep.placeholderPanel.none') }}
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
              <span v-if="usedKeys.has(ph.key)" class="badge badge-primary badge-xs shrink-0">{{
                t('scenarioStep.placeholderPanel.inUse')
              }}</span>
            </div>
            <p class="text-xs text-base-content/50 truncate">{{ ph.name }}</p>
          </div>
          <div
            class="tooltip tooltip-left opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            :data-tip="t('scenarioStep.placeholderPanel.insertTip')"
          >
            <button
              class="btn btn-sm btn-ghost btn-square"
              :aria-label="t('scenarioStep.placeholderPanel.insertTip')"
              @click.stop="emit('insert', ph.key)"
            >
              <CornerDownLeft class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 展開: 値一覧 -->
        <div v-if="expandedKeys.has(ph.key)" class="bg-base-200/60 px-2 pb-2">
          <button class="btn btn-sm btn-secondary w-full gap-2 mt-1 mb-2" @click="emit('insert', ph.key)">
            <CornerDownLeft class="w-4 h-4" />
            {{ t('scenarioStep.placeholderPanel.insertKey', { ph: `<<${ph.key}>>` }) }}
          </button>

          <div class="space-y-1">
            <div
              v-for="(val, idx) in handleNormalizedValues(ph.values)"
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
                class="btn btn-sm btn-ghost btn-circle opacity-0 group-hover:opacity-100 shrink-0"
                :aria-label="t('scenarioStep.common.remove')"
                @click="removePlaceholderValue(ph.key, idx)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <button class="btn btn-sm btn-ghost gap-2 mt-1 w-full" @click="addPlaceholderValue(ph.key)">
            <Plus class="w-4 h-4" />
            {{ t('scenarioStep.placeholderPanel.addValue') }}
          </button>
        </div>
      </div>

      <!-- 新規プレースホルダー追加フォーム -->
      <div v-if="showAddPlaceholder" class="px-3 py-2 border-b border-base-300 bg-warning/10 shrink-0">
        <p class="text-xs font-semibold text-warning mb-1">{{ t('scenarioStep.placeholderPanel.newTitle') }}</p>
        <div class="flex gap-1">
          <input
            v-model="newPlaceholderKey"
            type="text"
            class="input input-bordered input-xs flex-1 font-mono"
            :placeholder="t('scenarioStep.placeholderPanel.keyPlaceholder')"
            @keydown.enter="createNewPlaceholder"
          />
          <button class="btn btn-xs btn-secondary" :disabled="!newPlaceholderKey.trim()" @click="createNewPlaceholder">
            {{ t('scenarioStep.placeholderPanel.create') }}
          </button>
        </div>
      </div>

      <!-- プレースホルダーを追加 -->
      <button class="btn btn-xs btn-secondary gap-2" @click="showAddPlaceholder = !showAddPlaceholder">
        <Plus class="w-4 h-4" />
        {{ t('scenarioStep.common.add') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { Plus, ChevronRight, CornerDownLeft, Trash2, Braces } from 'lucide-vue-next'
  import { usePlaceholderEditor } from './composables/usePlaceholderEditor'
  import { toRef } from 'vue'
  import { handleNormalizedValues } from '@/types/OmikujiData'

  const { t } = useI18n()

  const props = defineProps<{
    draftText: string
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
  } = usePlaceholderEditor(toRef(props, 'draftText'))
</script>
