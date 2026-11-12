// src/maps/OmikujiData/assets/EnterMotionMap.ts
import type { EnterMotionType } from '@/types/OmikujiData'

/**
 * モーションの動作設定マップ
 */
export const enterMotionMap: Record<EnterMotionType, { initial: string; enter: string; leave: string }> = {
  none: {
    initial: '',
    enter: '',
    leave: '',
  },

  // ─── スライド系 ──────────────────────────────
  slideUp: {
    initial: 'opacity-0',
    enter: 'animate__fadeInUp',
    leave: 'animate__fadeOutUp',
  },
  slideDown: {
    initial: 'opacity-0',
    enter: 'animate__fadeInDown',
    leave: 'animate__fadeOutDown',
  },
  slideLeft: {
    initial: 'opacity-0',
    enter: 'animate__fadeInRight',
    leave: 'animate__fadeOutLeft',
  },
  slideRight: {
    initial: 'opacity-0',
    enter: 'animate__fadeInLeft',
    leave: 'animate__fadeOutRight',
  },

  // ─── 回転・フリップ系 ────────────────────────
  flipInY: {
    initial: 'opacity-0',
    enter: 'animate__flipInY',
    leave: 'animate__flipOutY',
  },
  flipX: {
    initial: 'opacity-0',
    enter: 'animate__flipInX',
    leave: 'animate__flipOutX',
  },
  rotateIn: {
    initial: 'opacity-0',
    enter: 'animate__rotateIn',
    leave: 'animate__rotateOut',
  },

  // ─── 拡大・スケール系 ────────────────────────
  zoomIn: {
    initial: 'opacity-0',
    enter: 'animate__zoomIn',
    leave: 'animate__zoomOut',
  },
  scale: {
    initial: 'opacity-0',
    enter: 'animate__zoomIn',
    leave: 'animate__zoomOut',
  },

  // ─── 弾性・変形系 ────────────────────────────
  bounce: {
    initial: 'opacity-0',
    enter: 'animate__bounceIn',
    leave: 'animate__bounceOut',
  },
  rubberBand: {
    initial: 'opacity-0',
    enter: 'animate__fadeIn animate__rubberBand',
    leave: 'animate__fadeOut',
  },
  jello: {
    initial: 'opacity-0',
    enter: 'animate__fadeIn animate__jello',
    leave: 'animate__fadeOut',
  },

  // ─── フェード ──────────────────────────────
  fade: {
    initial: 'opacity-0',
    enter: 'animate__fadeIn',
    leave: 'animate__fadeOut',
  },
}
