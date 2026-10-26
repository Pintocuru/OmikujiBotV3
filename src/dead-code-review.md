# dead-code-review.md(圧縮版)— OmikujiBotV3

最終更新: 2026-10-26(patch 23 時点)。**実行済みの修正は記載しない**。ここにあるのは「未実行の項目」「消してはいけない項目」「次にやること」だけ。

## 0. 調査対象外・方針

- `src/ui`(移行中)、`src/console`、`src/plugin`: 調査しない
- `src/games`: patch 19 で全 48 ファイルを精読済み(下記 2-4)。今後は触らない
- `src/types`: 編集不可(報告のみ)。`src/types/api` は編集可だが作成途中のため保留
- テスト(vitest / `*.test.ts`)・ビルド設定(Webpack は正式版で廃止予定): 対象外
- 確信度が高いものだけ修正し、中・低は報告のみ。コミット・プッシュはしない(`.patch` で提出)

## 1. 消してはいけない(削除不可・保持)

| 対象 | 理由 |
| --- | --- |
| `isCommentMode`(`usePlaceholderEditor` / `MessageTextDialog`) | `LiveClockEditor.vue` が false 側を使用 |
| `apps/dataPacks/` 一式 | 将来のアップデートで使用(TODO 記載済み) |
| `sdk/control/StopSpeech.ts` | 将来の読み上げ停止機能で使用(TODO 追記済み) |
| `ui/GameRanking/.../MessageService.ts` | LiveConsole 用の TODO あり |
| `ui/common/useStreamCounters.ts` の `const _ = previewTick.value` | `watchEffect` の依存を張る意図的な読み取り |
| `PostActionPreview.vue` の `const _ = messageKey.value` | 同上(意図的) |
| `MessagePreviewPanel.vue` の try/catch | 防衛的コードとして残す |
| `events/trigger/TriggerUserId.vue` | 判定側 `TriggerChecker.ts` に `userIds` 実装済み。UI が未接続なだけ(要:接続するか判断) |
| `ServiceTriggerCondition.vue` の `hasPeak` / `serviceSimpleComparisonConditionMap` | 将来用として保持 |
| `MikujiEditor` と `MikujiSettings` の Character/IconKey ボタン二段構成 | 意図的な UI(全体一括 vs アイテム単位) |
| `LogRank` | 廃止予定だがそのまま残す |
| `common/MockUser/maps/MockUser{Ch,En,Kr,Th}Maps.ts` | 多言語対応の準備 |
| `common/DraggableWrapper` 依存 `vue-draggable-plus` | `EmotionGrid.vue` / `WeightBar.vue` が使用中 |
| `server/presets` の JSON | 旧形式データ。データ起因のエラーは正常扱い |
| `src/リポジトリのデッドコードを調査し、不要なコードを削除してください.md` | 依頼文の控え。削除しない(2026-10-26 ユーザー判断) |
| `games/scripts/DwarfBomb/game.ts`(クラス `DwarfBomb`) | 参照ゼロだが、冒頭に「使用しない(バックアップ用)」と明記。実際に使うのは `DwarfBomb/game/game.ts` |
| `games/scripts/FortuneRanking/game.ts` | `BomberSpin/game.ts` の複製で `execute.ts` から未使用。意図が判断できないため保持(登録は patch 23 で実施済み。占いランキングを作る拡張スクリプトで、エンジンには組み込まない方針) |
| `games/scripts/HugEmAll/CharacterPrompt.md` | キャラクター用プロンプトの資料 |
| `games/types/GameScriptTypes.ts` の `ScriptPreset` | 参照ゼロだが、旧プリセット形式の名残か判断できないため保持 |
| `GoogolClover/sub/constants.ts` の `MIN_SPINS` / `MAX_SPINS` | コメントアウトした抽選回数ランダム化の行が参照。復活の意図あり |

## 2. 未実行(報告のみ・要判断)

### 2-1. 不具合の疑い(デッドコードではない。要修正か仕様確認)

