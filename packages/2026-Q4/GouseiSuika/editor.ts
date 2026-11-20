// packages/2026-Q4/GouseiSuika/editor.ts
import EditorApp from '@/editor/App.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/editorCore'
import { definePackage } from '@/register/definePackage'
import { registerStandardRankingComponents } from '@/ui/game/GameRanking/components/standard/register'
import '@assets/styles/DaisyUi.css'
import { registerGameScript } from '@/games/gameScriptRegistry'

registerGameScript({
  GouseiSuika: () => import('@/games/scripts/game/GouseiSuika/execute'),
})

definePackage({
  kind: 'gameRanking',
  layout: 'gameRanking',
  loader: () => import('@/layout/common/GameRanking/GameRanking.vue'),
  registerComponents: registerStandardRankingComponents,
  editor: () => import('@/ui/game/GameRanking/editor/GameRankingEditor.vue'),
})

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountEditor = () => {
  createAppNotOneSDK(EditorApp)
}
