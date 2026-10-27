// src/editor/stores/useMikujiSelectionStore.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * おみくじBOXごとの「選択中アイテムID」
 * MikujiSettings(メイン領域)と NavigationSidebar(サイドバー)で選択状態を共有する
 * key は assets.mikuji のキー(events の場合は omikujiKey)
 */
export const useMikujiSelectionStore = defineStore('mikujiSelection', () => {
  const selectedIdByBox = ref<Record<string, string | null>>({})
  return { selectedIdByBox }
})
