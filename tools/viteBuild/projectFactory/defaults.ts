// tools/viteBuild/projectFactory/defaults.ts

/**
 * プロジェクト共通セット
 **/
export const DEFAULT_FILES_TO_COPY = [
  { from: 'assets/entry/index.html', to: 'index.html' },
  { from: 'assets/entry/script.js', to: 'script.js' },
  { from: 'assets/sounds/core/', to: 'sounds/core/' },
]

/**
 * エディターを同梱するパッケージだけに足すファイル
 **/
export const EDITOR_FILES_TO_COPY = [{ from: 'assets/entry/editor.html', to: 'editor.html' }]

/**
 * LiveConsole (console.ts) を同梱するパッケージだけに足すファイル
 **/
export const CONSOLE_FILES_TO_COPY = [{ from: 'assets/entry/console.html', to: 'console.html' }]
