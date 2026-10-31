// src/editor/stores/useMikujiSelectionStore.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * おみくじBOXごとの「選択中アイテムID」
 * MikujiSettings(メイン領域)内で選択状態を保持する(アイテム一覧の選択と編集で共有)
 * key は assets.mikuji のキー(events の場合は omikujiKey)
 */
export const useMikujiSelectionStore = defineStore('mikujiSelection', () => {
  const selectedIdByBox = ref<Record<string, string | null>>({})
  return { selectedIdByBox }
})
