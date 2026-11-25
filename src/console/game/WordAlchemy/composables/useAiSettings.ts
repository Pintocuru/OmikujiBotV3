// src/console/game/WordAlchemy/composables/useAiSettings.ts
// AI の接続先の設定 (メイン・サブ) の読み込み・保存。キーは画面に返ってこない (末尾 4 文字のヒントだけ)
import { computed, ref } from 'vue'
import { aiApi } from '@/manager/services/aiApi'
import type { LoadAiSettingsResponseType, SaveAiSettingsRequestType } from '@/types/api'

export function useAiSettings() {
  const settings = ref<LoadAiSettingsResponseType | null>(null)
  const busy = ref(false)
  const error = ref('')

  /** どちらかの接続先が設定されている (なければ、規則ベースの Mock だけで進む) */
  const configured = computed(() => !!(settings.value?.main || settings.value?.sub))

  const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e))

  const load = async () => {
    try {
      settings.value = await aiApi.loadSettings()
    } catch (e) {
      // サーバーにつながらないときは、設定なしとして扱う (Mock で遊べる)
      error.value = errorText(e)
    }
  }

  /** 保存できたら true */
  const save = async (request: SaveAiSettingsRequestType): Promise<boolean> => {
    busy.value = true
    error.value = ''
    try {
      settings.value = await aiApi.saveSettings(request)
      return true
    } catch (e) {
      error.value = errorText(e)
      return false
    } finally {
      busy.value = false
    }
  }

  return { settings, configured, busy, error, load, save }
}
