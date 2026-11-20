# OBS 側のサーバーアクセス

OBS のブラウザソースで動く部分（Generator、`src/ui/`、`src/games/`）が、サーバーとどう関わるかの制約です。

## 前提

- OBS 側は、サーバー（わんコメプラグイン / 開発用 Express）がなくても動く。サーバーへの通信は、失敗しても表示を止めず、静かに無視する。
- OBS 側の状態は、UI が持てばよい。OBS をリロードすると消えてよい。

## 必須: ユーザーの得点は、LiveConsole の手動操作だけ

- ユーザーの得点（`update-user-stats` の `addScore`）や、チーム・ピン留めなどの操作結果を変えてよいのは、LiveConsole の手動操作だけ。
- UI・ゲームスクリプト・Generator から、`userStatsApi.updateUserStats` / `resetUserStats` を呼ばない。得点は配信での得点計算に使う手動専用で、おみくじBOT の結果から自動では加算しない。
- 理由: `addScore` には二重加算を防ぐ仕組みがない。OBS のリロードや再送で二重に加算されうる。サーバーがない環境では、加算が黙って失敗する。
- 確認: 依存関係チェック（`ui-no-user-stats-api`）が、`src/ui` / `src/games` / `src/engine` / `src/layout` から `userStatsApi` を import するとエラーにする。Generator は、読み取り（`loadUserStats`）のために import してよい。そのため Generator が書き込みを呼ぶことは、自動では検出できない。レビューで確認する。

## 原則: OBS 側が書くのは、記録（game-log）

- ゲームの結果を残したいときは、ゲームログ（`append-game-log` / `append-game-logs`）に書く。`log.id` で二重を防げるので、再送しても安全。
- ゲームログの `score` は、ランキング・集計用の記録で、ユーザーの得点とは別のもの。ログを書いても、ユーザーの得点は変わらない。
- 結果をユーザーの得点にしたいときは、LiveConsole でログを見ながら、手動で加点する。

### 用語

- 得点: ユーザーの得点（`update-user-stats`）。配信での得点計算に使い、LiveConsole の手動操作だけで変える。
- スコア・ポイント: ゲームログの記録（`GameLog` の `score`、集計の累計ポイント）。ランキング・集計用で、得点とは別のもの。LiveConsole の `GameLog` 画面では、この言葉を使う。

### 現在の例外

- LiverBingo は、LiveConsole との同期のために、ビンゴのカードの写し（`save-bingo-snapshot`）を送り、LiveConsole の命令（`load-bingo-commands`）を取りに行く。表示の同期だけで、サーバーがなければ何もしない。

OBS 側が書き込むものを新しく増やすときは、この文書に例外として書く。

関連: [UI](../architecture/UI.md)、[Console](../architecture/Console.md)、[Server](../architecture/Server.md)
