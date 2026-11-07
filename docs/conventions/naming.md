# 命名規則指示書 — OmikujiBotV3(Vue 3 + TypeScript)

この文書は、新規ファイル作成・リネーム・生成AIへの依頼時の**唯一の命名基準**とする。

## 0. 前提

- Vue 3 + TypeScript(`type: module`)、Vue SFC を使用。
- 原則: **「同じディレクトリ内で同じ役割のファイルは、同じ命名パターンにする」**。この原則に反する場合、個別の好みより優先する。
- 既存ファイルとの整合が取れる場合を除き、本規則に合わせてリネームを行う。変更が多くなることは許容する。
- **ファイル先頭のパスコメント(`// src/xxx/yyy.ts`)は一切無視してよい**。内容の誤記・古さの指摘や、移動・リネームに伴う更新は不要(作者の独自ツールで一括修正するため)。

## 1. ケーススタイル定義

| 名称            | 形式                     | 例                                             |
| --------------- | ------------------------ | ---------------------------------------------- |
| PascalCase      | 各単語先頭大文字         | `UserStatsManager.ts`                          |
| camelCase       | 先頭小文字・以降大文字   | `getAvatarUrl.ts`                              |
| kebab-case      | 全小文字・ハイフン区切り | `user-profile.vue`(本プロジェクトでは使わない) |
| SCREAMING_SNAKE | 全大文字・アンダースコア | `APP_CONFIG`(ファイル名では使わない)           |

## 2. ファイル種別ごとの規則

### 2.1 Vue コンポーネント(`.vue`)— **PascalCase 固定**

- コンポーネント名は **PascalCase 1〜2語を基本**とする。3語以上になる場合はディレクトリで文脈を補う。
  - 良: `EmotionGrid.vue` / `NavigationSidebar.vue`
  - 不可: `faceCutout.vue` / `flower.vue`(小文字開始は禁止)
- レイアウトバリエーション も PascalCase のまま(`Sakura.vue`, `Tarot.vue`)。
- **`use` プレフィックスの `.vue` は作らない**。逆に、`composables/` ディレクトリに `.vue` を置かない。
- エントリポイントのみ慣例名を許可: `App.vue` / `main.ts`。
- 画面・ページとしての `.vue` には `View` / `App` / `Editor` など役割が分かる語を付ける(`DataManager.vue` → `ManagerView.vue` 等)。**`.vue` に `Manager` を付けない**(Manager はクラスの名称として定義済み)。

### 2.2 TypeScript ファイル — エクスポート内容で判断

| エクスポートするもの                         | ケース                                      | 例                                      |
| -------------------------------------------- | ------------------------------------------- | --------------------------------------- |
| クラス(`class X`)                            | PascalCase                                  | `CharacterResolver.ts`                  |
| 定数オブジェクト・設定まとめ                 | PascalCase                                  | `MockConstants.ts`                      |
| 関数・関数群(default export 関数含む)        | camelCase                                   | `getAvatarUrl.ts` / `summarizeState.ts` |
| Zod スキーマ・型定義のみ                     | `*Schema.ts` に統一                         | `CharacterSchema.ts`                    |
| 純粋な型(`type` / `interface`)のみのファイル | 型名の PascalCase、または `types.ts` に集約 | `TriggerCondition.ts`                   |
| コンポーザブル                               | `use` + PascalCase                          | `useEmotionDraft.ts`                    |
| barrel(再エクスポート専用)                   | **`index.ts` 固定**                         | `index.ts`                              |

- **接尾辞の乱立を禁止**: `*Type.ts` / `*Types.ts` / `types.ts` / 接尾辞なしを混在させない。
  - Zod スキーマを含む or スキーマに対応する型 → `*Schema.ts`
  - 複数型の集約 → そのディレクトリの `types.ts` または上位の `index.ts`
  - 既存の `presetsImportType.ts` / `keyEditorTypes.ts` / `shellTypes.ts` / `counterTypes.ts` は上記へ統合する。

### 2.3 CSS ファイル — kebab-case