- `MessageSettings.vue:48`: `const { data } = useOmikujiStore()` の分割代入でリアクティビティ喪失の恐れ(`storeToRefs` 推奨)
- `EmotionAnimationEditor.vue`: `duration` / `loop` の変更が emit されない(`type` の `@change` 経由でしか保存されない)
- `EmotionLayerEditor.vue`: `handleSetDefaultPath` が常に index 0 のレイヤーを書き換える
- `CommentVoiceSettings.vue`: props 由来の computed を `v-model` で直接ミューテーション
- `EmotionGrid.vue:64` `normalizeKey`: 数字キーに `k` を付与して emit(キー比較不一致の恐れ)
- `DelaySecondsAdjuster.vue`: 調整後のソートで `activeTab` の index がずれうる
- `PostActionsTabs.vue`: `<button>` の中に `MenuDropdown`(`<button>`)をネスト(HTML 違反)
- `OmikujiItemCriteria.vue` と `useOmikujiLottery.ts` の条件判定ロジックが重複(統一はリファクタ)
- `ActionSetSettings.vue`: `currentKey` が渡されず常に `undefined`(自己参照ショートカットが無効。バグ修正か削除かは設計確認)
- `OmikenCommentProcessor`(`sdk/subscribe/OmikenComment/OmikenCommentProcessor.ts`): `roles.has('anonymity')` に到達しない(匿名判定の抜けの可能性)
- `useTestPost.ts` の `postTestOmikuji`: `priorityItems` が `!item.lottery.isPriority` で絞っており条件が逆に見える(仕様確認)
- `SectionCard.vue`: `toggle` emit / `isOpen` が未実装で、呼び出し側の `@toggle` / `:isOpen` が no-op(折りたたみを実装するか一斉削除するか)

### 2-2. 削除候補だが保留(確信度 中)

- `stores`: `hasEvent` / `clearSelection` / `clearAssets` / `updatePlaceholderValues`(+ `WeightValuesArraySchema`)。CRUD の対称性のため残している可能性
- `parts`: `SettingItem` の `showWarning` / `helpUrl` / `helpLabel` / slot `label-extra`、`InformationCard.icon`、`HudPreview` の slot `hudLeft`、`MenuDropdown.disableDelete`、`CharacterPicker.size`(関連 i18n `appInfoEditor.settings.common.warning` / `help`)
- `FeatureCard.vue`: `showToggle` / `featureKey` / `toggle` emit 等(呼び出し側が固定値で到達しない)
- `ThresholdPreview.vue`: `mode='criteria'` の分岐と i18n `appPreview.threshold.criteriaTitle`
- `useVersionCheck.ts`: `isLatest` / `isLoading` 未使用。`PackageSystemInfo` は URL 取得のためだけに呼んでいる
- `dataPacks/useDataPacks.ts`: `error` が常に `null`
- `useImportManager.ts`: `hasImportedData` / `hasPreviewData` / `loadError` / `resetImportProcess` の未使用、`loadFromJsonData` の `any`
- `GeneratorStage.vue`: `BackgroundKey` の `'green'` と `BG_STYLES.green`(クロマキー背景を戻す予定の可能性)
- `engine/ContentPlaceholder/processor.ts` の `clearResolvedValues`(`clear()` と同一処理)、`GameScriptManager.ts` の `allReset` / `listAvailableScripts`(消すなら `getRegisteredGameScriptKeys` の import も不要)
- `generator/stores/UserStats/UserStatsManager.ts` の `getLatest`(LiveConsole 用の可能性)
- `sdk/types/subscribe/SendCommentSchema.ts` と `src/types/subscribe/SendCommentSchema.ts` の複製(`PostOneComme.ts` の import を `@/types/subscribe` に寄せて削除する案。`platform` の `.default('youtube')` 差で挙動が変わりうるため意図確認)
- `src/リポジトリのデッドコードを調査し、不要なコードを削除してください.md`(依頼文のコピー): **削除してよいか確認が必要**

### 2-3. 軽微・整形(確信度 低。挙動に影響なし)

