// src/maps/OmikujiData/assets/OmikujiItemKindMap.ts
import { DisplayMetaLucide } from '@/common/LucideIcon/DisplayMetaLucide'
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
import { OmikujiControlCommand, OmikujiItemKind } from '@/types/OmikujiData'
import { DisplayMeta } from '@/types/core'

/**
 * omikujiItemKinds カテゴリのUI表示情報
 */
export const omikujiItemKindMap: Record<OmikujiItemKind, DisplayMetaLucide> = {
  steps: {
    label: 'シナリオ',
    description: '下記の内容をわんコメやジェネレーターで表示します',
    icon: 'Bot',
  },
  control: {
    label: '処理を制御する',
    description: 'シナリオを行わず、処理の流れを制御します。',
    icon: 'CornerDownLeft',
  },
}

/**
 * omikujiItemKinds カテゴリの表示メタ情報
 */
export const omikujiItemKindMetaMap: Record<OmikujiItemKind, DisplayMeta> = {
  steps: {
    label: 'シナリオ',
    description: '下記の内容をわんコメやジェネレーターで表示します',
  },
  control: {
    label: '処理を制御する',
    description: 'シナリオを行わず、処理の流れを制御します。',
  },
}

/**
 * omikujiItemKinds カテゴリのアイコン
 */
export const omikujiItemKindIcons: Record<OmikujiItemKind, LucideIconName> = {
  steps: 'Bot',
  control: 'CornerDownLeft',
}

/**
 * control の command ごとのUI表示情報
 */
export const omikujiControlCommandMap: Record<OmikujiControlCommand, DisplayMetaLucide> = {
  return: {
    label: '処理を終了する(return)',
    description: 'シナリオを行わず、このイベントで処理を終了します。',
    icon: 'CornerDownLeft',
  },
  continue: {
    label: '次のイベントへ進む(continue)',
    description: 'シナリオを行わず、次のイベントへ処理を進めます。',
    icon: 'ArrowRight',
  },
}

/**
 * control の command ごとの表示メタ情報
 */
export const omikujiControlCommandMetaMap: Record<OmikujiControlCommand, DisplayMeta> = {
  return: {
    label: '処理を終了する(return)',
    description: 'シナリオを行わず、このイベントで処理を終了します。',
  },
  continue: {
    label: '次のイベントへ進む(continue)',
    description: 'シナリオを行わず、次のイベントへ処理を進めます。',
  },
}

/**
 * control の command ごとのアイコン
 */
export const omikujiControlCommandIcons: Record<OmikujiControlCommand, LucideIconName> = {
  return: 'CornerDownLeft',
  continue: 'ArrowRight',
}
