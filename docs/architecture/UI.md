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

## 登録と表示

`src/registerRuntime.ts` がUI、レイアウト、ゲームスクリプトのローダーを登録します。パッケージ単体では `packages/_shared/` などから必要なUIだけを登録することもできます。

Generatorは設定データの `ui.settings` に有効化されたUIをRegistryから取得して表示します。レイアウトが指定されている場合は、通常の個別UI表示に代えてレイアウトコンポーネントを表示します。

Editor側では `registerUiEditor` に編集画面・プレビュー等を登録します。実際に登録されるUIはパッケージ構成に依存します。

関連: [Generator](./Generator.md)、[Editor](./Editor.md)、[Packages](./Packages.md)
