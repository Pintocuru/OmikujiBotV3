// src/console/types/ConsoleView.ts

/** 画面のカテゴリ。フォルダ分けに使う (control: 配信中の操作 / log: 記録・閲覧 / game: ブラウザゲーム) */
export type ConsoleViewCategory = 'control' | 'log' | 'game'

/**
 * 画面の起動方式
 * - embedded: LiveConsole のタブとして、同じページに表示する
 * - window: タブを押すと別ウィンドウ(window.open)で開く。OBS でウィンドウをキャプチャするゲーム向け
 */
export type ConsoleViewLaunch = 'embedded' | 'window'

/** 画面の表示名・カテゴリ・起動方式 (ConsoleViewMap.ts で全画面分を定義する) */
export type ConsoleViewMeta = {
  label: string
  category: ConsoleViewCategory
  launch: ConsoleViewLaunch
  /** launch が window のときのウィンドウの大きさ(px)。省略時は 1280×720 */
  windowSize?: { width: number; height: number }
}
