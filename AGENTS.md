# AGENTS.md

## 命名

- 命名は docs/conventions/naming.md に従うこと(必読)
- ドキュメントの置き場所は docs/conventions/README.md に従うこと(恒久ルールは docs/conventions/、作業指示書は docs/work/)
- 作業はエージェント単体で実施する。エージェントを切り替える場合は、`AGENTS.md` の進捗記録を引き継ぎ、未完了の作業から再開する。

## 作業ログ

- 2026-11-07: `docs/conventions/editor-ui-style.md` と `docs/work/editor-ui-style-work.md` のボタン色ルールを更新。通常操作の基本候補を `btn-secondary` とし、`btn-info` / `btn-accent` / 色クラスなしの `btn` を選択肢に追加。`btn-neutral` は dark 系テーマで背景に埋もれる可能性があるため使用を限定し、light / dark の通常時・ホバー時の視認性確認と、ホバー時に色・明度が変化する要件を明記。専用ブランチ `docs/editor-button-color-guidance` に反映。コード変更・検証は未実施。
