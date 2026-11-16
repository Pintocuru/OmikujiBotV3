# UI

## 役割

配信画面に表示するUIコンポーネントと、その表示レイアウトを提供します。コメント吹き出し、ランキング、カウンター、時計、ユーザーボードなどが含まれます。

## 構成

- `src/ui/`: UI本体、各UIのレイアウト、編集画面、プレビュー、関連処理
- `src/layout/`: UIを組み合わせた画面全体のレイアウト
- `src/maps/ui/`: UIごとの表示情報・選択肢などの定義
- `src/types/ui/`: UI設定データのスキーマ・型
- `src/ui/uiRegistry.ts`: Generator側のUI・レイアウト登録先
- `src/editor/ui/uiEditorRegistry.ts`: Editor側のUI編集機能登録先

### 分類の基準

「視聴者が最初に目にする主役は何か」で決める。仕組みや副次機能は基準にしない。
(例: LiveClock はコメントも出すが、主役は時計付きの BOT なので BOT演出)

### フォルダ構成

| フォルダ | 役割 | UI |
|---|---|---|
| `src/ui/bot/` | BOT演出 | CharacterStage / CommentBubble / KujibikiPanel / FlashBanner / ToastWidgets / LiveClock |
| `src/ui/counter/` | 時間・カウンター | StreamCounter / CookieCounter / SnipeTimer / LifeHourglass |
| `src/ui/game/` | ゲーム | DeadAir / LiverBingo / GameRanking |
| `src/ui/user/` | ユーザー | UserBoard / LabelMaker / FlightSeat / LuckyDraw |

- `src/ui/common/` と `src/ui/uiRegistry.ts` は直下に配置。
- 「ユーザーコメント」(`comment/`)は UI が未作成のためフォルダ未作成(最初の UI を作るときに作成)。
- 各 UI フォルダの中身(`components/` `editor/` `composables/` など)は UI ごとに保持。
- 型定義(`src/types/ui/`)は平置きのまま。安定/実験の分類(`uiSchemas.stable.ts` / `uiSchemas.experimental.ts`)はフォルダに持ち込まない。

## 登録と表示

`src/registerRuntime.ts` がUI、レイアウト、ゲームスクリプトのローダーを登録します。パッケージ単体では `packages/_shared/` などから必要なUIだけを登録することもできます。

Generatorは設定データの `ui.settings` に有効化されたUIをRegistryから取得して表示します。レイアウトが指定されている場合は、通常の個別UI表示に代えてレイアウトコンポーネントを表示します。

Editor側では `registerUiEditor` に編集画面・プレビュー等を登録します。実際に登録されるUIはパッケージ構成に依存します。

関連: [Generator](./Generator.md)、[Editor](./Editor.md)、[Packages](./Packages.md)