- `animations.css` の形式を踏襲。新規 CSS は kebab-case。

### 2.4 テストファイル — 対象名 + `.test.ts`

- `resolveStageSlots.test.ts` の形式を踏襲(`*.spec.ts` は使わない)。

## 3. ディレクトリ規則

### 3.1 名前ごとの役割

以下は `src/` 配下の各階層で使う名前の規則。存在する階層はディレクトリにより異なる(例: `stores/` は `editor/` `generator/` `manager/` にある)。

| ディレクトリ   | 役割                          | 中のファイル                           |
| -------------- | ----------------------------- | -------------------------------------- |
| `components/`  | 再利用可能なコンポーネント    | PascalCase `.vue`                      |
| `components/<セット名>/` | UI 内の表示コンポーネントセット | `register.ts` / PascalCase `.vue` |
| `composables/` | `use*` 関数のみ               | `useXxx.ts` のみ(`.vue` 禁止)          |
| `layout/`      | 見た目のバリエーション(`src/layout/`) | PascalCase `.vue`                |
| `stores/`      | Pinia Store(`useXxxStore.ts`) | `useXxxStore.ts`                       |
| `types/`       | 型定義                        | `*Schema.ts` / `types.ts` / `index.ts` |
| `scripts/`     | スクリプト・関数群            | camelCase                              |
| `services/`    | API クライアント等            | camelCase(`configApi.ts` 形式)         |
| `maps/`        | 対応表データ                  | PascalCase(`XxxMap.ts`)                |
| `helpers/`     | 汎用関数                      | camelCase(`useXxx.ts` 含む)            |

- Store は **`use` + 名詞 + `Store`**: `useOmikujiStore.ts`。
- `editor/preview/`(`旧 editor/dev/`)はプレビュー用コード置き場。

### 3.2 ディレクトリ名のケース

- **すべて camelCase**。例外は設けない(`composables/` / `scenarios/` / `gameScript/` / `keyEditor/` / `kujibikiPanel/`)。
- ステップの種類ごとのフォルダ(`editor/assets/scenarios/` 配下)は、`kind` の値と同じ camelCase にする(`sound` / `wordParty` / `scenarioCall` など)。
- 新規作成時は必ず従う。既存の PascalCase ディレクトリ(現状 75 件。`games/scripts/`、`editor/assets/`、`generator/stores/` ほか)は、リネームを別作業として行う(§8.2)。

## 4. プロジェクト固有ルール

1. **Manager の定義**: Manager = データを管理するもの(保存・読み込み・供給)。境界外の責務を持たせない。`Manager` を名に含むファイルは `class` をエクスポートする `.ts` に限る。
2. **クラス名は 2語まで** を目安とする。ファイル名もこれに準ずる。
3. **`Dev` プレフィックス禁止**(管理者専用時代の名残。順次除去済み。新規に付けることは禁止)。ただし **`AppDevWorld.vue` は例外としてそのまま維持**する(固有名詞扱い)。
4. **`Mikuji` / `Omikuji` は別物として区別する**:
   - `Mikuji` = **みくじ箱**(中におみくじが入る容器)
   - `Omikuji` / `OmikujiItem` = **おみくじ**(箱の中身)
   - `MikujiEditor.vue` / `MikujiSettings.vue` / `MikujiBoxSchema.ts` 等の `Mikuji` 名は**リネーム禁止**。新規ファイルもこの区別に従うこと。
5. **`Syoken`** は歴史的経緯(OmikujiBotは初見を大事にしている)により維持。
6. **ドキュメントを `src/` に置かない**。ルールに関する事は `docs/conventions/`、作業指示書・移行計画などは `docs/work/` へ置く(配置の基準は `docs/conventions/README.md`)。
   - 例外: **`src/ui/` と `src/games/` はプラグインのため**、各プラグインのディレクトリ内にそのプラグイン自身の説明ドキュメント(例: `src/ui/LifeHourglass/LifeHourglass.md`)を置いてよい。ルール・作業指示書は例外に含めない。

## 5. ドキュメントの配置

