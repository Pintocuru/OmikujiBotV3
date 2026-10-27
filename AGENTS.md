# AGENTS.md

## 命名

- 命名は docs/conventions/naming.md に従うこと(必読)

## 変更

- 変更後は npm run lint と npm run tsc を通すこと

## Githubから読めない場合

- 読めない場合は即刻作業を中止し「読めませんでした」とだけ返してください。

## 作業ログ

### naming.md §5 リネーム移行(patch 単位)

#### patch 1: `common/sounds/PlaySound.ts` → `playSound.ts`

- 設計判断: 関数群のため camelCase(naming.md §2.2)。ロジック・型・表示内容は変更なし
- リネーム: `src/common/sounds/PlaySound.ts` → `src/common/sounds/playSound.ts`(git mv)
- 影響ファイル:
  - `src/common/sounds/playSound.ts`(1行目のパスコメントのみ更新)
  - `src/common/sounds/index.ts`(`export * from './PlaySound'` → `'./playSound'`)
- import 元(`@/common/sounds` の barrel 経由)は変更不要: SoundTestButton.vue / GeneratorSettingsEditor.vue / BotMessageGenerator.ts
- 旧名称残存検索(`PlaySound.ts` / `'./PlaySound'` / `/PlaySound` を src 全文): 0件
- 検証: npm run lint 成功 / npm run tsc 成功(着手前ベースラインも両方成功)。ローカル clone 上で実行(未 push)

#### patch 2: `ui/KujibikiPanel/layouts/` の .vue 4件を PascalCase 化

- 設計判断: .vue は PascalCase 固定(naming.md §2.1)。レイアウト選択キー(`'omikuji' | 'flower' | 'tarot' | 'faceCutout'`、`src/types/ui/KujibikiPanelSchema.ts` / `src/maps/ui/KujibikiPanelMap.ts`)は保存データの値なので変更しない。Selector 内のローカル識別子(`componentMap` のキー含む)も変更なし
- リネーム: `faceCutout.vue` → `FaceCutout.vue` / `flower.vue` → `Flower.vue` / `omikuji.vue` → `Omikuji.vue` / `tarot.vue` → `Tarot.vue`(すべて `src/ui/KujibikiPanel/layouts/`、git mv)
- 影響ファイル:
  - 上記4ファイル(1行目のパスコメントのみ更新)
  - `src/ui/KujibikiPanel/KujibikiPanelSelector.vue`(import パス4行のみ)
- 動的 import / `import.meta.glob` / tools・packages・vite 設定からの参照: なし(確認済み)
- 旧名称残存検索(`layouts/(faceCutout|flower|omikuji|tarot)` を src 全文): 0件
- 検証: npm run lint 成功 / npm run tsc 成功。ローカル clone 上で実行(未 push)

#### patch 3: `ui/LiveClock/composables/RotatingMessage.vue` → `layouts/` へ移動

- 設計判断: composables/ に .vue を置かない(naming.md §2.1 / §3)。移行リストの指定どおり `layouts/` へ移動。ファイル名・コンポーネント名は変更なし
- 移動: `src/ui/LiveClock/composables/RotatingMessage.vue` → `src/ui/LiveClock/layouts/RotatingMessage.vue`(git mv)
- 影響ファイル:
  - `src/ui/LiveClock/layouts/RotatingMessage.vue`(1行目のパスコメントのみ更新)
  - `src/ui/LiveClock/layouts/{Disco,ClearGlass,Morning,Steampunk,SoundPlayer}.vue`(import `'../composables/RotatingMessage.vue'` → `'./RotatingMessage.vue'` の1行のみ)
- 動的 import / `import.meta.glob` からの参照: なし。`composables/` には `useLiveClockTime.ts` のみ残る
- 旧パス残存検索(`composables/RotatingMessage` を src 全文): 0件
- 検証: npm run lint 成功 / npm run tsc 成功。ローカル clone 上で実行(未 push)

#### patch 4: `src/editor/dev/` → `src/editor/preview/`

