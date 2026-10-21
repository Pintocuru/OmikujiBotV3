// src/maps/OmikujiData/assets/OmikujiItemKindMap.ts
import { DisplayMetaLucide } from '@/editor/types/DisplayMeta'
import { OmikujiControlCommand, OmikujiItemKind } from '@/types/OmikujiData'

/**
 * omikujiItemKinds カテゴリのUI表示情報
 */
export const omikujiItemKindMap: Record<OmikujiItemKind, DisplayMetaLucide> = {
  postFlow: {
    label: 'BOTアクション',
    description: '下記の内容をわんコメやジェネレーターで表示します',
    icon: 'Bot',
  },
  control: {
    label: '処理を制御する',
    description: 'BOTアクションを何もせず、処理の流れを制御します。',
    icon: 'CornerDownLeft',
  },
}

/**
 * control の command ごとのUI表示情報
 */
export const omikujiControlCommandMap: Record<OmikujiControlCommand, DisplayMetaLucide> = {
  return: {
    label: '処理を終了する(return)',
    description: 'BOTアクションを何もせず、このイベントで処理を終了します。',
    icon: 'CornerDownLeft',
  },
  continue: {
    label: '次のイベントへ進む(continue)',
    description: 'BOTアクションを何もせず、次のイベントへ処理を進めます。',
    icon: 'ArrowRight',
  },
}
