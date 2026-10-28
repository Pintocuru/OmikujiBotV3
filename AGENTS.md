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

### pads (ポン出し) 機能の追加(patch 単位)

着手前ベースライン: npm run tsc は既存エラー2件(`DataPackCard.vue` / `DataPacks.vue` の `DataPackEntry` 未 export。本作業とは無関係)。

#### patch 1: `ReactionEventSchema` の `kind` を `'reactions'` に修正

- 設計判断: イベントの `kind` はカテゴリ名(`comments` / `timers` / `services`)と同じにする。`reaction`(単数)だけ食い違っていたため揃えた
- 既存データ対策: 保存済みデータ(`kind: "reaction"`)は `.catch('reactions')` で読み替える。`normalizedArray` は 1件でも不正だと配列ごと空にするため、`catch` を付けないとリアクションイベントが全消えする。zod で `'reaction'` → `'reactions'` になることを確認済み
- 影響ファイル:
  - `src/types/OmikujiData/events/EventSchema.ts`(`ReactionEventSchema.kind`)
  - `src/common/migrations/v2/v2ToV3.ts`(`EVENT_MAP` の kind)
- 対象外として確認したもの(同名だが別物): `src/types/ui/StreamCounterSchema.ts` の `'reaction'`(カウンターのキー)
- 旧名称の残存検索(`kind: 'reaction'` / `'reaction'` を src 全文): StreamCounterSchema の1件のみ(上記、対象外)
- 検証: npm run tsc は既存エラー2件のみ(増減なし)

#### patch 2: イベントカテゴリ `pads` の追加(スキーマ + エディター)

- 設計判断:
  - イベント名は `pads`、`kind` もカテゴリ名と同じ `'pads'`。他のイベントと同じ構造(`BaseEventSchema` + `trigger: normalizedObject(XxxTriggerSchema)`)に揃えた
  - ボタンの識別子は `pad-1`〜`pad-16`(`padIds` / `PadIdSchema`)。2×2 / 3×3 / 4×4 のどの構成でも、左上から右へ・上から下へ番号を振る(= 4個構成なら `pad-1`〜`pad-4`)。構成(4/9/16)は LiveConsole の表示設定でありイベントデータには持たせない
  - `PadTriggerSchema` は `padId` のみ。不正値は `pad-1` に戻す(`catch`)
  - `padLayouts` / `padGridSize`(構成 → 1辺のボタン数)は、LiveConsole の表示と型を共有するため `PadTriggerSchema.ts` に置いた
  - 既存データは `pads` が無くても `normalizedArray` の既定値(空配列)で読めるため、マイグレーション・dataVersion の更新は不要
  - サイドバーのプレビューは、`TriggerPreview`(services / reactions 専用の mode を要求)を流用せず、`component: 'padTrigger'` の専用 `PadTriggerPreview.vue` を作った(セクション名 `trigger` は文言共有のため維持)
  - プリセット(`presetMap` は Partial)は作らない。ポン出しは LiveConsole のボタンと対応づけて使うため
- 追加ファイル:
  - `src/types/OmikujiData/events/PadTriggerSchema.ts`
  - `src/editor/events/pad/PadEditor.vue` / `PadTriggerEditor.vue`(ReactionEditor と同じ構成。ボタンは 4×4 のグリッドで選ぶ)
  - `src/editor/apps/appItems/preview/PadTriggerPreview.vue`
  - `src/i18n/editor/events/PadEditor.ts`(ja/en。`messageModules.ts` にも登録)
- 変更ファイル:
  - `src/types/OmikujiData/events/{EventSchema,EventCategorySchema,index}.ts`
  - `src/maps/OmikujiData/CategoryMap.ts` / `src/editor/maps/category/CategorySectionMap.ts`
  - `src/editor/apps/appItems/ContentArea.vue`(editorMap)
  - `src/editor/apps/appItems/preview/staticSectionPreviewMap.ts`
  - `src/editor/helpers/KeyEditor/composables/useKeyEditor.ts`(`CharacterUsage` に pads)
  - `src/i18n/editor/category/NavigationSidebarCategoriesMessages.ts` / `src/i18n/editor/helpers/keyEditorMessages.ts`
- 影響範囲の確認: `eventCategory` / `EventCategoryType` を使う箇所(`tools/JsonMerge` を含む)は、カテゴリ列挙を汎用的に回しているため追加対応なし。`'comments', 'timers', …` のハードコード列挙は `useKeyEditor.ts` の1件のみで対応済み
- 検証: npm run lint(変更範囲)成功 / npm run tsc は既存エラー2件のみ(増減なし)

#### patch 3: ポン出し API(サーバー + 型 + クライアント)

