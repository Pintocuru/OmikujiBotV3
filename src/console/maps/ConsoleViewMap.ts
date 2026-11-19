// src/console/maps/ConsoleViewMap.ts
// LiveConsole の全画面の定義 (UiKind に当たるもの)。画面を足すときは、ここに 1 項目と、src/register/registerConsoleViews.ts に loader を 1 行足す
// タブの並び順は、このマップの並び順 (登録されている画面だけが並ぶ)
import type { ConsoleViewMeta } from '@/console/types'

export const consoleViewMap = {
  // control: 配信中の操作
  eventPads: { label: 'ポン出し', category: 'control', launch: 'embedded' },
  bingoConsole: { label: 'ビンゴ', category: 'control', launch: 'embedded' },
  usersConsole: { label: 'ユーザー操作', category: 'control', launch: 'embedded' },
  // log: 記録・閲覧
  gameLog: { label: 'ゲームの記録', category: 'log', launch: 'embedded' },
} as const satisfies Record<string, ConsoleViewMeta>

export type ConsoleViewKey = keyof typeof consoleViewMap

/** 画面の定義を、リテラル型ではなく ConsoleViewMeta として取り出す (launch などを比較できるように) */
export const getConsoleViewMeta = (key: ConsoleViewKey): ConsoleViewMeta => consoleViewMap[key]