- `v-for="(value, key)"` 等の未使用変数 10 件(`_` 化): `InlinePlaceholderDialog` / `SoundSettings` / `EmotionAnimationEditor` / `EmotionPresetButtons` / `CommentVoiceSettings` / `OmikujiItemEditor`(2) / `ReactionTriggerEditor` / `ServiceTrigger` ほか
- 呼び出し元ゼロの戻り値: `useBoxOmikujiList.box`、`usePlaceholderEditor` の `placeholderMap` / `PLACEHOLDER_ID_PATTERN`、`useWeightValueManagement.updateValue`、`useEmotionDraft` の `draftItemFor` / `removeKey`
- `WordPartyTestButton.vue` の `pattern` prop(`:pattern="null"` 固定)
- `CharacterEditor.vue` の `SectionType` の `'serviceSettings'`
- `PostFlowsEditor.vue` の冗長条件(`modelValue.length > 0 && activeTab >= 0`)
- 参照のない `export`(外すだけ): `useSidebarSectionMap.useUiSections`、`SidebarType.CategoryGroupId`、`evaluationStats` の `*Summary`、`useKeyEditor` 系の `validateKey*`、`ServiceTriggerEvaluator` / `DefaultPlaceholderBuilder` / `ExpressionChecker` / `ExpressionEvaluator` / `baseApiClient.ApiError` / `summarizeState` の一部、`OmikenCommentProcessor` の `isCommentTester` / `convertToJPY`、`common` の `UnsupportedKeyType` ほか
- 型の整理: `InformationCard` の `VARIANT_ICON: any`、`ContentArea` の `editorMap: any`
- 重複: `useModalState` と `useIconKeyModalState`、`useCharacterUpdater` と `useIconKeyUpdater`、`@keyframes pulse` の scoped 重複
- 命名: `isIsEnabled`(`BaseEditor.vue`)は動作に問題なし
- `ConfigImportModal.vue` の computed 内副作用、`ComponentConfigSection.vue` の `<label>` ネスト
- `VirtualStreamPanel.vue` の `?.` の不統一・`cursor-pointer` 抜け、`TestComment.vue` の `burstSend` の不要な `async`
- 日本語直書き(i18n 外): `BaseTagEditor` / `JsonMerge/*` / `dev/` / `shell/` / `EditorApp.vue`(文言追加を伴うため対象外)
- `JsonMergeRemapEditor.vue` の元キャラキー `omiken` / `omiken2` 固定(仕様の可能性)
- `App.vue` と `EditorApp.vue` の `data-theme` 二重指定(意図的)
- Prettier 差分が 8 ファイルに残存(`GetReactions.ts` ほか)
- `validateAgainstBuild.ts:106` の空のアロー関数(eslint 警告 1。意図的な no-op の可能性)
- `src/types` の参照ゼロ型 19 件(`ServiceType` / `BotMessageExtraType` / `UiSettingsType` ほか。編集不可のため報告のみ)
- 範囲外: `server/dev-api.ts`、`tools/viteConfig/*AssetsPlugin.ts`(`res`)、`TemplateJsonProcessor.ts` の未使用 import 2 件(対象外)

### 2-4. src/games(patch 19 で精読。報告のみ)

- `FortuneRanking/params.ts`(確信度 中): `GameParamsSchema` / `GameParams`(`fruits: z.string().min(1)`)は未使用で、`execute.ts` の既定値処理と食い違う。`game.ts`(`BomberSpin` の複製)も未使用のため、整理するなら同時に判断する
- `GoogolClover/execute.ts`(確信度 中): `const {} = this.parseParams(...)` は空の分割代入。`params.ts` は `DwarfBomb` の `mode`(ツルハシ / TNT)のコピーで、このゲームでは使われない
- `GoogolClover/sub/resultBuilder.ts`(確信度 中): `exp >= GOAL_EXPONENT` の分岐と通常成功の分岐が同一の戻り値。`GOAL_EXPONENT` と `UserState.isGoogol` は目標達成演出の予定の可能性。`SpinResult.symbol` は未読
- `MultiplyBonanza/gameConfig.ts`(確信度 中): `WIN_MESSAGES` の `[10000, 'JACKPOT']` は、`MAX_WIN`(= 10000)の行が先に一致するため到達しない。`WORD_PARTY_CONFIG.DELAY_SECONDS` の `BASE_PARTY` / `CRACKER1` は未参照(`execute.ts` が 1 / 3.2 を直書き)。`MessageFormatter.getBasePayout` は `PayoutCalculator.calculatePayout` の一部と重複
- `DwarfBomb/game/gameConfigs.ts`(確信度 低): `REWARD_ITEMS` の `name` / `emoji` / `description` はどこからも読まれない(説明用)
- `BomberSpin/game.ts`(確信度 低): `randomSymbol` の if 連鎖は `symbols.findIndex` で置換可能、`getHitRate` の引数が `any`
- 参照のない `export`(確信度 低): `GouseiSuika` の `GameConfigs` / `ItemLottery`、`HugEmAll/gameConfig.ts` の `ATTACK_PROBABILITIES` / `ATTACK_EFFECTS` / `PLAYER_INITIAL_LIFE`、`FortuneRanking/execute.ts` の未使用引数 `_omiken`
- `BomberSpin` / `FortuneRanking` の `game.ts` はスロットの設定がそのまま複製されている(コピー元の一本化は FortuneRanking の扱いと同時に判断)

### 2-5. src/common(patch 20 で精読。報告のみ)