- 設計判断:
  - 仮名だった `POST /trigger` / `GET /status?since=` は、既存の API 契約に合わせて action にした: `trigger-pad`(POST)/ `load-pad-status`(GET)。わんコメプラグインと Express の両方で、既存の `routeRequest` から動く
  - 発火時刻は**サーバーが付ける**(依頼文では「時刻をサーバーに送信」だったが、押す側と受け取る側で時計がずれても `since` で取りこぼさないため)。同じミリ秒に2回押されても区別できるよう、前回より必ず進める
  - 保持するのは**最後の発火だけ**(依頼どおり)。メモリのみで、サーバー再起動で空に戻る。0.5秒以内に別のボタンが押されると、先の発火は受け取れない(仕様上の制約)
  - `load-pad-status` は `since` が無いと `hasNew: false` + 最後の発火時刻を返す。OBS を開き直したとき、過去の発火を再生しないように、受け取り側がこの値を最初の lastSeen にする
  - `hasNew` は `firedAt > since`(厳密に新しい)で判定
- 追加ファイル: `server/core/handlers/padHandler.ts` / `src/types/api/pad/{PadApi,index}.ts` / `src/manager/services/padApi.ts`
- 変更ファイル: `server/api/actions.ts` / `server/core/router.ts` / `src/types/api/index.ts` / `src/manager/services/apiServiceUtils.ts`(エラーメッセージ表)
- 検証: ルーター経由で、baseline・不正な padId(400)・trigger・since=0(hasNew)・since=最新(no new)・時刻の単調増加を確認。npm run tsc は既存エラー2件のみ。eslint は既存の警告1件のみ

#### patch 4: 受信側(Generator)の `PadProcessor`

- 設計判断:
  - 既存の `EventReactionProcessor` と同じ形(`startPads` / `stopPads`)にして、`useRuleProcessor` の timer / service / reaction と並べて起動・停止する
  - ポーリングは **0.5秒固定**(`PAD_POLL_INTERVAL_MS`)。ジッターなし。前回の取得が終わる前に次を始めない(`running`)
  - `lastSeen` が未設定の最初の1回は `since` なしで問い合わせ、サーバーの最後の発火時刻を基準にする(発火はしない)。OBS を開き直しても、過去の発火を再生しない
  - **二重発火の防止**: おみくじの実行より前に `lastSeen` を更新する。実行は応答の `padId` と一致する、有効な pads イベントを `order` 順に行う
  - サーバーがない(OBS のみで使うなど)ときは、`userStatsPolling` と同じく静かに無視して次の周期で再試行する。つながり直した最初の応答も「基準」として扱う
  - stop / 再 start で世代(`session`)を進め、古い応答を無効にする
- 追加ファイル: `src/generator/scripts/EventProcess/PadProcessor.ts` / `PadProcessor.test.ts`(vitest 5件)
- 変更ファイル: `src/generator/composables/useRuleProcessor.ts`
- 検証: vitest 5件成功(基準の取得・since・order 順の1回実行・接続断からの復帰・stop 後は問い合わせない)/ npm run tsc は既存エラー2件のみ / eslint 成功

#### patch 5: LiveConsole(src/console)に「ポン出し」画面

- 設計判断:
  - 既存の画面切り替え(タブ)に `pads: 'ポン出し'` を追加。URL の `#pads` で再読み込みしても戻れるよう、`fromHash` を `views` のキーで判定する形に一般化した
  - ボタン構成(4 / 9 / 16個)はセレクトボックスで切り替え、CSS Grid(`repeat(N, 1fr)`、N = 2 / 3 / 4)で並べる。各ボタンは `pad-1`〜`pad-16` の識別子を持つ(`data-pad-id`)。選んだ構成は Chrome の localStorage に覚える(読み書きできなくても動く)
  - 押すと `padApi.trigger(padId)` でサーバーへ送るだけ。発火の実行は OBS 側(patch 4)。サーバーに接続できないときは既存の `StatusNotice` で案内する
  - ロジックは `usePadsConsole.ts` に分け、`PadsView.vue` は表示だけにした(`UsersView` と同じ分け方)
- 追加ファイル: `src/console/components/PadsView.vue` / `src/console/composables/usePadsConsole.ts`
- 変更ファイル: `src/console/LiveConsole.vue`
- 検証: npm run tsc は既存エラー2件のみ / eslint 成功 / Express 開発サーバー(`server/start-dev-server.ts`)に対し、実際の HTTP 経路で `load-pad-status` → `trigger-pad` → `load-pad-status&since=0` が期待どおり
- 未確認: ブラウザでの目視確認。`package.json` の `dev:console` が指す `tools/viteConfig/vite.console.config.ts` はリポジトリに存在しない(既存の問題。今回は触っていない)ため、console 単体のビルドは行っていない
