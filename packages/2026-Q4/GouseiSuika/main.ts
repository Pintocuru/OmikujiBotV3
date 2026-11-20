// packages/2026-Q4/GouseiSuika/main.ts
import App from '@/generator/App.vue'
import { createAppOneSDK } from '@/common/EntryCore/core'
import { definePackage } from '@/register/definePackage'
import { registerStandardRankingComponents } from '@/ui/game/GameRanking/components/standard/register'
import '@assets/styles/DaisyUiObs.css'

definePackage({
  kind: 'gameRanking',
  layout: 'gameRanking',
  loader: () => import('@/layout/common/GameRanking/GameRanking.vue'),
  registerComponents: registerStandardRankingComponents,
})

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountGenerator = () => {
  createAppOneSDK(App)
}