- ルール(恒久) → `docs/conventions/`、作業指示書・移行計画・引き継ぎ記録 → `docs/work/`。詳細は `docs/conventions/README.md`。
- `src/` には置かない(§4-6。`src/ui/` と `src/games/` のプラグイン自身の説明は例外)。

## 6. 用語表(ドメイン用語)

新規コード・UI 文言・i18n キー・コメント・AI への依頼のすべてで、この表に従う。

### 6.1 シナリオ系(§8.1 の旧名称から改名)

| 用語                 | UI 表示          | 意味                                                                           | 型・キー                                                                           |
| -------------------- | ---------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Scenario             | シナリオ         | 名前を持ち、再利用できるステップの並び。**assets にあるものだけを指す**        | `ScenarioSchema.ts` / `ScenarioType` / `assets.scenarios` / カテゴリ `'scenarios'` |
| ScenarioStep         | ステップ         | シナリオを構成する処理 1 件                                                    | `ScenarioStepSchema.ts` / `ScenarioStepType` / プロパティ `steps`                  |
| ScenarioStepKind     | ステップの種類   | `message` / `sound` / `wordParty` / `variable` / `gameScript` / `scenarioCall` | `ScenarioStepKind`                                                                 |
| scenarioCall         | シナリオ呼び出し | 別のシナリオを `callKeys` の重み付き抽選で呼ぶステップ                         | kind `'scenarioCall'` / `callKeys`(名称維持)                                       |
| OmikujiItem の steps | ステップ実行     | おみくじアイテムが直接持つ、名前のないステップの並び。Scenario とは呼ばない    | `OmikujiItem.kind: 'steps'` / `steps`                                              |

### 6.2 変更しない用語

| 用語                    | UI 表示          | 備考                                                                        |
| ----------------------- | ---------------- | --------------------------------------------------------------------------- |
| Mikuji / `Mikuji*`      | みくじ箱         | §4-4。リネーム禁止                                                          |
| Omikuji / OmikujiItem   | おみくじ         | みくじ箱の中身                                                              |
| Syoken                  | 初見さん         | §4-5。歴史的経緯で維持                                                      |
| `delaySeconds`          | 遅延秒数         | ステップ共通のプロパティ                                                    |
| gameScript / GameScript | ゲームスクリプト | ステップの種類の 1 つ。実行されるスクリプト本体を指す(ステップ自体ではない) |
| `callKeys`              | –                | 呼び出し先シナリオの key 配列                                               |

### 6.3 そのほかの用語

| 用語                | 意味                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Event               | トリガー(comments / timers / services / reactions / pads)。`omikujiKey` でみくじ箱を指す |
| Post / 投稿         | わんコメへの送信だけを指す(`PostOmikujiService` / `PostOneComme`)                        |
| Preset / プリセット | エディターの「新規作成テンプレート」(`src/editor/presets`)だけを指す                     |
| Manager             | §4-1                                                                                     |
| BotMessage          | ジェネレーターが UI へ渡すメッセージ                                                     |

## 7. 混同防止ルール

1. **Scenario は assets のものだけ**。おみくじアイテム内の並びは `steps` と呼ぶ。
2. **`action` / `Action` を単独の用語として使わない**(識別子・UI 文言・i18n キー・コメント)。ステップは `step`、その配列は `steps`。
3. **`Post` は「わんコメへの投稿」に限る**。投稿しないステップ(sound / variable / scenarioCall / gameScript)に `Post` を付けない。
4. **変数名**: ステップ 1 件は `step`、複数は `steps`(保存データでは id をキーにした Record。配列だった旧形式は migration で変換済み)。ステップの意味で `flow` / `action` / `item` を使わない(`item` は OmikujiItem やアセット 1 件の意味)。
5. **UI 文言**: 「シナリオ」「ステップ」を使う。「アクション」「アクションセット」「PostAction」「BOTアクション」は使わない。
6. **「プリセット」は §6.3 の意味に限る**。シナリオの説明文に使わない。
7. **i18n キー**: `scenario.*` / `scenarioStep.*`。フォルダ名・コンポーネント名も `Scenario*` / `ScenarioStep*` にする(`PostAction*` は作らない)。
8. **保存データの値(キー名・`kind` の値・構造)を変えるときは、必ず `migrations` に変換を書く**。変換しないと、検証(zod)で不正な要素として除外される(除外内容は読み込み時の issues に出る)。
9. **`omikujiSet` は「みくじ箱の中身(おみくじアイテムの配列)」に限る**。セクションキーとして他の意味で使わない(§8 参照)。
10. ステップの種類ごとの型名は `ScenarioStep` + 種類名(例: `ScenarioStepMessageType` / `ScenarioStepGameScriptType`)にし、`kind` の値と型名を一致させる。
    - 例外: シナリオ呼び出し(`kind: 'scenarioCall'`)の型名は `ScenarioStepCallType` で止める(`ScenarioStepScenarioCallType` は冗長なため)。

