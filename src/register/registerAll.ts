// src/register/registerAll.ts
import { registerAllGameScripts } from '@/register/registerGameScripts'
import { isFullRegistered } from '@/editor/registrationState'
import { registerAllLayouts } from './registerLayouts'
import { registerAllUi } from './registerUi'
import { registerAllUiEditor } from './registerUiEditor'

export const registerAll = () => {
  // UI・レイアウト・gameScript の登録(ジェネレーターと共通)
  registerAllUi()
  registerAllLayouts()
  registerAllGameScripts()
  registerAllUiEditor()

  // 全部入りの印(DataPacks など、全 UI 前提の機能の表示に使う)
  isFullRegistered.value = true
}
