<!-- src/editor/content/summary/BaseSummary.vue -->
<!-- 選択中アイテムの基本設定(名前・説明・タグ)の概要。編集は「基本設定を編集」のダイアログで行う -->
<template>
  <!-- タイトル & キー名 -->
  <SettingItem
    layout="vertical"
    icon="DraftingCompass"
    :label="selectedRecord?.name ?? '—'"
    :description="
      selectedCategory === 'placeholders' || selectedCategory === 'characters' ? `key: ${selectedRecord?.key}` : ''
    "
  >
    <template #label-extra>
      <button class="btn btn-xs btn-secondary gap-2" @click="editOpen = true">
        <Pencil class="w-4 h-4" />
      </button>
    </template>

    <section v-if="selectedRecord" class="rounded-box p-2 space-y-2">
      <div v-if="selectedRecord.description" class="wrap-break-word">
        {{ selectedRecord.description }}
      </div>

      <div v-if="selectedRecord.tags?.length" class="flex gap-1">
        <!-- タグ -->
        <template v-if="selectedRecord.tags?.length">
          <span v-for="tag in selectedRecord.tags" :key="tag" class="badge badge-sm badge-outline">{{ tag }}</span>
        </template>
      </div>
    </section>
  </SettingItem>

  <!-- 編集ダイアログ -->
  <ItemEditDialog v-model:open="editOpen" />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { Pencil } from 'lucide-vue-next'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useSelectedRecord } from '../composables/useSelectedRecord'
  import ItemEditDialog from './ItemEditDialog.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const { selectedCategory, selectedItemKey } = storeToRefs(useNavigationStore())
  const { selectedRecord } = useSelectedRecord()

  const editOpen = ref(false)

  // 別のアイテムへ移ったとき、開きっぱなしの編集ダイアログを閉じる
  watch(selectedItemKey, () => {
    editOpen.value = false
  })
</script>