- `LayerImage.vue` の `<style scoped>`(確信度 低): `prefers-reduced-motion` で `animation-duration` などを同じ値(`--animate-duration`)に上書きしており、実質 no-op(視覚効果を抑える意図なら別途必要)
- `EntryCore/core.ts`(確信度 低): `createAppOneSDK` は OneSDK 未読込時に `undefined` を返すだけで、画面には何も出ない
- `migrations/index.ts`(確信度 低): 移行時の `console.log` が残っている(動作ログとして意図的な可能性)
- `buildValidation/validateAgainstBuild.ts`: `UnsupportedKeyType` / `formatUnsupportedKeys` の `export` のみ未使用(patch 17 と同じ。変更なし)

### 2-6. ディレクトリ構造(patch 21・22 で調査。`src/console`・`src/plugin` は対象外)

構造全体の階層と責務の分け方は一貫している。以下は、未実行の提案と判断。

#### 提案 A: `ui` / `manager` が使う `editor/parts` を共通の場所へ移す(判断: 現状維持)

- 現状: `ui/*/editor/` が `editor/parts`(`SettingItem` 12 件、`HudPreview` 8 件、`ColorPicker` 4 件、`CharacterPicker` 1 件)と `editor/stores/useOmikujiStore`(11 件)を使う。`manager/` も `editor/stores` と `editor/helpers/presetsImport` を使う
- 全面移動は不適切
  - 依存元は `ui/*/editor/` に限られ(例外は `ui/common/DisplayStyleSelector.vue` のみ)、各 UI のエディターが `editor` の部品を使うのは自然な向き(editor の拡張部分)
  - `useOmikujiStore` は editor 固有のストアで移せない。部品だけ `common` に移すと、`common` → `editor` の依存が増える
  - `CharacterPicker` は `editor/helpers/CharacterChanger` に依存するため移せない
- 移せるのは `SettingItem` / `HudPreview` / `ColorPicker`(+ `editor/maps/parts/ColorPicker.ts`)の 3 つ。editor を別パッケージ化する予定がある場合だけ意味がある
- `manager` → `editor` の 7 件は、API の保存・読込が editor のストアを直接更新する設計のため、構造だけを変えても解消しない(設計の判断)

#### `CharacterManager` の応急処置の残り(提案 C の続き)

- 実施済みなのは、フォルダ名の重複の解消だけ(composable を `generator/composables/` へ移動)。根本の問題は残っている
  - `useCharacterManager` は、既定で generator のストア(`useAppStore`)を使う。しかし `ui` と `editor` からも使われている(引数 `source` で editor のストアを渡す)
  - クラス `CharacterManager`(engine)と `useCharacterManager`(generator)は、名前が近いままで、どちらがストアに依存するかが名前から分からない
- 根本対応の案(実行していない)
  - 案 2: 名前を役割に合わせて変える(例: クラス `CharacterResolver`、composable `useCharacters`)
  - 案 3: composable を、ストアに依存しない形(`source` 必須)にして `common` に置き、generator 用のラッパーを別に作る

#### その他(確信度 低、報告のみ)

- `editor/assets/PostFlow` と `editor/apps` のフォルダ名の大文字小文字が混在(`Bot` / `gameScript` / `IconSelector` / `items` ほか)。規則は「機能・コンポーネント単位は Pascal、役割単位(`composables` など)は lower」に寄せるのが自然
- `editor/assets/actions/`(`ActionsEditor.vue` のみ)と `PostFlow/actions/`(ActionSet 関連)の同名フォルダ
- `common/buildValidation` は ui / games / sdk のレジストリを束ねる側で、`common` というより `app` 寄りの性質
- `common/presetsExport/generateContent.ts` と `editor/helpers/presetsExport/` の出力処理が別の場所にある(意図的な分離の可能性)
- `src/` 直下の `dead-code-review.md` と依頼文コピーは、調査完了後に `docs/` へ移す案(依頼文コピーは削除しない方針)
- `common/` → `ui` / `games` / `sdk` / `editor` の import(`buildValidation` の 3 件と `EntryCore/editorCore.ts` の 1 件)
- `engine/` → `generator/stores/MetaState`(`PostOmikujiService.ts` の 1 件)、`types/OmikujiData/ui/UiSchema.ts` → `maps/OmikujiData`(`fontFamilyMap`)、`sdk/subscribe/GetReactions.ts` → `maps/OmikujiData`(`reactionMap`)

## 3. 次にやること

1. `CharacterManager` の名称整理(案 2): ローカルのエージェントに依頼済み(`antigravity-handoff.md` の T-4)。完了後、2-6 の「応急処置の残り」を削除する
2. フォルダ名の大文字小文字の統一(2-6): 広範囲のため後回し
3. `FortuneRanking` の `game.ts` / `params.ts` の整理(2-4)。登録済みのため、いつでも判断できる
