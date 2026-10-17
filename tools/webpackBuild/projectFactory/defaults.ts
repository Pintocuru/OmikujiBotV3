// tools/webpackBuild/projectFactory/defaults.ts

/** index.html / ConfigMaker のセットは全プロジェクト共通 */
export const DEFAULT_FILES_TO_COPY = [
  { from: 'assets/TemplateEntry/index.html', to: 'index.html' },
  { from: 'assets/TemplateEntry/ConfigMaker.html', to: 'ConfigMaker.html' },
  { from: 'assets/TemplateEntry/script.js', to: 'script.js' },
]

/** OneSDK と おみくじデータ の外部スクリプト読み込みタグ */
export const HTML_SCRIPT_TAGS = `
  <!-- OneSDK (外部読み込み) -->
  <script src="http://localhost:11180/templates/preset/__origin/js/onesdk.js" defer></script>

  <!-- おみくじデータ -->
  <script src="./omikujiData.js" defer></script>
`
