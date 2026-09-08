//
import { DisplayModeType } from '@/types/OmikujiData'

/**
 * displayModes BOTコメント表現方法
 */
export const displayModeMap: Record<DisplayModeType, { label: string; description: string }> = {
  comment: {
    label: 'わんコメでの表示+読み上げ',
    description: 'わんコメのコメント欄への投稿と音声読み上げの両方を行います',
  },
  voice: {
    label: '読み上げのみ',
    description: 'コメント投稿は行わず、音声読み上げのみを行います',
  },
  none: {
    label: 'なし',
    description: 'コメント投稿も音声読み上げも行いません',
  },
}
