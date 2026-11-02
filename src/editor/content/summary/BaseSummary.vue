<!-- src/editor/content/summary/BaseSummary.vue -->
<!-- 選択中アイテムの基本設定(名前・説明・タグ)の概要。編集は「基本設定を編集」のダイアログで行う -->
<template>
  <section class="w-full rounded-box border border-base-300 bg-base-200/40 p-4 min-w-0">
    <div class="flex items-center justify-between gap-2 mb-3">
      <h3 class="font-semibold">{{ t('categorySections.baseSettings.label') }}</h3>
      <button class="btn btn-xs btn-ghost" @click="editOpen = true">
        <Pencil class="w-3.5 h-3.5" />
        {{ t('connections.switcher.edit') }}
      </button>
    </div>

    <dl v-if="selectedRecord" class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
      <!-- キー名 (placeholders のみ) -->
      <template v-if="selectedCategory === 'placeholders'">
        <dt class="opacity-60">{{ t('baseSettings.key.label') }}</dt>
        <dd class="wrap-break-word">{{ selectedRecord.key }}</dd>
      </template>

      <!-- 名前 -->
      <dt class="opacity-60">{{ t('baseSettings.name.label') }}</dt>
      <dd class="wrap-break-word">{{ selectedRecord.name || '—' }}</dd>

      <!-- 説明 -->
      <template v-if="selectedRecord.description">
        <dt class="opacity-60">{{ t('baseSettings.description.label') }}</dt>
        <dd class="wrap-break-word">{{ selectedRecord.description }}</dd>
      </template>

      <!-- タグ -->
      <template v-if="selectedRecord.tags?.length">
        <dt class="opacity-60">{{ t('baseSettings.tags.label') }}</dt>
        <dd class="flex flex-wrap gap-1">
          <span v-for="tag in selectedRecord.tags" :key="tag" class="badge badge-sm badge-outline">{{ tag }}</span>
        </dd>
      </template>
    </dl>
  </section>

  <!-- 編集ダイアログ -->
  <!-- TODO:ItemEditDialog.vueとマージさせたい -->
  <ItemEditDialog v-model:open="editOpen" />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { Pencil } from 'lucide-vue-next'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useSelectedRecord } from '../composables/useSelectedRecord'
  import ItemEditDialog from './ItemEditDialog.vue'

  const { t } = useI18n()

  const { selectedCategory, selectedItemKey } = storeToRefs(useNavigationStore())
  const { selectedRecord } = useSelectedRecord()

  const editOpen = ref(false)

  // 別のアイテムへ移ったとき、開きっぱなしの編集ダイアログを閉じる
  watch(selectedItemKey, () => {
    editOpen.value = false
  })
</script>
