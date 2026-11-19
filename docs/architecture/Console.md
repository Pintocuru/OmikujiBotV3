# Console

## 役割

配信中の状態やデータをブラウザから確認・操作するLiveConsoleです。現在の画面は、ポン出し、ユーザー操作、ゲームの記録で構成されています。

## 構成

- 画面: `src/console/LiveConsole.vue`
- エントリーポイント: `src/console/main.ts`
- `src/console/control/EventPads/`: ポン出し操作
- `src/console/control/BingoConsole/`: ビンゴの進行操作
- `src/console/control/UsersConsole/`: ユーザー一覧・ユーザー操作
- `src/console/log/GameLog/`: ゲームログやランキング等の閲覧
- `src/console/common/`・`src/console/types/`: 画面をまたぐ共通部品・型
- `src/console/maps/ConsoleViewMap.ts`: 全画面の表示名・カテゴリ・起動方式
- `src/console/consoleRegistry.ts`: 画面のレジストリ（key → loader）
- `src/register/registerConsoleViews.ts`: 開発用の全部入り登録
- `tools/viteConfig/vite.console.config.ts`: Vite設定

画面はカテゴリ（`control`: 配信中の操作 / `log`: 記録・閲覧 / `game`: ブラウザゲーム）のフォルダに置きます。カテゴリはフォルダ分けだけに使い、フォルダ名は UI（`src/ui`）に合わせて PascalCase、画面の本体は `<フォルダ名>/<フォルダ名>.vue` です。

LiveConsoleはURLのハッシュに選択中の画面を保存し、再読み込み後も同じ画面を開けるようにしています（例: `console.html#gameLog`）。

## 画面の登録

UIの登録（`uiRegistry.ts` と `UiKind`）と同じ考え方です。

- **全画面の定義**: `ConsoleViewMap.ts` に、画面のキー（camelCase）ごとに表示名・カテゴリ・起動方式を書きます。キーの型 `ConsoleViewKey` はここから作られ、タブの並び順もこのマップの順です。
- **loader の登録**: `registerConsoleView` に「キー → loader（動的 import）」を渡します。全画面分は不要で、登録した画面だけがタブに並びます。
- **開発用**: `src/console/main.ts` が `registerAllConsoleViews`（全部入り）を呼びます。
- **配布パッケージ**: `packages/*/console.ts` が、そのパッケージに必要な画面だけを登録します。登録しない画面のコードは配布物に含まれません。

画面を追加するときは、次の3か所に足します。

1. `src/console/<カテゴリ>/<画面名>/` に画面を作る（本体は `<画面名>.vue`）
2. `ConsoleViewMap.ts` に表示名・カテゴリ・起動方式を足す
3. `registerConsoleViews.ts` と、使うパッケージの `console.ts` に loader を足す

### 起動方式（`launch`）

- `embedded`: LiveConsoleのタブとして同じページに表示します。
- `window`: タブ（末尾に ↗）を押すと `window.open` で別ウィンドウを開きます。ブラウザゲームなど、OBSでウィンドウをキャプチャする画面向けです。同じ画面のウィンドウは再利用されます。開いたウィンドウは `console.html#<キー>` で、タブなしにその画面だけを表示します。大きさは `windowSize` で指定できます（既定 1280×720）。

### 注意

- 配布ビルドはコード分割をしない（`codeSplitting: false`）ため、動的 import にしても遅延読み込みにはならず、画面を外す手段は「登録しない」ことだけです。
- 表示名などのマップは全画面分を持つため、登録しない画面の表示名の文字列は配布物に残ります（画面のコードは含まれません）。
- 開発サーバーは全部入りです。配布パッケージと同じ構成で確認したいときは、パッケージの `console.ts` 側の登録で確認してください。

## サーバーとの連携

設定・ユーザー統計・ゲーム状態などのデータ操作はManagerのAPIサービスを通じてサーバーへ送信します。サーバーにはわんコメプラグイン、または開発用Express APIが必要です。

パッケージにConsoleを含めるかどうかは、パッケージプロジェクトの `withConsole` 設定で制御されます。

関連: [Manager](./Manager.md)、[Server](./Server.md)、[Packages](./Packages.md)
