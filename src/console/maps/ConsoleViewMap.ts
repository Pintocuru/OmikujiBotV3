// src/console/maps/ConsoleViewMap.ts
// LiveConsole の全画面の定義 (UiKind に当たるもの)。画面を足すときは、ここに 1 項目と、src/register/registerConsoleViews.ts に loader を 1 行足す
// タブの並び順は、このマップの並び順 (登録されている画面だけが並ぶ)
import type { ConsoleViewCategory, ConsoleViewMeta } from '@/console/types'

export const consoleViewMap: Record<string, ConsoleViewMeta> = {
  // control: 配信中の操作
  eventPads: { label: 'ポン出し', icon: 'Zap', category: 'control', launch: 'embedded' },
  usersConsole: { label: 'ユーザー操作', icon: 'Users', category: 'control', launch: 'embedded' },
  // log: 記録・閲覧
  gameLog: { label: 'ゲームの記録', icon: 'FileText', category: 'log', launch: 'embedded' },
}

export type ConsoleViewKey = string

export const registerConsoleViewMetadata = (metadata: Record<string, ConsoleViewMeta>) =>
  Object.assign(consoleViewMap, metadata)

/** カテゴリの表示名 (開発版のタブのグループ見出し)。グループの並び順は、このマップの並び順 */
export const consoleCategoryMap = {
  control: '配信中の操作',
  log: '記録・閲覧',
  game: 'ゲーム',
} as const satisfies Record<ConsoleViewCategory, string>

/** 画面の定義を、リテラル型ではなく ConsoleViewMeta として取り出す (launch などを比較できるように) */
export const getConsoleViewMeta = (key: ConsoleViewKey): ConsoleViewMeta => consoleViewMap[key]
