//
import { LoopMotionType } from '@/types/OmikujiData'

// Map定義
export const loopMotionMap: Record<LoopMotionType, { label: string; description: string; variant: string }> = {
  none: {
    label: 'なし',
    description: 'ループアニメーションを適用しません',
    variant: '',
  },
  bounce: {
    label: 'バウンド',
    description: '上下に跳ね続けるアニメーション',
    variant: 'animate__bounce',
  },
  shake: {
    label: '小刻みシェイク',
    description: '左右に小刻みに揺れるアニメーション',
    variant: 'animate__shakeX',
  },
  swing: {
    label: '左右揺れ',
    description: 'ブランコのように左右に振れるアニメーション',
    variant: 'animate__swing',
  },
  wobble: {
    label: '大きく揺れ',
    description: '全体が大きくゆがみながら揺れるアニメーション',
    variant: 'animate__wobble',
  },
  rotate: {
    label: '回転（時計回り）',
    description: '時計回りに回転し続けるアニメーション',
    variant: 'anim__rotate',
  },
  rotateR: {
    label: '逆回転',
    description: '反時計回りに回転し続けるアニメーション',
    variant: 'anim__rotateR',
  },
  rubberBand: {
    label: 'ゴムバンド',
    description: 'ゴムのように伸び縮みするアニメーション',
    variant: 'animate__rubberBand',
  },
  jello: {
    label: 'ゼリー',
    description: 'ゼリーのようにぷるぷると揺れるアニメーション',
    variant: 'animate__jello',
  },
  tilt: {
    label: '傾き',
    description: '左右に少し傾き続けるアニメーション',
    variant: 'anim__tilt',
  },
  headShake: {
    label: '首振り',
    description: '首を横に振るようなアニメーション',
    variant: 'anim__headShake',
  },
  pulse: {
    label: '点滅',
    description: 'ゆっくりと拡大縮小・明滅を繰り返すアニメーション',
    variant: 'animate__pulse',
  },
  flash: {
    label: '高速明滅',
    description: '素早く点滅を繰り返すアニメーション',
    variant: 'animate__flash',
  },
  tada: {
    label: 'タダ！',
    description: '強調してアピールするように揺れるアニメーション',
    variant: 'animate__tada',
  },
  combo: {
    label: 'よろこび',
    description: '喜びを表現する複合的なループアニメーション',
    variant: 'anim__combo',
  },
  joyful: {
    label: 'ぴょこぴょこ',
    description: '楽しそうにぴょこぴょこと動くアニメーション',
    variant: 'anim__joyful',
  },
  gentle: {
    label: 'ゆったり（呼吸）',
    description: '深呼吸のようにゆったりと拡大縮小するアニメーション',
    variant: 'anim__gentle',
  },
}
