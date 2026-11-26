# Games

## 役割

Generatorから呼び出されるゲームスクリプト群です。おみくじのステップからゲームスクリプトを実行し、結果に応じたステップやランキングメッセージ、ゲーム状態を返します。

## 構成

- `src/games/scripts/game/`: ゲーム系スクリプト
- `src/games/scripts/tool/`: コメントBOTやランキング等のツール系スクリプト
- `src/games/shared/`: 複数スクリプトで共有する処理
- `src/games/types/GameScriptTypes.ts`: スクリプトの実行契約
- `src/games/types/GameScriptMetaTypes.ts`: 入出力の宣言(`GameScriptMeta`)の型
- `src/games/gameScriptMeta.ts`: 全スクリプトの宣言の一覧(全 `GameScriptKey` に必須)
- `src/games/scripts/**/meta.ts`: スクリプトごとの入出力の宣言
- `src/games/gameScriptRegistry.ts`: スクリプトローダーの登録・取得
- `src/engine/GameScriptPlay/GameScriptManager.ts`: スクリプトの読み込み・実行管理

## 実行の流れ

`src/registerRuntime.ts` などの登録処理で、利用可能なスクリプトの動的ローダーをRegistryに登録します。Generator側の `GameScriptManager` はスクリプトIDからローダーを取得し、初回に読み込んだインスタンスをキャッシュします。

スクリプトは `run` を実装し、`ScriptResult` としてステップ列とランキングメッセージを返します。任意でサンプル実行やゲーム状態取得にも対応します。

ビルドに含まれていないスクリプトIDはデータ不一致として扱われます。

## 入出力の宣言

エディターの設定画面は、スクリプトごとの `meta.ts`(`GameScriptMeta`)から入力欄と「使える変数」を作ります。

- `inputs`: `queryString` の項目ごとの入力欄(`enum` / `number` / `text`)。選択肢や既定値は、`params.ts` の定数を再利用します。
- `outputs`: ゲームが書き込む変数(`perUser: true` のときは、名前の末尾に `_<userId>` が付く)。
- `dynamicOutputs`: 入力値で名前が決まる変数(例: FortuneRanking)。

`queryString` は文字列のままです。入力欄の値は `src/games/shared/queryFields.ts` で `key=value&...` に組み立てます。`URLSearchParams#toString` は使いません。`[[変数名]]` と `<<userId>>` は、実行前に文字列として置換されるため、`%` エンコードせずに保存する必要があります(`% & = +` だけエスケープします)。宣言にないキーは、そのまま残します。

結果の変数は、`variable` ステップ(評価ブロック)として `steps` に含めて返します(`buildVariableStep`)。`GameScriptsHandler` が、スクリプトの実行直後に評価します。ゲームが返すステップでは `<<userId>>` が置換されないので、ユーザー別の変数名はゲーム側で組み立てます。ID が変数名に使えない文字を含むとき(コメントなしを含む)は `test` を使います。

新しいスクリプトを足すときは、`meta.ts` を作って `gameScriptMeta.ts` に登録し、ja / en の文言(`mapText.gameParams` / `mapText.gameOutputs`)を追加します。`gameScriptMeta.test.ts` が、宣言と文言の過不足を検出します。

関連: [Generator](./Generator.md)、[Console](./Console.md)
