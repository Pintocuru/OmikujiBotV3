// src/maps/OmikujiData/assets/OmikujiItemKindMap.ts
import { OmikujiItemKind } from '@/types/OmikujiData'

/**
 * omikujiItemKinds カテゴリのUI表示情報
 */
export const omikujiItemKindMap: Record<OmikujiItemKind, { label: string; description: string; icon: string }> = {
  postFlow: {
    label: 'BOTアクション',
    description: '下記の内容をわんコメやジェネレーターで表示します',
    icon: 'Bot',
  },
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
  reset: {
    label: 'おみくじ回数をリセットする(reset)',
    description: 'おみくじの抽選回数をリセットします。',
    icon: 'RotateCcw',
  },
  log: {
    label: 'ユーザー状態を出力する(logUserState)',
    description: 'コメントをしたユーザーの情報を、わんコメのコメントとして出力します。',
    icon: 'FileText',
  },
}
