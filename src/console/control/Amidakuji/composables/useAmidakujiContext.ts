// src/console/control/Amidakuji/composables/useAmidakujiContext.ts
// Amidakuji.vue が作った状態を、子コンポーネントが inject で受け取る (props・emit の素通しをなくす)
import { inject, provide, watch, type InjectionKey } from 'vue'
import { FOLLOW_ZOOM } from '../scripts/amidakujiConstants'
import { useAmidakuji } from './useAmidakuji'
import { useLadderView } from './useLadderView'

export const createAmidakujiContext = () => {
  const core = useAmidakuji()
  const view = useLadderView()

  // 一人ずつ辿るあいだは拡大して追い、辿り終えたら全体表示に戻す
  watch(core.anim.followIndex, (idx) => {
    if (idx === null) view.resetView()
    else view.zoomTo(FOLLOW_ZOOM)
  })

  return { ...core, view }
}

export type AmidakujiContext = ReturnType<typeof createAmidakujiContext>

const KEY: InjectionKey<AmidakujiContext> = Symbol('amidakuji')

export const provideAmidakuji = (ctx: AmidakujiContext) => provide(KEY, ctx)

export const useAmidakujiContext = (): AmidakujiContext => {
  const ctx = inject(KEY)
  if (!ctx) throw new Error('[Amidakuji] provideAmidakuji() の外で useAmidakujiContext() が呼ばれました')
  return ctx
}
