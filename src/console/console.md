# LiveConsole 仕様メモ

最終更新: 2026-10-22 / ステータス: ゲームログ保存 API を実装済み。LiveConsole 本体は未実装

## 1. 位置づけ

- 名前: **LiveConsole**(ディレクトリ: `src/console`)
- ゲームデータの閲覧と、配信中の操作をまとめるコンポーネント。
- **プラグイン(サーバ)が必須**。サーバがないと API を受け取れないため、サーバなしでも動く editor とは分離し、新規 html として作成する。
- 将来、次の責務も持たせる。
  - コメントしたユーザーを OBS 上に掲載し、ポイントを加算する。
  - わんコメの機能で遊ぶ「ポン出し機能」。
- これらは editor の役目ではない、という判断。

## 2. ゲームログの保存(実装済み)

- ランキングに関係するデータ(`BotMessageExtraType`)を受け取るたびに、`GameRanking.vue` が API でログを1件追記する。
- 保存するのは `GameLogSchema` の形。1配信につき1ファイル(`server/streams/<streamId>.json`)で、eventKey ごとに state を持つ。
- streamId は起動時に日時で作る(例: `20261020-2130`)。OBS のリロードで別ファイルになるのは許容する。
- 保存は1件ずつ直列で行う。サーバがない場合は、表示に影響させず警告だけ出す。

### API

- `append-game-log`(POST): `{ streamId, eventKey, log }`
  - `logs` に追記し、`userMap`(回数・累計ポイント・自己ベスト)をサーバ側で更新する。
  - 同じ `log.id` は無視する(レスポンスの `appended` が `false`)。
  - `totalWins` は、ランキングでは勝敗を使わないため更新しない。
- `save-game-state` は削除した。他の UI ができたときに、新しい API を作る方針。
- `list-game-states` / `load-game-state` / `delete-game-state` は残している。LiveConsole の閲覧で使う想定。

### BotMessageExtraType → GameLog の対応

| GameLog | 取得元 |
| --- | --- |
| `id` | メッセージの `id`(重複保存の防止にも使う) |
| `userId` | `user.userId`(`user` が無い、または空のメッセージは保存しない) |
| `score` | `lists.order`(`lists.text` は表示用の文字列なので使わない) |
| `createdAt` | `timestamp` |
| `item` / `flag` | ランキングでは未使用のため保存しない |
| eventKey(振り分け) | `source.eventKey` |

- 上限(`maxDraws`)は廃止した。制限なし。

## 3. 型

- `BotMessageExtraSchema` と `_BotMessageSchema` は**変更していない**(他のパッケージが依存しているため)。
- ランキング専用の `BotMessageRankingSchema` を新設した(`src/generator/types/scripts/BotMessageRankingSchema.ts`)。`eventKey`・`user.userId`・`score` を必須にしている。`_BotMessageSchema` の union には**まだ加えていない**。
- 現在は `src/ui/GameRanking/scripts/toRankingMessage.ts` が Extra から変換している。
- `src/generator/types` から `src/types/generator` への移動は、後で行う。

## 4. GameRanking の scripts

- 削除: `execute.ts`、`types.ts`、`services/UserStatsService.ts`(統計の更新はサーバ側に移した)。
- 追加: `toRankingMessage.ts`(変換)、`useGameLogSaver.ts`(保存)。
- `services/MessageService.ts` は残している。GameRanking 内でのみ表示するメッセージとして使う予定で、現在はどこからも呼ばれていない。他の UI には渡さない。

## 5. TODO

型の大改修・games の修正・`src/types/generator` への移動は、次回の作業として `next-work.md` にまとめた。

- [ ] `src/games` の各ゲームを `BotMessageRankingType` を直接返す形に移行する(各 `execute.ts`、`GoogolClover/sub/resultBuilder.ts`、`scriptsEngine/RankingMessage/RankingMessage.ts` に TODO コメントを入れた)。移行後に union への追加を検討する。
- [ ] `src/engine/OmikujiResult/BotMessageHelpers.ts` の `createRankingMessage` も Extra を返している(おみくじ側のランキング)。games の移行と合わせて検討する。
- [ ] `src/generator/types` → `src/types/generator` への移動。
- [ ] 保存に失敗したログの再送。
- [ ] `MessageService` の表示(GameRanking 内のみ)。
- [ ] LiveConsole 本体(閲覧、OBS 掲載とポイント加算、ポン出し)。