- 設計判断: Dev の名残を除去(naming.md §4-3 / §3)。ディレクトリ名のみ変更し、中のファイル名・ロジックは変更なし
- リネーム: `src/editor/dev/` → `src/editor/preview/`(git mv。EvaluationBlock/{EvaluationBlock.vue, evaluationStats.ts}、TestComment/TestComment.vue、VirtualStreamPanel/VirtualStreamPanel.vue)
- 影響ファイル:
  - 上記4ファイル(1行目のパスコメントのみ更新)
  - `src/editor/shell/GeneratorView.vue`(import 3行: `@/editor/dev/...` → `@/editor/preview/...`)
- 動的 import / glob / tools・packages・設定ファイルからの参照: なし
- 旧名称残存検索(`editor/dev` と `dev/(EvaluationBlock|TestComment|VirtualStreamPanel)` を src 全文): 0件
- 検証: npm run lint 成功 / npm run tsc 成功。ローカル clone 上で実行(未 push)

#### スキップ(変更なし)

- `DevApp.vue`: naming.md §5 に「後回し・段階的に削除」とあるため今回は着手しない(`src/main.ts` が `./DevApp.vue` を import している点のみ確認)
- `AppDevWorld.vue`: 「そのまま維持」(固有名詞の例外)

#### patch 5: `manager/DataManager.vue` → `ManagerView.vue`

- 設計判断: .vue に Manager を付けない(naming.md §2.1)。画面としての役割が分かる `View` を採用(移行リスト指定)。ロジック・表示内容は変更なし
- リネーム: `src/manager/DataManager.vue` → `src/manager/ManagerView.vue`(git mv)
- 影響ファイル:
  - `src/manager/ManagerView.vue`(1行目のパスコメントのみ更新)
  - `src/editor/EditorApp.vue`(import 1行 + テンプレートのタグ `<DataManager>` → `<ManagerView>` の計2行)
- 変更しなかったもの: `src/manager/types/index.ts` の `DataManagerType`(型名。stores/useApi*.ts・useManager*.ts が参照)は .vue ではなく本 patch の対象外。名称の扱いは別途判断が必要
- 動的 import / `defineOptions({ name })` / 文字列参照: なし
- 旧名称残存検索(`DataManager` を src 全文、`DataManagerType` を除く): 0件
- 検証: npm run lint 成功 / npm run tsc 成功。ローカル clone 上で実行(未 push)

#### patch 6: `types/OmikujiData/assets/PostFlow.ts` → `PostFlowSchema.ts`

- 設計判断: Zod スキーマ・型定義のみのファイルは `*Schema.ts` に統一(naming.md §2.2)。ファイル名のみ変更し、エクスポート名(`PostFlowSchema` / `PostFlowArraySchema` 等)・型定義の中身は変更なし。対象は src/types 配下だが、リネーム移行リスト(§5)の指定による
- リネーム: `src/types/OmikujiData/assets/PostFlow.ts` → `PostFlowSchema.ts`(git mv)
- 影響ファイル:
  - `src/types/OmikujiData/assets/PostFlowSchema.ts`(1行目のパスコメントのみ更新)
  - `src/types/OmikujiData/assets/index.ts`(barrel の `export * from './PostFlow'` → `'./PostFlowSchema'`)
  - `src/types/OmikujiData/assets/OmikujiItemSchema.ts` / `ActionSetSchema.ts`(import 各1行)
- 対象外として確認したもの(同名だが別物): `src/editor/assets/PostFlow/`(ディレクトリ)、`src/i18n/editor/assets/PostFlow.ts`(i18n 翻訳 map。リスト外)
- 旧名称残存検索(`'./PostFlow'` / `OmikujiData/assets/PostFlow(.ts)` を src 全文): 0件
- 検証: npm run lint 成功 / npm run tsc 成功。ローカル clone 上で実行(未 push)

#### patch 7: `editor/helpers/KeyEditor/composables/keyEditorTypes.ts` → `KeyEditor/types.ts`(§5「keyEditor*.ts 4件」のうち型ファイルのみ)

- 設計判断: 型のみのファイルは `types.ts` に集約(naming.md §2.2)。ただし §3 で `composables/` は `useXxx.ts` のみのため、`composables/` ではなく親の `KeyEditor/types.ts` に置いた。型定義(`CharacterUsage` / `UpdateResult` / `KeyUpdateStrategy`)は変更なし
- リネーム: `src/editor/helpers/KeyEditor/composables/keyEditorTypes.ts` → `src/editor/helpers/KeyEditor/types.ts`(git mv)
- 影響ファイル:
  - `src/editor/helpers/KeyEditor/types.ts`(1行目のパスコメントのみ更新)
  - `composables/useKeyEditor.ts` / `composables/keyUpdateStrategies.ts`(import `'./keyEditorTypes'` → `'../types'` 各1行)
