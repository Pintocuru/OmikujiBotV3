# AGENTS.md

## 作業計画と進捗

### 作業ルール

- `docs/conventions/naming.md` に準拠
- 各変更後に `npm run lint`, `npm run tsc`, `npx vitest run` を実行し確認
- 1タスクずつ実施し、確認完了後に次へ
- `src/types/ui` と `src/types/api` は変更禁止
- `server/presets` の JSON は直接書き換えない
- `dataVersion`: 作業完了前は変更せず、全作業完了後に `3.0000001008` に更新する

---

### タスク進捗

- [x] 2. 小さい修正
  - [x] 2-1. `BotMessageBase.delaySeconds` に min(0) を追加
  - [x] 2-2. ランキング得点の `Number('')` 問題
  - [x] 2-3. `postSystemMessage` の `'__ERROR__'` を廃止
- [x] 3. 機械的な整理
  - [x] 3-1. `src/types` の import 統一
  - [x] 3-2. `src/types/env.ts` の移動・ポート定数の確認
- [ ] 4. 決定済みの設計変更
  - [x] 4-1. timestamp の型をミリ秒の number に統一
  - [x] 4-3. `MetaServiceStatus` と `AppStatus` の区別 (`MetaFetchStatus` 改名)
  - [x] 4-4. `ReactionManager` の型変更
  - [x] 4-5. `naming.md` §7.1 の追加
  - [ ] 4-2. `BotMessageSlotMap` の日本語を i18n に移動 (最後に実施)
- [ ] 7. 最終確認と dataVersion (3.0000001008) の更新

---

### 作業ログ

- 2026-11-07: 4-4 の実装を `work/pre-i18n-cleanup-20261107` で実施。未消費状態を `-1` から `null` に統一し、ReactionTriggerEvaluator の判定も更新。履歴型・getTotal の引数を `YoutubeReactionType` に変更。ReactionTotals は SDK 由来の未知キーを履歴・個別集計から除外し、既知の YouTube リアクションだけを記録する。BurstLevelMachine の状態遷移テストを追加。ローカルの lint / tsc / vitest は未実行のため、4-4 は検証待ち。
- 2026-11-07: 4-5 として `docs/conventions/naming.md` に §7.1（秒数・配列名・空文字・Key/Id・ダミー値・要素単位除外）を追加。
- 2026-11-07: 4-4 のローカル tsc で報告された2件を修正。`ReactionStatsManager.getTotal` の引数を `YoutubeReactionType[]` に揃え、`ReactionTotals.total` の `Object.fromEntries` 初期化結果を `Record<YoutubeReactionType, number>` として型付け。再実行結果は未確認。

- 初期ベースライン確認完了: lint / tsc / vitest (2 passed) 正常終了。
