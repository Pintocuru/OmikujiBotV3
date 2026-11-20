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
  // game: ブラウザゲーム (OBS でウィンドウをキャプチャするので、別ウィンドウで開く)
  userRace: { label: 'ユーザーレース', category: 'game', launch: 'window', windowSize: { width: 960, height: 540 } },
  // 盤面は横 11 × 縦 8 マス (1マス 64px = 704×512) + 上部バー 40px。マス数は NuisanceSurvival/scripts/nuisanceConstants.ts (縮尺は画面に合わせて自動)
  nuisanceSurvival: {
    label: '邪魔者サバイバル',
    category: 'game',
    launch: 'window',
    windowSize: { width: 704, height: 552 },
  },
} as const satisfies Record<string, ConsoleViewMeta>

export type ConsoleViewKey = keyof typeof consoleViewMap

/** 画面の定義を、リテラル型ではなく ConsoleViewMeta として取り出す (launch などを比較できるように) */
export const getConsoleViewMeta = (key: ConsoleViewKey): ConsoleViewMeta => consoleViewMap[key]
