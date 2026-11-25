// src/register/registerAll.ts
import { registerAllGameScripts } from '@/register/registerGameScripts'
import { markFullBuild } from '@/common/buildValidation/fullBuild'
import { registerAllLayouts } from './registerLayouts'
import { registerAllUi } from './registerUi'
import { registerAllUiEditor } from './registerUiEditor'

export const registerAll = () => {
  // UI・レイアウト・gameScript の登録(ジェネレーターと共通)
  registerAllLayouts()
  registerAllUi()
  registerAllUiEditor()
  registerAllGameScripts()

  // 全部入りの印(DataPacks のダウンロード、レイアウト選択の表示に使う)
  markFullBuild()
}
