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

| ディレクトリ   | 役割                          | 中のファイル                           |
| -------------- | ----------------------------- | -------------------------------------- |
| `components/`  | 再利用可能なコンポーネント    | PascalCase `.vue`                      |
| `composables/` | `use*` 関数のみ               | `useXxx.ts` のみ(`.vue` 禁止)          |
| `layouts/`     | 見た目のバリエーション        | PascalCase `.vue`                      |
| `stores/`      | Pinia Store(`useXxxStore.ts`) | `useXxxStore.ts`                       |
| `types/`       | 型定義                        | `*Schema.ts` / `types.ts` / `index.ts` |
| `scripts/`     | スクリプト・関数群            | camelCase                              |
| `services/`    | API クライアント等            | camelCase(`configApi.ts` 形式)         |
| `maps/`        | 対応表データ                  | PascalCase(`XxxMap.ts`)                |
| `helpers/`     | 汎用関数                      | camelCase(`useXxx.ts` 含む)            |

- Store は **`use` + 名詞 + `Store`**: `useOmikujiStore.ts`。
- `editor/preview/`(`旧 editor/dev/`)はプレビュー用コード置き場。

## 4. プロジェクト固有ルール

1. **Manager の定義**: Manager = データを管理するもの(保存・読み込み・供給)。境界外の責務を持たせない。`Manager` を名に含むファイルは `class` をエクスポートする `.ts` に限る。
2. **クラス名は 2語まで** を目安とする。ファイル名もこれに準ずる。
3. **`Dev` プレフィックス禁止**(管理者専用時代の名残。順次除去済み。新規に付けることは禁止)。ただし **`AppDevWorld.vue` は例外としてそのまま維持**する(固有名詞扱い)。
4. **`Mikuji` / `Omikuji` は別物として区別する**:
   - `Mikuji` = **みくじ箱**(中におみくじが入る容器)
   - `Omikuji` / `OmikujiItem` = **おみくじ**(箱の中身)
   - `MikujiEditor.vue` / `MikujiSettings.vue` / `MikujiBoxSchema.ts` 等の `Mikuji` 名は**リネーム禁止**。新規ファイルもこの区別に従うこと。
5. **`Syoken`** は歴史的経緯(OmikujiBotは初見を大事にしている)により維持。
6. **ドキュメントを `src/` に置かない**。ルールに関する事は `docs/conventions/` へ移動。

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
4. **変数名**: ステップ 1 件は `step`、配列は `steps`。ステップの意味で `flow` / `action` / `item` を使わない(`item` は OmikujiItem やアセット 1 件の意味)。
5. **UI 文言**: 「シナリオ」「ステップ」を使う。「アクション」「アクションセット」「PostAction」「BOTアクション」は使わない。
6. **「プリセット」は §6.3 の意味に限る**。シナリオの説明文に使わない。
7. **i18n キー**: `scenario.*` / `scenarioStep.*`。フォルダ名・コンポーネント名も `Scenario*` / `ScenarioStep*` にする(`PostAction*` は作らない)。
8. **保存データの値(キー名・`kind` の値)を変えるときは、必ず `migrations` に変換を書く**。zod の `.catch([])` により、1 件でも不正だとステップ配列ごと空になる。
9. **`omikujiSet` は「みくじ箱の中身(おみくじアイテムの配列)」に限る**。セクションキーとして他の意味で使わない(§8 参照)。
10. ステップの種類ごとの型名は `ScenarioStep` + 種類名(例: `ScenarioStepMessageType` / `ScenarioStepGameScriptType`)にし、`kind` の値と型名を一致させる(現状 `PostFlowGameType` と `gameScript` が不一致)。
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

### 8.2 今回の改名とは別に見つかった問題(未対応)

- セクションキー `omikujiSet` が複数の意味で使われている(events のおみくじ、mikuji / actions のステップ一覧)。`CategorySectionMap` では mikuji も `component: 'actionSet'` を使い、`ActionSetPreview` を共有している。`staticSectionPreviewMap` に TODO あり。
- `ActionSetPreview` は `postFlows` を読むが、みくじ箱のデータは `omikuji` を持つ。mikuji でのプレビュー表示は**未確認**。
- `OmikujiItemToolbar.vue`(`tooltab/`)は、ステップ列のツールバーなのに名前が OmikujiItem。
- `editor/assets/PostFlow/actions/`(`ActionSetSettings.vue` ほか)は、実際は `scenarioCall` ステップの編集部品。フォルダ名と中身が合っていない。
- `GameScriptsHandler`(複数形)は 1 件ずつ処理する。`GameScriptManager` との単複が不統一。
- `tools/JsonMerge/KeySuffix.ts` は events と mikuji のキーにだけ接尾辞を付ける。assets.actions(→scenarios)と `callKeys` は対象外のため、マージ時にキーが衝突し得る(コード上の確認のみ・実行は未確認)。
- システムメッセージ(例: 「アクションセットの展開が最大階層に達しました」)がエンジン内に日本語で直書きされている。用語変更時に取りこぼしやすい。
- 現在の移行は dataVersion 3 未満だけが対象。v3 の旧名称データ(`assets.actions` / `postFlows`)を読み込むと、警告なく空として扱われる。
