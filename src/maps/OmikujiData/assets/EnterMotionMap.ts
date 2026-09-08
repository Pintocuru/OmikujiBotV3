//
import { EnterMotionConfig, EnterMotionType } from '@/types/OmikujiData'

/**
 * モーションの設定定義マップ
 */
export const enterMotionMap: Record<EnterMotionType, EnterMotionConfig> = {
  none: {
    label: 'なし',
    description: 'アニメーションを行わず即座に表示・非表示を切り替えます',
    initial: '',
    enter: '',
    leave: '',
  },

  // ─── スライド系 ──────────────────────────────
  slideUp: {
    label: '下から上へ',
    description: '画面下部からスライドしながらフェードインします',
    initial: 'opacity-0',
    enter: 'animate__fadeInUp',
    leave: 'animate__fadeOutUp',
  },
  slideDown: {
    label: '上から下へ',
    description: '画面上部からスライドしながらフェードインします',
    initial: 'opacity-0',
    enter: 'animate__fadeInDown',
    leave: 'animate__fadeOutDown',
  },
  slideLeft: {
    label: '右から左へ',
    description: '画面右側から左方向へスライドインします',
    initial: 'opacity-0',
    enter: 'animate__fadeInRight',
    leave: 'animate__fadeOutLeft',
  },
  slideRight: {
    label: '左から右へ',
    description: '画面左側から右方向へスライドインします',
    initial: 'opacity-0',
    enter: 'animate__fadeInLeft',
    leave: 'animate__fadeOutRight',
  },

  // ─── 回転・フリップ系 ────────────────────────
  flipInY: {
    label: 'Y軸フリップ',
    description: '垂直方向の軸を回転しながら立体的に現れます',
    initial: 'opacity-0',
    enter: 'animate__flipInY',
    leave: 'animate__flipOutY',
  },
  flipX: {
    label: 'X軸フリップ',
    description: '水平方向の軸を回転しながら立体的に現れます',
    initial: 'opacity-0',
    enter: 'animate__flipInX',
    leave: 'animate__flipOutX',
  },
  rotateIn: {
    label: '回転しながら現れる',
    description: '中心を軸に回転しながら出現します',
    initial: 'opacity-0',
    enter: 'animate__rotateIn',
    leave: 'animate__rotateOut',
  },

  // ─── 拡大・スケール系 ────────────────────────
  zoomIn: {
    label: '拡大しながら現れる',
    description: '中心からズームインして登場します',
    initial: 'opacity-0',
    enter: 'animate__zoomIn',
    leave: 'animate__zoomOut',
  },
  scale: {
    label: 'スケール拡大',
    description: '徐々に要素全体を拡大させて表示します',
    initial: 'opacity-0',
    enter: 'animate__zoomIn',
    leave: 'animate__zoomOut',
  },

  // ─── 弾性・変形系 ────────────────────────────
  bounce: {
    label: 'バウンスしながら現れる',
    description: '弾むようなリズミカルな動きで登場します',
    initial: 'opacity-0',
    enter: 'animate__bounceIn',
    leave: 'animate__bounceOut',
  },
  rubberBand: {
    label: 'ゴム的変形',
    description: 'ゴムのように伸び縮みしながらアピールするように現れます',
    initial: 'opacity-0',
    enter: 'animate__fadeIn animate__rubberBand',
    leave: 'animate__fadeOut',
  },
  jello: {
    label: 'ゼリー的変形',
    description: 'ゼリーのようにプルプルと揺れながら現れます',
    initial: 'opacity-0',
    enter: 'animate__fadeIn animate__jello',
    leave: 'animate__fadeOut',
  },

  // ─── フェード ──────────────────────────────
  fade: {
    label: 'フェード',
    description: '不透明度が滑らかに変化して現れます',
    initial: 'opacity-0',
    enter: 'animate__fadeIn',
    leave: 'animate__fadeOut',
  },
}