## 8. 旧名称と既知の問題

### 8.1 旧名称(新規使用禁止。移行は完了済み)

| 旧                                                                   | 新                                                    |
| -------------------------------------------------------------------- | ----------------------------------------------------- |
| `ActionSet` / `actionSet` / アクションセット                         | `Scenario` / シナリオ                                 |
| `PostFlow` / `postFlow`                                              | `ScenarioStep` / `step`                               |
| `postFlows`                                                          | `steps`                                               |
| `PostAction*` / `postAction*` / `PostActions`                        | `ScenarioStep*`                                       |
| `flowCall` / `FlowCallExpander` / `flowSets`                         | `scenarioCall` / `ScenarioCallExpander` / `scenarios` |
| `assets.actions` / `'actions'`                                       | `assets.scenarios` / `'scenarios'`                    |
| `ProcessedPostAction.action` / `ScriptResult.actions` / `actionItem` | `.step` / `steps` / `step`                            |
| `OmikujiItem.kind: 'postFlow'` / BOTアクション                       | `'steps'` / ステップ実行                              |
| v2 の `actionSets` / `postActions` / `actionSetKeys`                 | `v2ToV3.ts` の変換元としてのみ残す                    |

### 8.2 既知の問題(未対応・未確認)

確認日: 2026-11-07(リポジトリの現行コードとの照合)。解消済みの項目(`omikujiSet` の多義、`ActionSetPreview`、`OmikujiItemToolbar`、`PostFlow/actions/`、エンジン内の「アクションセット」文言)は削除した。

- `GameScriptsHandler`(複数形)は 1 件ずつ処理する。`GameScriptManager` との単複が不統一。
- `tools/JsonMerge/KeySuffix.ts` は events と mikuji のキーにだけ接尾辞を付ける。`assets.scenarios` と `callKeys` は対象外のため、マージ時にキーが衝突し得る(コード上の確認のみ・実行は未確認)。
- ディレクトリ名が §3.2(すべて camelCase)に合っていない。PascalCase が 75 件ある。`editor/assets/scenarios/` 配下は `Call` / `Message` / `Sounds` / `WordParty` が PascalCase で、`kind` の値(`scenarioCall` / `message` / `sound` / `wordParty`)とも不一致。`src/ui/<UI名>/` を camelCase にする場合は、`ui-component-registry.md` と `ui-component-registry-migration.md` の `<UI名>` を使うパス表記も合わせて更新する。
- `src/ui/GameRanking/scripts/services/` のように、`scripts/` の下に `services/` がある例がある。§3.1 の役割分担(`scripts/` と `services/`)と合っているか未確認。

## α 版データの扱い

- **dataVersion 3 の α 版データは、作者の自己責任とする**。旧名称・旧構造の v3 データ(例: `server/presets/common/StrawberryChocolatePro.json`)の変換・検出は、エージェントの作業対象外(移行計画 C4b は実施しない)。

## TODO(α 版のため未対応)

- データバージョン(`DATA_VERSION` の `3.0000001005` 形式、上げる条件、`migrations/v3/*.ts` の命名)の運用ルール。β 版以降に必要になった時点で定める。
