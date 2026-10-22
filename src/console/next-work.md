# 次回の作業メモ(型の大改修 / games の修正 / src/types/generator への移動)

作成: 2026-10-22 / 前提: ゲームログ保存 API は実装済み(`console.md` を参照)

## 0. 現状

- `BotMessageExtraSchema` と `_BotMessageSchema` は未変更。ランキング専用の `BotMessageRankingSchema` を新設済みだが、union にはまだ入れていない。
- `GameRanking` は、Extra を `scripts/toRankingMessage.ts` で変換して保存している(つなぎの処理)。
- `src/games` の各所には `TODO(LiveConsole)` コメントを入れてある。`grep -rn "TODO(LiveConsole)" src` で一覧できる。

## 1. 作業A: `_BotMessageSchema` の大改修

### 課題

- `ExtraListsSchema` が汎用で optional だらけ。`score` や `user` が型で保証されず、`RankingMessage.ts` を読まないと仕様がわからない。
- 既存の `type: 'extra'` には、おみくじ側(`BotMessageHelpers.createRankingMessage`)と games 側(`buildBotMessageRanking`)の2系統が混在している。

### 方針案

- `BotMessageRankingSchema`(`type: 'ranking'`)を `_BotMessageSchema` の union に加える。
- 影響を確認する箇所: `type` で分岐しているコード。`BotMessageType` を使う19ファイルが対象。
  - `src/editor/helpers/useTestPost.ts`
  - `src/engine/GameScriptPlay`、`src/engine/OmikujiResult`
  - `src/generator/scripts/EventProcess`、`src/generator/stores/useBotMessageActions.ts`
  - `src/ui/KujibikiPanel/layouts`、`src/ui/ToastWidgets/editor`、`src/ui/common`
- `extra` を残すか廃止するかを決める。他のパッケージが依存しているため、まず残して併存させ、移行後に廃止を検討する。

### 決めること

- [ ] おみくじ側のランキング(`createRankingMessage`)も `ranking` に寄せるか。それとも games 専用にするか。
- [ ] 表示用の項目(`listName`、`symbol`、`text`、`variant`、`isVisible`、`isUnique`)を、`ranking` に持たせるか。持たせる場合は、必須にするものとデフォルト値で済ませるものを分ける。
- [ ] `slots` を `ranking` に含めるか。

## 2. 作業B: `src/games` の修正

- 対象: `BomberSpin`、`DwarfBomb`、`GouseiSuika`、`HugEmAll`、`MultiplyBonanza`、`GoogolClover`(`sub/resultBuilder.ts` を含む)、`scriptsEngine/RankingMessage/RankingMessage.ts`。`FortuneRanking` は `botMessageExtras: []` なので対象外。
- 内容:
  - `buildBotMessageRanking` を、`BotMessageRankingType` を返す関数に置き換える。
  - `ScriptResult.botMessageExtras`(`src/games/types/GameScriptTypes.ts`)の型を見直す。
  - `GameScriptsHandler` から `BotMessageType[]` に流れる経路を確認する。
- 完了後:
  - `GameRanking` の `toRankingMessage.ts` を、不要になった部分だけ削除する。
  - `GameRanking` の表示側(`layouts` 配下)を、`ranking` 型に対応させる。
  - 各所の `TODO(LiveConsole)` を消す。

## 3. 作業C: `src/generator/types` → `src/types/generator` への移動

- 移動するファイル: `scripts/`(`BotMessageSchema.ts`、`BotMessageRankingSchema.ts`、`OmikujiResultTypes.ts`、`UserVisits.ts`)と `stores/`(`MetaState.ts`、`ReactionManager.ts`)。
- `@/generator/types` を import しているのは37ファイル(`engine`、`games`、`generator`、`ui`、`editor`、`common` にまたがる)。
- 手順案:
  1. `git mv` で移動し、`src/types/index.ts` の公開に `generator` を加える(他の `src/types/*` の並びに合わせる)。
  2. import を機械的に置換する(`@/generator/types` → `@/types/generator`)。
  3. `vue-tsc --noEmit`、`vitest run`、`eslint` で確認する。
- 決めること:
  - [ ] `stores/` の型も一緒に移すか。ストア専用の型なので `src/generator` に残す選択肢もある。
  - [ ] 旧パスの再エクスポートを一時的に残すか。他のパッケージが依存している場合は、残して段階的に移すのが安全。

## 4. 進める順番(案)

1. **作業C(移動)を先に行う。** 差分が機械的で、型チェックで漏れを検出できる。後の作業の差分が読みやすくなる。
2. **作業A(型の改修)。** union に `ranking` を加え、分岐箇所を直す。
3. **作業B(games)。** 各ゲームを移行し、つなぎの変換を削除する。

作業ごとに別コミットにする。

## 5. 確認コマンド

```
npx vue-tsc --noEmit -p tsconfig.json
npx vitest run
npx eslint src server
grep -rn "TODO(LiveConsole)" src
```
