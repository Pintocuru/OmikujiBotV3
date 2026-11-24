// src/console/maps/ConsoleViewMap.ts
// LiveConsole の全画面の定義 (UiKind に当たるもの)。画面を足すときは、ここに 1 項目と、src/register/registerConsoleViews.ts に loader を 1 行足す
// タブの並び順は、このマップの並び順 (登録されている画面だけが並ぶ)
import type { ConsoleViewCategory, ConsoleViewMeta } from '@/console/types'

export const consoleViewMap = {
  // control: 配信中の操作
  eventPads: { label: 'ポン出し', icon: 'Zap', category: 'control', launch: 'embedded' },
  bingoConsole: { label: 'ビンゴ', icon: 'LayoutGrid', category: 'control', launch: 'embedded' },
  usersConsole: { label: 'ユーザー操作', icon: 'Users', category: 'control', launch: 'embedded' },
  // log: 記録・閲覧
  gameLog: { label: 'ゲームの記録', icon: 'FileText', category: 'log', launch: 'embedded' },
  // game: ブラウザゲーム (OBS でウィンドウをキャプチャするので、別ウィンドウで開く)
  userRace: {
    label: 'ユーザーレース',
    icon: 'Trophy',
    category: 'game',
    launch: 'window',
    windowSize: { width: 960, height: 540 },
  },
  // 盤面は横 11 × 縦 8 マス (1マス 64px = 704×512) + 上部バー 40px。マス数は oshikuraChain/scripts/oshikuraChainConstants.ts (縮尺は画面に合わせて自動)
  oshikuraChain: {
    label: 'おしくらチェイン',
    icon: 'Swords',
    category: 'game',
    launch: 'window',
    windowSize: { width: 704, height: 552 },
  },
  // 盤面は横 12 × 縦 8 マス (1マス 64px = 768×512) + 上部バー 40px。マス数は wordAlchemy/scripts/wordAlchemyConstants.ts
  wordAlchemy: {
    label: '言葉の錬金術',
    icon: 'Sparkles',
    category: 'game',
    launch: 'window',
    windowSize: { width: 768, height: 552 },
  },
} as const satisfies Record<string, ConsoleViewMeta>

export type ConsoleViewKey = keyof typeof consoleViewMap

/** カテゴリの表示名 (開発版のタブのグループ見出し)。グループの並び順は、このマップの並び順 */
export const consoleCategoryMap = {
  control: '配信中の操作',
  log: '記録・閲覧',
  game: 'ゲーム',
} as const satisfies Record<ConsoleViewCategory, string>

/** 画面の定義を、リテラル型ではなく ConsoleViewMeta として取り出す (launch などを比較できるように) */
export const getConsoleViewMeta = (key: ConsoleViewKey): ConsoleViewMeta => consoleViewMap[key]
