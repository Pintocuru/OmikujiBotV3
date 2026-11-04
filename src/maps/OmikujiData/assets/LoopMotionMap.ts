// src/maps/OmikujiData/assets/LoopMotionMap.ts
import type { LoopMotionType } from '@/types/OmikujiData'

/**
 * ループモーションの動作設定マップ
 */
export const loopMotionMap: Record<LoopMotionType, string> = {
  none: '',
  bounce: 'animate__bounce',
  shake: 'animate__shakeX',
  swing: 'animate__swing',
  wobble: 'animate__wobble',
  rotate: 'anim__rotate',
  rotateR: 'anim__rotateR',
  rubberBand: 'animate__rubberBand',
  jello: 'animate__jello',
  tilt: 'anim__tilt',
  headShake: 'anim__headShake',
  pulse: 'animate__pulse',
  flash: 'animate__flash',
  tada: 'animate__tada',
  combo: 'anim__combo',
  joyful: 'anim__joyful',
  gentle: 'anim__gentle',
}
