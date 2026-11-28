# 依頼:Public / Private 分離(案B)の実装 第1段階(型の基盤)

## 前提

- 調査報告(Public / Private 分離 影響範囲調査)の方針に従う。案B:Schema も Private に置き、未知の UI / ゲームスクリプトは `string` として通す。
- 報告は端的に(変更内容・例外・未実施のみ)。

## 決定事項(調査報告の質問への回答)

- **Public に残す**
  - UI:`characterStage` / `commentBubble` / `kujibikiPanel` / `gameRanking`
  - games:`tool/CommentBot` / `game/GouseiSuika`
  - console:`control/EventPads` / `control/UsersConsole` / `log/GameLog`
- **Private へ移す**:上記以外の UI・games・console すべて。`lifeHourglass` / `BomberSpin` / `DwarfBomb` / `MultiplyBonanza` / `sesupinTest` を含む。`packages/2026-Q4` 配下は丸ごと Private。
- 未登録 UI のエラー表示はローカライズする。文言は Public 側に置く(Private 翻訳が無くても表示できるように)。
- `markFullBuild`(全部入りの印)は廃止する。データパックも廃止する。**今回の段階では触れない**(下記「今回やらないこと」)。

## 今回やること(調査報告の作業単位 A〜C)

**A. `UiKind` のオープン化**

- `UiSettingsSchema.ts`:`UiKind = KnownUiKind | (string & {})` の形にする。Public に残す4種(上記)は型付きのまま。
- UI 設定は引き続き `.loose()` で、未知のキーは落とさず通す。
- `satisfies Record<UiKind, ...>` を使う箇所のうち、型エラーになるものを `Partial<Record<KnownUiKind, ...>>` などへ直す(registerUi / registerUiEditor / UiKindMap / uiRegistry / uiLayoutMap / UnusedUiSettings など)。**直すのは型だけ。Private UI の import 削除は第2段階。**

**B. `GameScriptKey` のオープン化**

- `GameScriptSchema.ts` と、`Record<GameScriptKey, ...>` を使う箇所(registerGameScripts / gameScriptMeta / GameScriptMap)を、A と同じ方針で型だけ緩める。

**C. `ScenarioStepSchema.ts` の `uiKey` 検証**

- `UiKindSchema`(z.enum)をやめ、`z.string()` にする。
- 既存の「不正な uiKey を commentBubble に戻す」`catch` は外す。未登録かどうかは実行時にレジストリで判定する。
- 未登録 UI は、無表示にせずエラーを表示する。表示用の Vue を用意し、文言は i18n の Public 側に置く(ja / en)。
- generator には i18n を入れない方針のため、generator 側の文言は既存の仕組みに合わせて最小限にする。判断に迷ったら質問する。

## 今回やらないこと

- Private UI の import 削除、`src/ui` / `src/games` / `src/console` の移動。
- i18n の差し込みポイント(registerUiMessages)の追加。
- `markFullBuild` の削除、データパック廃止。
- `packages/` の再編。
- `src/types` の既存ファイルのうち、上記 A〜C に必要なもの以外の編集。

## 完了条件

- Public に残す UI で型チェックが通る(`vue-tsc` 相当)。
- 既存の動作が変わらない(Private UI も、この段階ではまだ同じリポジトリにあり、全部登録されたままで動く)。
- 未登録の `uiKey` を持つデータで、エラー表示が出る(動作確認の手順を報告に書く)。

## 成果物

- A / B / C ごとに .patch(A → B → C の順で適用できること)。
- 例外・未実施・不明点は、報告の末尾にまとめる。
