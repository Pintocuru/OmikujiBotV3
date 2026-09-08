//
import { PostFlowKind } from '@/types/OmikujiData'

/**
 * アクション種別のUI表示マップ (Lucide Icon名を含む)
 */
export const postFlowKindMap: Record<PostFlowKind, { label: string; description: string; icon: string }> = {
  message: {
    label: 'メッセージ',
    description: 'わんコメやジェネレーターに送信・表示するテキストを設定します',
    icon: 'MessageSquare',
  },
  sound: {
    label: 'サウンド',
    description: 'アクション実行時に再生する効果音やBGMを設定します',
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
  bot: {
    label: 'BOTちゃん',
    description: 'BOTキャラクターの立ち絵や表情・吹き出しの設定を変更します',
    icon: 'Bot',
  },
  flowCall: {
    label: 'アクションセット',
    description: '登録済みのアクションセット（一連の処理プリセット）を呼び出します',
    icon: 'MessagesSquare',
  },
}
