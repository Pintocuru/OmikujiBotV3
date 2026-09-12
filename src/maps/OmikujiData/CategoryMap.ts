// src/maps/OmikujiData/CategoryMap.ts
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
import { CategoryType } from '@/types/OmikujiData'

// Map定義 (Lucide Icon名を含む)
export const categoryMap: Record<CategoryType, { label: string; description: string; icon: LucideIconName }> = {
  jsonMerge: {
    label: 'JSONマージ(Dev)',
    description: 'ビルド時、jsonファイルをマージして出力します',
    icon: 'Layers',
  },
  comments: {
    label: 'コメントイベント',
    description: 'チャット内容やユーザー情報を基におみくじを発動します',
    icon: 'MessageSquare',
  },
  timers: {
    label: 'タイマーイベント',
    description: '指定した時間経過で、自動的におみくじを発動します',
    icon: 'Timer',
  },
  services: {
    label: '配信数値イベント',
    description: '配信の視聴数・高評価の変動でおみくじを発動します',
    icon: 'ThumbsUp',
  },
  reactions: {
    label: 'リアクションイベント(Youtube)',
    description: '視聴者のリアクション（❤ 😄 🎉 😳 💯）でおみくじを発動します',
    icon: 'Smile',
  },
  box: {
    label: 'みくじ箱',
    description: 'おみくじの内容を作成します',
    icon: 'Package',
  },
  actions: {
    label: 'アクションセット',
    description: 'BOTのコメント・WordPartyの指定のプリセットを作成します',
    icon: 'Zap',
  },
  placeholders: {
    label: 'プレースホルダー',
    description: 'コメントやタイマーで利用できる、高性能なプレースホルダーを設定します',
    icon: 'Brackets',
  },
  characters: {
    label: 'キャラクター',
    description: 'BOTメッセージのキャラクターや吹き出し・トーストの色を設定します',
    icon: 'Users',
  },
  ui: {
    label: 'アイテム',
    description: 'ジェネレーターで表示できる、アイテムの設定を行います',
    icon: 'LayoutGrid',
  },
  appInfo: {
    label: 'アプリ情報',
    description: 'ライセンスや使用できる機能を確認できます',
    icon: 'Info',
  },
}