- 旧名称残存検索(`keyEditorTypes` を src 全文): 0件
- 検証: npm run lint 成功 / npm run tsc 成功。ローカル clone 上で実行(未 push)
- **未完了(保留)**: 同じ行の関数3ファイル(`keyEditorValidation.ts` / `keyUpdateReferences.ts` / `keyUpdateStrategies.ts`)。§5 は「関数は `useXxx.ts` 形式」だが、(a) §2.2 では関数ファイルは camelCase、(b) いずれも `use*` コンポーザブルではなく(`validateKey` / `updateXxxReferences` / 定数マップ `updateStrategies`)、export 名とファイル名が食い違う。命名の判断が必要なため未着手

#### patch 8: `editor/types/helpers/presetsImportType.ts` → `types.ts`

- 設計判断: Zod を含まない純粋な型(`ImportMode` / `ConflictInfo` / `CategoryImportConfig` / `ComponentImportConfig` / `ImportPreview`)の集約のため、§2.2 の「複数型の集約 → `types.ts`」を採用(移行リストの「`PresetsImportSchema.ts` または `types.ts`」のうち後者)。型定義の中身は変更なし
- リネーム: `src/editor/types/helpers/presetsImportType.ts` → `src/editor/types/helpers/types.ts`(git mv)
- 影響ファイル:
  - `src/editor/types/helpers/types.ts`(1行目のパスコメントのみ更新)
  - `src/editor/types/helpers/index.ts`(barrel の `export * from './presetsImportType'` → `'./types'`)
  - `src/editor/stores/composables/useDataMergeHelpers.ts`(import 1行: `@/editor/types/helpers/presetsImportType` → `@/editor/types/helpers/types`)
- 旧名称残存検索(`presetsImportType` を src 全文): 0件
- 検証: npm run lint 成功 / npm run tsc 成功。ローカル clone 上で実行(未 push)

#### スキップ(変更なし)

- `console/scripts/summarizeState.ts` / `userConsole.ts`: §5 で「問題なし・camelCase のまま維持」

#### patch 9: `KeyEditor/composables/` の関数3ファイルを `KeyEditor/` 直下へ移動(patch 7 の保留分を解消)

- 設計判断: `use*` プレフィックスの判定基準は「ref / computed 等のリアクティブな状態を返すか」。内部で `useXxxStore()` を呼ぶだけではコンポーザブルとしない。3ファイルともリアクティブな戻り値なし(`validateKey` は string、`updateXxxReferences` は void の破壊的更新、`updateStrategies` は定数マップ。`ref(` / `computed(` / `reactive(` の使用は 0 件を確認)のため、リネームせず camelCase のまま `composables/` の外へ移動。`composables/` には `useKeyEditor.ts` のみ残る。ロジック変更なし
- 移動(git mv): `keyEditorValidation.ts` / `keyUpdateReferences.ts` / `keyUpdateStrategies.ts`(`src/editor/helpers/KeyEditor/composables/` → `src/editor/helpers/KeyEditor/`)
- 影響ファイル:
  - 上記3ファイル(1行目のパスコメントのみ更新。`keyUpdateStrategies.ts` は `'../types'` → `'./types'`、`'./keyUpdateReferences'` は同階層のまま)
  - `composables/useKeyEditor.ts`(import 2行: `'./keyEditorValidation'` → `'../keyEditorValidation'`、`'./keyUpdateStrategies'` → `'../keyUpdateStrategies'`)
- 旧パス残存検索(`composables/(keyEditorValidation|keyUpdateReferences|keyUpdateStrategies)` を src 全文): 0件
- 検証: npm run lint 成功 / npm run tsc 成功。ローカル clone 上で実行(未 push)
- patch 7 で保留した「keyEditor*.ts 4件」は本 patch で完了。patch 7 の `KeyEditor/types.ts` はそのまま維持
