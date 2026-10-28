// tools/viteBuild/projectFactory/defaults.ts

/**
 * プロジェクト共通セット
 **/
export const DEFAULT_FILES_TO_COPY = [
  { from: 'assets/TemplateEntry/index.html', to: 'index.html' },
  { from: 'assets/TemplateEntry/editor.html', to: 'editor.html' },
  { from: 'assets/TemplateEntry/script.js', to: 'script.js' },
  { from: 'assets/sounds/', to: 'assets/sounds/' },
]

/**
 * LiveConsole (console.ts) を同梱するパッケージだけに足すファイル
 **/
export const CONSOLE_FILES_TO_COPY = [{ from: 'assets/TemplateEntry/console.html', to: 'console.html' }]
