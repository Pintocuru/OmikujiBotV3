// src/maps/OmikujiData/assets/PostFlowKindMap.ts
import { DisplayMetaLucide } from '@/common/LucideIcon/DisplayMetaLucide'
import { PostFlowKind } from '@/types/OmikujiData'

/**
 * シナリオ種別のUI表示マップ
 */
export const postFlowKindMap: Record<PostFlowKind, DisplayMetaLucide> = {
  message: {
    label: 'メッセージ',
    description: 'わんコメやジェネレーターに送信・表示するテキストを設定します',
    icon: 'MessageSquare',
  },
  sound: {
    label: 'サウンド',
    description: 'シナリオ実行時に再生する効果音やBGMを設定します',
    icon: 'Volume2',
  },
  wordParty: {
    label: 'WordParty',
    description: 'わんコメの WordParty 演出を呼び出します',
    icon: 'PartyPopper',
  },
  variable: {
    label: '評価ブロック',
    description: '変数の代入や計算・スクリプト評価処理を実行します',
    icon: 'Brackets',
  },
  gameScript: {
    label: 'ゲームスクリプト',
    description: '予め作成されたゲームを呼び出します',
    icon: 'Gamepad2',
  },
  flowCall: {
    label: 'シナリオ',
    description: '登録済みのシナリオ（一連の処理プリセット）を呼び出します',
    icon: 'MessagesSquare',
  },
}
