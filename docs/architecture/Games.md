# Games

## 役割

Generatorから呼び出されるゲームスクリプト群です。おみくじのステップからゲームスクリプトを実行し、結果に応じたステップやランキングメッセージ、ゲーム状態を返します。

## 構成

- `src/games/scripts/game/`: ゲーム系スクリプト
- `src/games/scripts/tool/`: コメントBOTやランキング等のツール系スクリプト
- `src/games/shared/`: 複数スクリプトで共有する処理
- `src/games/types/GameScriptTypes.ts`: スクリプトの実行契約
- `src/games/gameScriptRegistry.ts`: スクリプトローダーの登録・取得
- `src/engine/GameScriptPlay/GameScriptManager.ts`: スクリプトの読み込み・実行管理

## 実行の流れ

`src/registerRuntime.ts` などの登録処理で、利用可能なスクリプトの動的ローダーをRegistryに登録します。Generator側の `GameScriptManager` はスクリプトIDからローダーを取得し、初回に読み込んだインスタンスをキャッシュします。

スクリプトは `run` を実装し、`ScriptResult` としてステップ列とランキングメッセージを返します。任意でサンプル実行やゲーム状態取得にも対応します。

ビルドに含まれていないスクリプトIDはデータ不一致として扱われます。

関連: [Generator](./Generator.md)、[Console](./Console.md)
