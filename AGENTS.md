# AGENTS.md

## 命名

- 命名は docs/conventions/naming.md に従うこと(必読)

## 変更

- 変更後は npm run lint と npm run tsc を通すこと


## 作業ログ

- 2026-11-01: `src/editor/sidebar` のチェック完了(`npm run lint` / `npm run tsc` 通過、ブラウザでの動作確認は未実施)。対象外で見つけたもの: `src/editor/types/apps/SidebarType.ts` が命名規則の `*Type.ts` 接尾辞に該当、`ScenarioStepToolbar.vue` の貼り付け失敗で通知が二重に出る
