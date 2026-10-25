# dead-code-review.md — OmikujiBotV3 `src/editor`(assets / events / apps・parts・helpers・stores・types の一部)

- 調査日: 2026-10-25
- 方法: GitHub から各ファイルを取得し、import を手で辿って参照関係を確認(コード検索 API は 0 件しか返さず使えなかった)
- 2026-10-25(続き): clone して grep と `vue-tsc --noEmit` / eslint で確認(patch 2: `src/editor/events` + 関連 i18n)。patch 1(assets)は upstream に適用済みであることを確認(`PostActionsPreview.vue` が存在しない)
- 2026-10-25(続き 2): patch 2 適用後の状態を基準に patch 3(`src/editor/apps`・`parts`・`helpers`・`stores`・`types` + 関連 i18n)を実施。**この範囲は全ファイルを精読していない**(下の「機械的に走査のみ」を参照)
- 2026-10-25(続き 3): patch 7 適用後の HEAD(`bedbfe1`)を基準に patch 8(`src/editor` の `ui`・`dev`・`shell`・`presets`・`maps`・`types` と直下の `App.vue`・`EditorApp.vue`・`i18n.ts`)を実施。これで `src/editor` は全域の精読が完了
- 2026-10-25(続き 4): patch 8 適用後の状態を基準に patch 9(`src/sdk` 全域)を実施
- コミット・プッシュ: 行っていない(`.patch` で提出。patch 3 は patch 2 の適用が前提)

---

## 1. 読み取り済みファイル(全文を確認)

### actions / placeholders

- `actions/ActionsEditor.vue`
- `placeholders/PlaceholderEditor.vue`
- `placeholders/PlaceholderValuesEditor.vue`
- `placeholders/PlaceholderInputMode.vue`
- `placeholders/PlaceholderTextMode.vue`
- `placeholders/PlaceholderPreview.vue`

### characters

- `characters/CharacterEditor.vue`
- `characters/color/CharacterColorSettings.vue`
- `characters/service/CommentVoiceSettings.vue`
- `characters/service/CharacterBase64Settings.vue`
- `characters/CharacterImage/CharacterImageSettings.vue`
- `characters/CharacterImage/EmotionEditModal.vue`
- `characters/CharacterImage/EmotionGrid.vue`
- `characters/CharacterImage/EmotionCard.vue`
- `characters/CharacterImage/EmotionImageItem.vue`
- `characters/CharacterImage/EmotionLayerEditor.vue`
- `characters/CharacterImage/EmotionAnimationEditor.vue`
- `characters/CharacterImage/EmotionPresetButtons.vue`
- `characters/CharacterImage/composables/useEmotionDraft.ts`

### mikuji

- `mikuji/MikujiEditor.vue`
- `mikuji/MikujiSettings.vue`
- `mikuji/item/OmikujiItemEditor.vue`
- `mikuji/item/OmikujiItemHeader.vue`
- `mikuji/item/OmikujiItemPriority.vue`
- `mikuji/item/OmikujiItemCriteria.vue`
- `mikuji/item/OmikujiItemControlSettings.vue`
- `mikuji/weight/WeightBar.vue`
- `mikuji/weight/WeightItem.vue`
- `mikuji/composables/useBoxOmikujiList.ts`
- `mikuji/composables/useOmikujiLottery.ts`
- `mikuji/composables/useOmikujiWeight.ts`

### PostFlow

- `PostFlow/PostFlowsEditor.vue`
- `PostFlow/PostActionsPreview.vue`
- `PostFlow/items/PostActionItem.vue`
- `PostFlow/composables/usePostActionsTab.ts`(一覧と呼び出しのみ。中身は未精読)
- `PostFlow/tooltab/PostActionsTabs.vue`
- `PostFlow/tooltab/OmikujiItemToolbar.vue`
- `PostFlow/tooltab/DelaySecondsAdjuster.vue`
- `PostFlow/tooltab/PostActionRow.vue`
- `PostFlow/preview/PostActionPreview.vue`
- `PostFlow/preview/TestPlaceholderProcessor.ts`
- `PostFlow/preview/WordPartyTestButton.vue`
- `PostFlow/preview/SoundTestButton.vue`
- `PostFlow/Message/MessageSettings.vue`
- `PostFlow/Message/MessageTextDialog.vue`
- `PostFlow/Message/MessageTextEditor.vue`
- `PostFlow/Message/PlaceholderPanel.vue`
- `PostFlow/Message/usePlaceholderEditor.ts`
- `PostFlow/Message/MessagePreviewPanel.vue`
- `PostFlow/Message/InlinePlaceholderDialog.vue`
- `PostFlow/Bot/BotSettings.vue`
- `PostFlow/variable/VariableSettings.vue`
- `PostFlow/Sounds/SoundSettings.vue`
- `PostFlow/WordParty/WordPartySettings.vue`
- `PostFlow/gameScript/GameScriptSettings.vue`
- `PostFlow/IconSelector/IconSelector.vue`
- `PostFlow/IconSelector/IconSelectorModal.vue`
- `PostFlow/actions/ActionSetSettings.vue`
- `PostFlow/actions/ActionSetValidator.ts`
- `PostFlow/actions/useWeightCalculation.ts`
- `PostFlow/actions/useWeightValueManagement.ts`

### events(patch 2 で全文確認)

- `events/comment/CommentEditor.vue`、`CommentTriggerEditor.vue`
- `events/reaction/ReactionEditor.vue`、`ReactionTriggerEditor.vue`
- `events/service/ServiceEditor.vue`、`ServiceTrigger.vue`、`ServiceTriggerCondition.vue`
- `events/timer/TimerEditor.vue`、`TimerIntervalEditor.vue`
- `events/core/BoxChoiceEditor.vue`
- `events/trigger/` の 8 ファイル(`TriggerAccess` / `TriggerComment` / `TriggerCount` / `TriggerExpression` / `TriggerGift` / `TriggerSyoken` / `TriggerUserId` / `TriggerUsername`)

### patch 3 で精読したもの

- `apps/appItems/AppHeader.vue`、`apps/navigation/composables/useSidebarSectionMap.ts`
- `parts/SectionCard.vue`、`parts/CopyButton.vue`(削除)、`helpers/presetsImport/ConfigImport.vue`(削除)
- `types/apps/SidebarType.ts`
- `stores/useOmikujiStore.ts`、`stores/composables/useEventProperties.ts`
- `helpers/CharacterChanger/composables/useDataExtractor.ts`、`helpers/IconKeyChanger/IconKeyChanger.vue`(該当箇所)、`apps/JsonMerge/JsonMergeEditor.vue`(該当箇所)

### patch 3 で機械的に走査のみ(精読していない)

- `src/editor/{apps,parts,helpers,stores,maps,types,ui,dev}` の残りのファイル。次の 4 つの機械走査だけを行った
  1. import グラフ(`src` / `packages` / `tools` / `server` の静的 import・動的 import・`import.meta.glob`)での未参照ファイル
  2. 他ファイルから参照されない export
  3. `vue-tsc --noUnusedLocals --noUnusedParameters`
  4. defineProps / defineEmits の未使用チェック(簡易スクリプト)
- `src/i18n/editor/**` の全ファイル(ja のキーが他で参照されているか)

### assets 外(参照確認のために読んだもの)

- `src/editor/apps/appItems/ContentArea.vue`(エディターのマッピング)
- `src/editor/maps/category/CategorySectionMap.ts`(全文)
- `src/editor/assets/mikuji/MikujiSettings.vue`(script 部)
- `src/generator/scripts/trigger/TriggerChecker.ts`(全文。userId 条件の確認用)
- `src/types/engine/trigger/TriggerCondition.ts`(全文)
- `src/i18n/editor/events/` の `CommentEditor.ts` / `ReactionEditor.ts` / `EventTriggers.ts`(該当ブロック)

---

## 2. 調査済み範囲 / 未調査範囲

### 調査済み

- `src/editor/assets` 配下はほぼ全ファイルを読了
- `src/editor/events` 配下の全 17 ファイルを読了(patch 2)。`src/i18n/editor/events/*.ts` の未使用キーを機械的に走査
- カテゴリ別エディター 4 種(mikuji / actions / placeholders / characters)から、各子コンポーネントへの import 連鎖

### 未調査・不十分

- `characters/CharacterImage/ImageSettingsInfo.vue`(EmotionEditModal から import されていることのみ確認、中身は未読)
- `PostFlow/composables/usePostActionsTab.ts` の中身(戻り値の未使用有無)
- `assets` の外側すべて
  - `src/editor/parts/`、`src/editor/helpers/`、`src/editor/stores/`、`src/editor/maps/`
  - `src/maps/OmikujiData`、`src/types/OmikujiData`
  - ロケールファイル(i18n キーの未使用判定)
- テスト、ビルド設定(vite / tsconfig / eslint)、package.json
- `src/editor/{apps,parts,helpers,stores,maps,types,ui,dev}` の精読(機械走査のみ。「精読」を要する箇所は 4-2 / 4-3 を参照)

---

## 3. 確認済みの参照関係

- `ContentArea.vue` の editorMap → `MikujiEditor` / `ActionsEditor` / `PlaceholderEditor` / `CharacterEditor`
- `MikujiEditor` → `MikujiSettings` → `OmikujiItemEditor`
  - `OmikujiItemEditor` → `OmikujiItemHeader` / `OmikujiItemPriority` / `OmikujiItemControlSettings`
  - `OmikujiItemCriteria` は `OmikujiItemEditor` が import(Priority と並ぶ子)
  - `WeightBar` → `WeightItem`
- `ActionsEditor` → `PostFlowsEditor` → `PostActionsTabs` / `OmikujiItemToolbar` / `PostActionItem`
  - `PostActionsTabs` → `PostActionRow`
  - `OmikujiItemToolbar` → `DelaySecondsAdjuster`
- `PostActionItem` の componentMap(kind 7 種)
  - message → `MessageSettings`
  - sound → `SoundSettings`
  - wordParty → `WordPartySettings`
  - variable → `VariableSettings`
  - gameScript → `GameScriptSettings`
  - bot → `BotSettings`
  - flowCall → `ActionSetSettings`
  - `PostActionPreview`(単数形)も `PostActionItem` から使用
- `MessageSettings` / `BotSettings` / `VariableSettings` / `OmikujiItemControlSettings` → `MessageTextDialog` → `PlaceholderPanel` → `usePlaceholderEditor`
- `PlaceholderEditor` → `PlaceholderValuesEditor` → Input / Text / Preview の各 Mode
  - Input Mode は `PostFlow/actions/useWeightValueManagement` を共用(assets 内の横断依存)
- `CharacterEditor` → `CharacterColorSettings` / `CommentVoiceSettings` → `CharacterBase64Settings` / `CharacterImageSettings`
  - `CharacterImageSettings` → `EmotionPresetButtons` / `EmotionGrid` → `EmotionCard`
  - `CharacterImageSettings` → `EmotionEditModal` → `EmotionImageItem` / `EmotionLayerEditor` / `EmotionAnimationEditor` / `ImageSettingsInfo`、`useEmotionDraft`
  - `IconSelectorModal` が `EmotionGrid` を `readonly` で再利用(assets 内の横断依存)
- `PostActionPreview` / `PlaceholderPreview` / `MessagePreviewPanel` → `TestPlaceholderProcessor`

### events の参照関係(patch 2 で確認)

- `CommentEditor` → `CommentTriggerEditor`(`TriggerComment` / `TriggerAccess` / `TriggerGift` / `TriggerUsername` / `TriggerExpression`)、`BoxChoiceEditor`、`MikujiSettings`
- `ReactionEditor` → `ReactionTriggerEditor`、`BoxChoiceEditor`、`MikujiSettings`
- `ServiceEditor` → `ServiceTrigger` → `ServiceTriggerCondition`(`:has-peak="true"` を 2 か所とも渡す)、`BoxChoiceEditor`、`MikujiSettings`
- `TimerEditor` → `TimerIntervalEditor`、`BoxChoiceEditor`、`MikujiSettings`
- `TriggerCount` / `TriggerSyoken` は `assets/mikuji/item/OmikujiItemCriteria.vue` が import(events 内からは未使用だが使用中)
- `TriggerUserId` は import 元なし(リポジトリ全体を grep)。判定側 `src/generator/scripts/trigger/TriggerChecker.ts` には `userId` 条件が実装されている
- i18n: 4 エディターの無効通知は `eventCore.disabledNotice.*` を使用

---

## 4. 発見事項

形式: 場所 / 理由 / 参照調査 / 削除時の影響 / 確信度

### 4-1. 削除候補

#### A-1 `isCommentMode`(**撤回: 削除不可**。2026-10-25 にコードで再確認・信憑性: **高（削除不可が妥当）**)

- 現コード検証: `src/ui/LiveClock/editor/LiveClockEditor.vue:25` が `<MessageTextDialog v-model="messageText" />` を prop なし（デフォルト `false`）で利用しており、`usePlaceholderEditor` の false 分岐（`defaultBasePlaceholderLabel`）に到達する。そのため削除不可の判断は現行コードに完全一致。
- 補足: assets 内の 4 箇所（`MessageSettings`、`BotSettings`、`VariableSettings`、`OmikujiItemControlSettings`）はすべて `:isCommentMode="true"` を渡している。
- 影響: 削除不可（現行維持）。
- 確信度・信憑性評価: **妥当（削除不可）**

#### A-2 `PostActionItem.vue` の未使用定義【適用済み(commit 19973c3 / patch 1)】
- 信憑性: **高（事実・コード適用済み）**
- 現コード検証: `PostActionItem.vue` では prop `index`、emits `duplicate`/`remove` は既に削除され、`v-for="(_, type) in postFlowKindMap"` に更新済み。`PostFlowsEditor.vue` 側のバインドも削除済みであることを確認。

#### A-3 `ActionsEditor.vue` が `PostFlowsEditor` に渡す余剰 prop【適用済み(commit 19973c3 / patch 1)】
- 信憑性: **高（事実・コード適用済み）**
- 現コード検証: `ActionsEditor.vue` から `category` / `selectedItemKey` は既に削除済み。`PostFlowsEditor.vue` は `modelValue` のみを受け取っている。

#### A-4 `MikujiSettings.vue` の `category` prop(`MikujiEditor` から渡している分も含む)【適用済み(commit 633a5c6 / patch 2)】
- 信憑性: **高（事実・コード適用済み）**
- 現コード検証: `MikujiSettings.vue` から prop `category` は削除され、呼び出し元 5 箇所（`MikujiEditor`, `CommentEditor`, `ReactionEditor`, `ServiceEditor`, `TimerEditor`）からの属性も削除済み。

#### A-5 `IconSelector.vue` の未使用要素【適用済み(commit 19973c3 / patch 1)】
- 信憑性: **高（事実・コード適用済み）**
- 現コード検証: `showHoverSelector` および emit `showSelector` はコードから既に削除済み。

#### A-6 `PlaceholderTextMode.vue` の `error` フィールドと `getErrorMessage`【適用済み(commit 19973c3 / patch 1)】
- 信憑性: **高（事実・コード適用済み）**
- 現コード検証: `error` フィールドと `getErrorMessage` はコードから既に削除済み。

#### A-7 `TestPlaceholderProcessor.ts` の `highlighted`【適用済み(commit 19973c3 / patch 1)】
- 信憑性: **高（事実・コード適用済み）**
- 現コード検証: no-op な `replace` 呼び出しは既に除去され、`processed.bubble` を直接返すよう修正済み。

#### A-8 `PostActionPreview.vue` の到達不能分岐【適用済み(commit 19973c3 / patch 1)】
- 信憑性: **高（事実・コード適用済み）**
- 現コード検証: `if (!processed)` の到達不能分岐は既に削除され、関連 i18n キー `postFlow.actionPreview.hidden` も削除済み。

#### A-9 `MessagePreviewPanel.vue` の try/catch【修正見送り】
- 信憑性: **高（修正見送りの判断が極めて妥当）**
- 現コード検証: `data.value.assets.placeholders ?? {}` の引数解決時やリアクティブデータアクセスで `data.value.assets` が未定義の場合、例外が発生して catch に到達する可能性があるため、防衛的コードとして残す判断は妥当。

#### A-10 `useEmotionDraft.ts` の未使用戻り値
- 信憑性: **高（デッドコード・リファクタ対象として事実）**
- 現コード検証: `useEmotionDraft.ts` が返す `draftItemFor` と `removeKey` は、利用側 `EmotionEditModal.vue` で分割代入されておらず、リポジトリ全体を grep しても他からの呼び出しは 0 件。削除による影響なし。

#### A-11 `ActionSetSettings.vue` の `currentKey` prop と関連引数
- 信憑性: **高（コード事実の指摘として正確・要仕様確認）**
- 現コード検証: `PostActionItem.vue` から `<ActionSetSettings>` には `currentKey` が渡されておらず常に `undefined`。そのため、自身のキーを除外する `key === current` および `checkCircularReference` の自己参照ショートカットは常に機能していない。ただし `visited` による循環検出機構自体は成立しているため動作不全には至っていない。デッドコード削除とするか、本来渡すべきバグ修正とするかは設計確認が必要。

#### A-12 `WordPartyTestButton.vue` の `pattern` prop
- 信憑性: **高（デッドコードとして事実）**
- 現コード検証: `PostActionPreview.vue:73` で `:pattern="null"` が固定で渡されており、他からの呼び出し元もない。`WordPartyTestButton.vue` 内部の `:disabled="!pattern && !id"` において `pattern` は常に `null`（実質 `!id` のみ判定）であり、無意味な prop となっている。

#### A-13 `useOmikujiLottery.ts` と `OmikujiItemCriteria.vue` の重複
- 信憑性: **高（事実・重複実装）**
- 現コード検証: `OmikujiItemCriteria.vue` 側で条件判定・トグル・更新処理がローカルに再実装されており、`useOmikujiLottery.ts` の同等ロジックと重複している。

#### A-14 `CharacterEditor.vue` の `SectionType` に含まれる `'serviceSettings'`
- 信憑性: **高（デッドコードとして事実）**
- 現コード検証: `CharacterEditor.vue:91` の型定義 `type SectionType = 'baseSettings' | 'colorSettings' | 'commentVoice' | 'serviceSettings' | 'imageSettings' | null` において、`serviceSettings` に対応するセクション（`SectionCard`）や `categorySectionMap.characters` の項目は一切存在しない。

#### A-15 軽微(低リスクの掃除)
- 信憑性: **高（すべてコード上の事実と一致）**
- 現コード検証:
  - 未使用戻り値: `useBoxOmikujiList` の `box`、`usePlaceholderEditor` の `placeholderMap` / `PLACEHOLDER_ID_PATTERN`、`useWeightValueManagement` の `updateValue`（内部のみ使用で return は不要）など、すべて他所から未参照。
  - 冗長コード: `PostFlowsEditor.vue` の `props.modelValue.length > 0 && activeTab >= 0`、`CommentVoiceSettings.vue` や `EmotionAnimationEditor.vue` の `v-for="(value, key)"` における未使用 `value`、`PostActionPreview.vue` の `const _ = messageKey.value` などの存在をコード上で確認。
  - 古いコメント: 各ファイルに残存していることを確認。

#### B-1 `CommentEditor.vue` の `SectionType` の `'scriptGame'`【適用済み(commit 633a5c6 / patch 2)】
- 信憑性: **高（事実・コード適用済み）**
- 現コード検証: `CommentEditor.vue` の `SectionType` から `'scriptGame'` は既に削除済み。

#### B-2 `i18n/editor/events` の未参照キー【適用済み(commit 633a5c6 / patch 2)】
- 信憑性: **高（事実・コード適用済み）**
- 現コード検証: `EventTriggers.ts` の `triggerService`、`CommentEditor.ts` および `ReactionEditor.ts` の `disabledNotice` は既に削除済み。

#### B-3 コメントの誤記・名前の不統一【適用済み(commit 633a5c6 / patch 2)】
- 信憑性: **高（事実・コード適用済み）**
- 現コード検証: `ServiceEditor.vue` の import 名（`ServiceTrigger`）、`ServiceTrigger.vue`、`TimerIntervalEditor.vue` のコメント修正はすべてコードに反映済み。

#### B-4 `ServiceTriggerCondition.vue` の `hasPeak` と `serviceSimpleComparisonConditionMap`【未修正・報告のみ】
- 信憑性: **高（コード事実の指摘として正確・要方針確認）**
- 現コード検証: `ServiceTrigger.vue` 内の `TriggerMetaCondition` 呼び出し 2 箇所（`upVote` と `viewer`）が共に `:has-peak="true"` を固定で渡しており、`false` 側で使われる `serviceSimpleComparisonConditionMap`（登録者数等のピークなし比較用）は現状どこからも参照されていない。将来機能用として残す判断は妥当。

#### B-5 events の軽微な不統一(報告のみ)
- 信憑性: **高（指摘の正確性をコードで確認）**
- 現コード検証: `TimerEditor.vue` の `v-if="selectedItem.isEnabled"` と他エディターの記述差、`TriggerComment`/`TriggerUserId`/`TriggerUsername` の同期ロジック共通性、未使用の v-for 変数など、すべて現行コード上に存在することを確認。

#### C-1 未参照ファイルの削除【適用済み(commit 633a5c6 / patch 3)】
- 信憑性: **高（事実・コード適用済み）**
- 現コード検証: `parts/CopyButton.vue` および `helpers/presetsImport/ConfigImport.vue` は既に削除済み。

#### C-2 未参照の i18n キー【適用済み(commit 633a5c6 / patch 3)】
- 信憑性: **高（事実・コード適用済み）**
- 現コード検証: `AppItemsCharacters.ts` の `appHeader` 5 キー、`PlaceholderMessages.ts` の `inputMode`/`toggleModeTitle`、`PostFlow.ts` の `messageEditor` は既に削除済み。

#### C-3 未使用の型・引数・変数【適用済み(commit 633a5c6 / patch 3)】
- 信憑性: **高（事実・コード適用済み）**
- 現コード検証: `SidebarType.ts` の型定義削除、`IconKeyChanger.vue` の未使用変数削除、`useEventProperties.ts` の第 1 引数 `data` 削除はすべてコードに反映済み。

#### C-4 `parts/SectionCard.vue` の `toggle` emit と、呼び出し側の `isOpen` / `toggleSection`【未修正・報告のみ】
- 信憑性: **高（コード事実の指摘として正確）**
- 現コード検証: `SectionCard.vue` は prop `isOpen` を宣言しておらず、`toggle` emit も一切実装されていない。呼び出し側各エディターの `@toggle="toggleSection(...)"` や `:isOpen` は実質 no-op。折りたたみ機能の再実装か一斉削除か、UI 設計方針の確認が必要。

#### C-5 `apps/dataPacks/` 一式【未修正・保持方針】
- 信憑性: **高（将来機能として保持の指示あり）**
- 現コード検証: `DataPacks.vue` は他から import されていない。しかし「将来のアップデートで使用。消さないこと。TODOも書いておくこと。」との方針が示されており、現行コードでも削除せず保持されている。

#### C-6 軽微(報告のみ)
- 信憑性: **高（コード事実の指摘として正確）**
- 現コード検証: `JsonMergeEditor.vue` の未使用 v-for 変数、`useSidebarSectionMap.ts` の内部専用 export などの指摘は正確。一部（`JsonMergeEditor` の `remap` → `_remap`）は patch 6 で解消済み。

### 4-2. 要確認（コード検証結果）

| 対象 | 内容 | 現コード検証と信憑性評価 |
| --- | --- | --- |
| (削除済み)`PostFlow/PostActionsPreview.vue` | assets 内に import なし。単数形と名前重複 | **高（妥当）**: commit `19973c3` で削除済みであることを確認。 |
| (削除済み)`PostFlow/Message/MessageTextEditor.vue` | `MessageTextDialog` に置き換わっており import なし | **高（妥当）**: commit `19973c3` で削除済みであることを確認。 |
| `MikujiEditor` 上部の Character/IconKey ボタンと `MikujiSettings` 内の同ボタン | 全体変更とアイテム単位変更の二段構成 | **中〜高**: 意図的 UI 設計（全体一括設定 vs 各アイテムのオーバーライド）。デッドコードではない。 |
| `const { data } = useOmikujiStore()` の分割代入 | `MessageSettings.vue:48` でリアクティビティ喪失の懸念 | **高（事実）**: `MessageSettings.vue:48` で `const { data } = useOmikujiStore()` と分割代入されており、`data.value` 再代入時にリアクティビティが途切れる不具合の疑いあり。 |
| `EmotionGrid.vue` の `normalizeKey` | 数字キーに `k` を付与して emit する処理 | **高（事実）**: `EmotionGrid.vue:64` に `const normalizeKey = (key: string) => (/^\d+$/.test(key) ? 'k' + key : key)` が存在。キー比較不一致の懸念あり。 |
| `PostActionItem.vue` の `createDefaultAction` | Zod スキーマの既定値と重複 | **高（事実）**: `createDefaultAction` と Zod スキーマで初期値生成が二重実装。ただし型安全性・キャッシュ復元との兼ね合いがありリファクタ要検討。 |
| `ActionsEditor` などの `:isIsEnabled="false"` | prop 名が不自然 | **高（事実）**: `BaseEditor.vue:68` に `isIsEnabled?: boolean`（デフォルト `true`）として定義されており、有効化トグルの表示制御用。プロパティ名のタイポ的命名だが正常に動作している。 |
| `events/trigger/TriggerUserId.vue` | import 元がなく、条件側 `TriggerChecker.ts` にのみ `userIds` 実装あり | **高（事実）**: `TriggerUserId.vue` は現在どこからも import されていない。判定エンジン側の `trigger.userIds` は実装済みのため、未接続の UI か、不要 UI の残骸。 |

### 4-3. 機能不具合の疑い(デッドコードではないが調査中に発見・コード検証)

- `EmotionAnimationEditor.vue`: **信憑性 高（不具合の疑い事実）**
  - 現コード検証: `duration` スライダーや `loop` チェックボックスは `localAnimation` ref を直接書き換えるのみで、`emit('update:animation')` を呼ぶハンドラーや watcher が存在しない。アニメーション種別（`type`）のセレクトボックスの `@change="applyAnimation"` を通さないと保存されない。
- `EmotionLayerEditor.vue`: **信憑性 高（不具合の疑い事実）**
  - 現コード検証: `handleSetDefaultPath` が `props.src.length === 0 ? [newPath] : [newPath, ...props.src.slice(1)]` と常に index 0 番目のレイヤーを書き換える実装になっている。どのレイヤーのボタンを押しても先頭レイヤーが対象になる。
- `CommentVoiceSettings.vue`: **信憑性 高（不具合の疑い事実）**
  - 現コード検証: `currentDisplayOption = computed(() => props.modelValue)` に対し、template で `v-model="currentDisplayOption.mode"` や `v-model="currentDisplayOption.frameId"` と props 参照の内部プロパティを直接ミューテーションしている。
- `DelaySecondsAdjuster.vue`: **信憑性 高（仕様上の懸念事実）**
  - 現コード検証: 調整処理後に delaySeconds 昇順でソートするため、並び順が変わりタブの index（`activeTab`）とのズレが発生しうる。
- `PostActionsTabs.vue`: **信憑性 高（構文的瑕疵事実）**
  - 現コード検証: `<button class="tab">` の内部に `MenuDropdown`（内部で `<button>` を描画）が配置されており、HTML 仕様（button 要素のネスト禁止）に抵触している。
- `MessageSettings.vue:48`: **信憑性 高（リアクティビティ追従の懸念事実）**
  - 現コード検証: `const { data } = useOmikujiStore()` で分割代入しており、`storeToRefs` を介していないため、Store の `data.value` 全体置換時に追従しなくなるリスクがある。

### 4-4. 問題なし(確認できた範囲)

- 4 エディターの editorMap 連鎖、`PlaceholderEditor` / `ValuesEditor` / Input / Preview の各 Mode
- `ActionSetValidator.ts` / `useWeightCalculation.ts`(使用中)
- `CharacterBase64Settings.vue`(`CommentVoiceSettings` から使用。前回の「要確認」を解除)
- `InlinePlaceholderDialog.vue`(`<< >>` 構文は意図した別記法)
- `WeightBar` / `WeightItem` / `OmikujiItemHeader` / `OmikujiItemPriority`
- `SoundSettings` / `WordPartySettings` / `GameScriptSettings`(`getRegisteredGameScriptKeys` による登録式)
- `IconSelectorModal` / `EmotionCard` / `EmotionImageItem` / `EmotionPresetButtons`

---

## 5. 優先順位(削除候補)

1. A-1 `isCommentMode`(影響範囲が広く、確実)
2. A-2 〜 A-9(確実な未使用・到達不能。まとめて掃除できる)
3. A-10 〜 A-12(assets 外の確認後に削除)
4. A-13 重複ロジックの統一(リファクタ)
5. A-14 / A-15 軽微な掃除

---

## 6. 未確認事項とその理由

- `PostActionsPreview.vue` / `MessageTextEditor.vue` の assets 外参照: 検索 API が使えず、`src/editor` 全体を読めていない
- i18n キーの未使用判定(`postFlow.actionPreview.hidden`、`postFlow.actionsPreview.*` など): ロケールファイル未読
- `defaultBasePlaceholderLabel` が他で使われているか: `src/types`、`src/maps` 未読
- テスト・ビルド設定・開発ツールからの参照: 未調査
- 動的 import / レジストリ経由の呼び出し: `ContentArea.vue` 以外の仕組みは未確認(`gameScriptRegistry` は存在のみ確認)
- `BaseEditor.vue` の prop(`category` / `isIsEnabled`)の用途: 簡易スクリプトで「宣言された prop が参照されていない」ものは検出されなかったが、中身は未精読
- `TimerEditor` の `isEnabled` の型(未定義になりうるか): `src/types/OmikujiData` のイベントスキーマ定義の場所を未特定

---

## 7. 次に調査するファイル・ディレクトリ

1. `src/editor/apps/` 配下(`appItems` の `preview/`、`navigation`、`dataPacks`、`BaseSettings`、`JsonMerge`)
   - `PostActionsPreview` / `MessageTextEditor` の参照元になりうる
2. `src/editor/parts/`(`BaseEditDialog`、`SettingItem`、`CharacterPicker`、`MenuDropdown`、`NoParamsCard`、`InformationCard`、`SectionCard`、`ColorPicker`)
3. `src/editor/helpers/`(`useTestPost`、`useJsonClipboard`、`CharacterChanger/composables/useCharacterLookup`)
4. `src/editor/stores/`(`useOmikujiStore`、`useGetAssetData`、`useNavigationStore`)
   - 分割代入のリアクティブ性と、未使用 export の確認
5. `src/maps/OmikujiData` と `src/types/OmikujiData`(`defaultBasePlaceholderLabel`、`postFlowKindMap`、`handelNormalizedValues`)
6. ロケールファイル(A-8 と `PostActionsPreview` 関連キー)
7. `PostFlow/composables/usePostActionsTab.ts` の中身、`ImageSettingsInfo.vue`
8. テスト、`vite.config`、`package.json`

---

## 8. 修正済み箇所と変更内容(2026-10-25 / patch 1: `src/editor/assets` + 関連 i18n)

コードを clone して grep で全リポジトリ(src / tools / packages / server / vite 設定)を確認した上で修正。`vue-tsc --noEmit` は修正前後ともエラー 0、変更ファイルの eslint もエラーなし。

| 項目               | 変更                                                                                                                                                                                          | 根拠                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 未参照ファイル削除 | `PostFlow/PostActionsPreview.vue`、`PostFlow/Message/MessageTextEditor.vue`                                                                                                                   | リポジトリ全体で import・文字列参照なし。`import.meta.glob` や動的 import による参照もなし |
| i18n               | `src/i18n/editor/assets/PostFlow.ts` の `postFlow.actionsPreview`(ja/en)、`postFlow.actionPreview.hidden`(ja/en)を削除                                                                        | 参照元が上記削除ファイルと A-8 の分岐のみ。テンプレートリテラルによるキー組み立てなし      |
| A-2                | `PostActionItem.vue` の prop `index`、emit `duplicate`/`remove`、`v-for` の未使用 `meta`(`_` に変更)を削除。`PostFlowsEditor.vue` の `:index`/`@duplicate`/`@remove`(PostActionItem 側)を削除 | PostActionItem の利用元は PostFlowsEditor のみ。複製・削除はタブ側(PostActionsTabs)で処理  |
| A-3                | `ActionsEditor.vue` の PostFlowsEditor への `category` / `selectedItemKey` を削除                                                                                                             | 受け側は `modelValue` のみ                                                                 |
| A-5                | `IconSelector.vue` の `showHoverSelector`、emit `showSelector` を削除                                                                                                                         | 参照・利用元とも未使用                                                                     |
| A-6                | `PlaceholderTextMode.vue` の `error` フィールドと `getErrorMessage` を削除                                                                                                                    | `item.error` はどこでも読まれない(`hasError` のみ使用)                                     |
| A-7                | `TestPlaceholderProcessor.ts` の no-op な `highlighted` を除去(戻り値は同値)                                                                                                                  | コールバックが引数をそのまま返すだけ                                                       |
| A-8                | `PostActionPreview.vue` の到達不能な `if (!processed)` を削除                                                                                                                                 | `processTestPlaceholder` は常にオブジェクトを返す                                          |

### 修正しなかった項目

- A-1(撤回、LiveClockEditor が false 側を使用)、A-4(events 側の呼び出しを含むため保留)、A-9(確信度低下)
- A-10〜A-15、4-2 の要確認項目、4-3 の不具合疑い: 確信度が中・低、または意図確認が必要なため報告のみ

## 8-2. 修正済み箇所と変更内容(2026-10-25 / patch 2: `src/editor/events` + 関連 i18n)

clone して grep で全リポジトリを確認した上で修正。`vue-tsc --noEmit` は修正前後ともエラー 0、変更ファイルの eslint もエラーなし(テストファイルはリポジトリにない)。改行コード(CRLF / LF 混在)は各ファイルの既存のまま維持。

| 項目 | 変更                                                                                                                                                                                                       | 根拠                                                                                               |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| A-4  | `MikujiSettings.vue` の prop `category` と `EventCategoryType` import を削除。呼び出し側 5 か所(`MikujiEditor`、`CommentEditor`、`ReactionEditor`、`ServiceEditor`、`TimerEditor`)の `category` 属性を削除 | `MikujiSettings` の呼び出しは上記 5 か所のみ。`category` は script / template のどちらでも参照なし |
| B-1  | `CommentEditor.vue` の `SectionType` から `'scriptGame'` を削除                                                                                                                                            | `categorySectionMap.comments` に存在しない                                                         |
| B-2  | `EventTriggers.ts` の `triggerService`(ja / en)、`CommentEditor.ts` と `ReactionEditor.ts` の `disabledNotice`(ja / en)を削除                                                                              | 全リポジトリで参照なし、動的キー組み立てなし                                                       |
| B-3  | `ServiceEditor.vue` の import 名を `ServiceTrigger` に統一。`ServiceTrigger.vue` と `TimerIntervalEditor.vue` の誤ったコメントを修正                                                                       | 挙動への影響なし                                                                                   |

### 修正しなかった項目

- B-4(確信度 中)、B-5(中〜低)、`TriggerUserId.vue`(`userId` 条件が判定側に実装済みで、意図が不明)
- patch 1 から引き続き: A-1(撤回)、A-9、A-10〜A-15、4-2 の要確認項目、4-3 の不具合疑い

## 8-3. 修正済み箇所と変更内容(2026-10-25 / patch 3: `src/editor` の apps・parts・helpers・stores・types + 関連 i18n)

patch 2 適用後の状態を基準にしている(`dead-code-review.md` が patch 2 と重なるため、patch 2 → patch 3 の順で適用する)。`vue-tsc --noEmit` は修正前後ともエラー 0、変更ファイルの eslint もエラーなし。この範囲は機械走査が中心で、精読していない。

| 項目 | 変更                                                                                                                                                                                                                | 根拠                                 |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| C-1  | `parts/CopyButton.vue`、`helpers/presetsImport/ConfigImport.vue` を削除                                                                                                                                             | リポジトリ全体で参照なし             |
| C-2  | `AppItemsCharacters.ts` の `appHeader` 5 キー、`PlaceholderMessages.ts` の `inputMode` / `toggleModeTitle`、`PostFlow.ts` の `messageEditor`(いずれも ja / en)を削除                                                | 全リポジトリで参照なし、動的キーなし |
| C-3  | `SidebarType.ts` の `SidebarVariant` / `SidebarRecordCategory`(と未使用 import)、`IconKeyChanger.vue` の未使用 `changeScope`、`useEventProperties` の未使用引数 `data`(`useOmikujiStore.ts` の呼び出しも変更)を削除 | 参照ゼロ、`vue-tsc --noUnusedLocals` |

### 修正しなかった項目

- C-4(`SectionCard` の折りたたみ関連)、C-5(`dataPacks`)、C-6(軽微な `export` など)、4-3 の `MessageSettings.vue` の分割代入
- 範囲外で `--noUnusedLocals` が検出したもの(未修正): `server/dev-api.ts`、`src/sdk/subscribe/GetReactions.ts`(`platform`)、`src/ui/common/useStreamCounters.ts`、`tools/viteConfig/*AssetsPlugin.ts`(`res`)、`tools/webpackBuild/processors/template/TemplateJsonProcessor.ts`(未使用 import 2 件)

## 9. 次に調査する箇所(更新)

1. `src/editor/apps/`、`parts/`、`helpers/`、`stores/` の精読(今回は機械走査のみ)。特に `BaseEditor.vue`、`useNavigationStore.ts`、`helpers/KeyEditor`、`helpers/presetsImport`、`apps/navigation`
2. `src/editor/ui/`、`src/editor/dev/`(機械走査のみ)
3. `src/maps/OmikujiData`、`src/types/OmikujiData`(`serviceSimpleComparisonConditionMap` の将来用途、`defaultBasePlaceholderLabel`、`isEnabled` の型)
4. `usePostActionsTab.ts` の戻り値、`ImageSettingsInfo.vue`
5. `src/common`、`src/engine`、`src/games`、`src/generator`(`TriggerChecker.ts` の `userIds` と editor の対応も)、`src/layout`、`src/manager`、`src/plugin`、`src/sdk`、`src/ui`、`src/console`(未着手)
6. テスト・ビルド設定(vite / tsconfig / eslint)、package.json

## 8-4. patch 4(2026-10-25 / `src/editor/stores`・`src/editor/parts` の精読)

patch 3 適用後の状態が基準(patch 3 → patch 4 の順で適用)。`vue-tsc --noEmit` は修正前後ともエラー 0。

### 読み取り済み(全文)

- `stores/`: `useGetAssetData` / `useGetEventData` / `useNavigationStore` / `useOmikujiStore` と `composables/` の全 10 ファイル
- `parts/`: `BaseEditDialog` / `CharacterPicker` / `ExternalLinkButton` / `HudPreview` / `InformationCard` / `MenuDropdown` / `ModalFooterActions` / `NoParamsCard` / `SettingItem` / `SubSectionHeader` / `ColorPicker/*`(`SectionCard` は patch 3 で確認済み)

### 修正済み

| 項目 | 変更                                                                                                         | 根拠                       |
| ---- | ------------------------------------------------------------------------------------------------------------ | -------------------------- |
| D-1  | `parts/HudPreview.vue` の左下ブロックのコメント(「右下に配置するHUD用のスロット」の重複)を実態に合わせて修正 | コメントのみ。挙動変更なし |

### 発見事項(修正せず・報告のみ)

- D-2 `stores` の呼び出し元ゼロの公開 API(確信度 中。`src` / `tools` / `packages` / `server` を grep): `hasEvent`(`useGetEventData`)、`clearSelection`(`useNavigationStore`)、`clearAssets`(`useAssetCRUD`)、`updatePlaceholderValues`(`useAssetProperties`。`data` 引数と `WeightValuesArraySchema` もこれ専用)。`isDataCategory` は store の返り値としては未使用だが内部で使用。CRUD の対称性のために残している可能性があり、保留
- D-3 `parts` の呼び出し元ゼロの prop / slot(確信度 中。全 `.vue` の開始タグを解析、`v-bind="obj"` による受け渡しなし): `SettingItem` の `showWarning` / `helpUrl` / `helpLabel` / slot `label-extra`(関連 i18n `appInfoEditor.settings.common.warning` / `help`)、`InformationCard` の `icon`、`HudPreview` の slot `hudLeft`、`MenuDropdown` の `disableDelete`、`CharacterPicker` の `size`(既定値 64 のみ使用)。ヘルプリンク(チートシート)など将来用に用意した可能性があり保留
- D-4 `apps/appInfo/meta/PackageSystemInfo.vue:15-17`: `ExternalLinkButton` の既定スロットに `<ExternalLink>` を渡しているが、`ExternalLinkButton` はスロットを持たないため描画されない(アイコンは本体側にある)。`PackageSystemInfo` 側の `ExternalLink` import は不要になる(`apps` の精読時に確認)
- D-5 `parts/InformationCard.vue`: `VARIANT_ICON: Record<..., any>` は `Component` 型にできる(型の整理)。確信度 低

### 問題なし

- `useDataIO` / `useDataMerge(+Helpers)` / `useEventCRUD` / `useEventSort` / `useAssetSort` / `useSettingsOperations`(`resetSettingsField` / `toggleDaisyUiTheme` は使用中)
- `BaseEditDialog` / `ModalFooterActions` / `NoParamsCard` / `SubSectionHeader` / `ColorPicker` / `ColorPreset` / `ExternalLinkButton`(本体)/ `CharacterPicker`

## 9-2. 次に調査する箇所(patch 4 時点)

1. `src/editor/apps/`(精読: `BaseSettings/BaseEditor.vue`、`navigation`、`JsonMerge`、`dataPacks`、`appInfo`、`appItems`)。D-4 もここで確認
2. `src/editor/helpers/`(精読: `KeyEditor`、`presetsImport`、`presetsExport`、`CharacterChanger`、`IconKeyChanger`、`useTestPost` ほか)
3. `src/editor/ui/`、`src/editor/dev/`、`src/editor/maps`、`src/editor/types`
4. 以降は「9. 次に調査する箇所」の 3〜6 のとおり(`stores` / `parts` は完了)

## 8-5. patch 5(2026-10-25 / `src/editor/apps` の一部: `BaseSettings`・`JsonMerge`・`appInfo`)

patch 4 適用後の状態が基準(patch 4 → patch 5 の順で適用)。`vue-tsc --noEmit` は修正前後ともエラー 0、変更ファイルの eslint もエラーなし。

### 読み取り済み(全文)

- `BaseSettings/`(`BaseEditor` / `BaseTagEditor`)、`JsonMerge/`(`JsonMergeEditor` / `JsonMergeRemapEditor` / `JsonMergeSourceFileSelector`)
- `appInfo/` 全 11 ファイル(`AppInfoEditor` / `AvailableFeatures/*` / `meta/*` / `settings/*`)。全コンポーネントの import 元を確認(`BaseEditor` 9 / `JsonMergeEditor` 2 / その他 1〜4)

### 修正済み

| 項目 | 変更                                                                                                                                            | 根拠                                                                                                          |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| D-4  | `appInfo/meta/PackageSystemInfo.vue`: `ExternalLinkButton` の既定スロットに渡していた `<ExternalLink>` と、その `lucide-vue-next` import を削除 | `ExternalLinkButton` は `<slot>` を持たず(本体側でアイコンを描画)、渡した内容は描画されない。表示は変わらない |
| S-1  | `JsonMerge/JsonMergeEditor.vue`: 冗長な `md:grid-cols-2`(基準の `grid-cols-2` と同値)を削除                                                     | クラスの効果なし                                                                                              |

### 発見事項(修正せず・報告のみ)

- D-6 `appInfo/AvailableFeatures/FeatureCard.vue`(確信度 中): 唯一の呼び出し元(`AvailableFeaturesInfo`)が `show-toggle=false` / `is-enabled=true` を固定で渡している。`showToggle` / `featureKey` / `toggle` emit / `handleToggle` / `CheckCircle` / `XCircle` / `isVisible` / 無効時のクラス分岐は現状到達しない。トグル機能を後で使う想定の可能性があり保留
- S-2 コードスタイルの不統一(確信度 低・保留): `BaseSettings/BaseTagEditor.vue` と `JsonMerge/*` は日本語の文言を直書き(`appInfo` は i18n の `t()` を使用)。i18n 化は文言追加を伴うため今回は対象外
- S-3 `JsonMerge/JsonMergeRemapEditor.vue` の「元キャラキー」の選択肢が `omiken` / `omiken2` 固定。仕様の可能性があり変更なし

### 問題なし

- `BaseEditor` / `BaseTagEditor` / `JsonMergeRemapEditor` / `JsonMergeSourceFileSelector` / `AppInfoEditor` / `AvailableFeaturesInfo` / `PackageBasicInfo` / `PackageDistributionInfo` / `EditorSettingsEditor` / `GeneratorSettingsEditor`(未使用の import・変数・関数なし)

## 9-3. 次に調査する箇所(patch 5 時点)

1. `src/editor/apps/appItems/`(`useVersionCheck` は `PackageSystemInfo` の `openLatestRelease` 以外の使われ方を確認、`preview/*`、`ContentArea` ほか)
2. `src/editor/apps/dataPacks/`、`src/editor/apps/navigation/`(`SidebarItemMenu` 233 行が最大)
3. `src/editor/helpers/`(精読)
4. `src/editor/ui/`、`src/editor/dev/`、`src/editor/maps`、`src/editor/types`
5. 以降は「9. 次に調査する箇所」の 3〜6 のとおり

## 8-6. patch 6(2026-10-25 / `src/editor/apps` の残り: `appItems`・`dataPacks`・`navigation`)

patch 5 適用後の状態が基準(patch 5 → patch 6 の順で適用)。`vue-tsc --noEmit` は修正前後ともエラー 0。`--noUnusedLocals --noUnusedParameters` で `src/editor/apps` の指摘は 0 件(修正前は 1 件)。変更ファイルの eslint もエラーなし。これで `src/editor/apps` は全ファイルの精読を完了した。

### 読み取り済み(全文)

- `appItems/` 全 20 ファイル(`AppDevWorld` / `AppHeader` / `ContentArea` / `useVersionCheck` / `preview/*` 全 12 ファイル)
- `dataPacks/` 全 3 ファイル
- `navigation/` 全 22 ファイル(`composables/` 8 ファイルを含む)。公開関数・prop・emit の参照元を grep で確認し、すべて使用中

### 修正済み

| 項目 | 変更                                                                                                                    | 根拠                                                                   |
| ---- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| D-8  | `JsonMerge/JsonMergeEditor.vue`: `v-for="(remap, j)"` の未使用変数を `_remap` に変更                                    | `--noUnusedLocals` の指摘(`remap` は未参照)。挙動変更なし              |
| D-9  | `navigation/NavigationSidebarFooter.vue`: `:disabled="!hasChanged \|\| !saveFileName"` から `\|\| !saveFileName` を削除 | 親の `<template v-if="saveFileName">` の内側なので常に偽。挙動変更なし |

### 発見事項(修正せず・報告のみ)

- D-7 `appItems/preview/ThresholdPreview.vue`(確信度 中): `mode='criteria'` を渡す呼び出し元がない(`SidebarSectionList` は `services` / `reactions` のときだけ `mode` を渡す)。`criteria` 分岐、`data.criteria`、i18n `appPreview.threshold.criteriaTitle` は現状到達しない。追加発動条件のプレビューを後で使う想定の可能性があり保留
- D-10 `appItems/useVersionCheck.ts`(確信度 中): `VersionInfo.isLatest` / `isLoading` と、それを作る `isLatest` の computed は読み取り元がない(`AppHeader` は `current` / `error` / `hasNewVersion` / `latest` のみ使用)。`PackageSystemInfo` は URL 取得のためだけに `useVersionCheck` を呼んでいる(定数 URL を直接参照する形でも足りる)。リリース URL の TODO(定数の分離)と同時に整理する余地があり保留
- D-11 `dataPacks/useDataPacks.ts`: `error` ref は代入されず常に `null`(`DataPacks.vue` のエラー表示は到達しない)。`dataPacks/` 一式は C-5 のとおり import 元なしのままで、今回も未修正
- D-12 `navigation/composables/useSidebarSectionMap.ts`: `useUiSections` の `export` は同ファイル内でのみ使用(確信度 低、軽微)
- D-13 `appItems/ContentArea.vue`: `editorMap: Record<CategoryType, any>` の `any`(型の整理、確信度 低)

### 問題なし

- `AppDevWorld`(`EditorApp.vue` から使用)、`AppHeader`、`ContentArea`、`HoverPopup`、`staticSectionPreviewMap`(全キーが `CategorySectionMap` の `component` で使われている)、他の `preview/*`
- `navigation/` の全コンポーネントと全 composables

## 9-4. 次に調査する箇所(patch 6 時点)

1. `src/editor/helpers/`(精読: `KeyEditor`、`presetsImport`、`presetsExport`、`CharacterChanger`、`IconKeyChanger`、`useTestPost` ほか)。`useImportManager.loadFromJsonData` の `any` も確認
2. `src/editor/ui/`、`src/editor/dev/`、`src/editor/maps`(`CategorySectionMap` ほか)、`src/editor/types`、`src/editor/presets`
3. 以降は「9. 次に調査する箇所」の 3〜6 のとおり(`src/editor/apps` は完了)

## 8-7. patch 7(2026-10-25 / `src/editor/helpers` 全体)

patch 6 適用後の状態が基準(patch 6 → patch 7 の順で適用)。`vue-tsc --noEmit` は修正前後ともエラー 0。`--noUnusedLocals --noUnusedParameters` で `src/editor/helpers` の指摘は 0 件(修正前も 0 件)。変更ファイルの eslint もエラーなし。これで `src/editor/helpers` は全 38 ファイルの精読を完了した。

### 読み取り済み(全文)

- `CharacterChanger/`(13 ファイル)、`IconKeyChanger/`(6 ファイル)、`KeyEditor/`(8 ファイル)
- `presetsExport/`(2 ファイル)、`presetsImport/`(8 ファイル)
- 直下の `useJsonClipboard.ts` / `useScrollToSection.ts` / `useTestPost.ts`(import 元: `OmikujiItemToolbar` / `EditorApp` / `MikujiSettings` ほか)

### 修正済み

| 項目 | 変更                                                                                                                                                         | 根拠                                                                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-14 | `presetsImport/composables/useImportManager.ts`: 未使用の `loadFromFile` 関数と return の項目を削除                                                          | リポジトリ全体(`node_modules` 除く)で定義と return 以外の参照なし。呼び出し側(`DataPacks.vue` / `FileMenuDropdown.vue`)は `loadFromJsonData` を使用 |
| D-15 | `presetsExport/useConfigExport.ts`: `type === 'config' ? '設定' : 'テンプレート'` の到達しない分岐を `'設定ファイルの出力中にエラーが発生しました'` に単純化 | `ExportType` は `'config'` のみ。表示文言は変わらない                                                                                               |
| D-16 | `presetsExport/ConfigExport.vue`: `:disabled="!hasChanged \|\| !saveFileName"` から `\|\| !saveFileName` を削除                                              | 親の `<template v-if="saveFileName">` の内側なので常に偽(D-9 と同じ)。挙動変更なし                                                                  |

### 発見事項(修正せず・報告のみ)

- D-17 `presetsImport/composables/useImportManager.ts`(確信度 中): 返り値の `hasImportedData` / `hasPreviewData` / `loadError` / `resetImportProcess` は読み取り元なし。`loadFromJsonData` の引数と戻り値は `any`(`ConfigImportModal` / `DataPacks` / `FileMenuDropdown` が `res.data` を使うため型付けには呼び出し側の確認が必要)
- D-18 `presetsImport/ConfigImportModal.vue`(確信度 低): `computed` の中で `updateComponentConfig` を呼ぶ副作用がある。動作しているため変更しない
- D-19 `presetsImport/ComponentConfigSection.vue`(確信度 低): `<label>` が入れ子になっていて、「既存の設定」のラジオだけ内側の `<label>` の外にある。HTML の整合性の問題で、未使用コードではないため変更しない
- D-20 `CharacterChanger/composables/useModalState.ts` と `IconKeyChanger/composables/useIconKeyModalState.ts`、`useCharacterUpdater` と `useIconKeyUpdater` はほぼ同形(重複)。共通化は挙動確認が必要で保留(確信度 低)
- D-21 `CharacterChanger.vue` / `CurrentCharacterList.vue` / `IconKeyChanger.vue` に同じ `@keyframes pulse` / `.animate-pulse` の scoped 定義が重複(確信度 低)
- D-22 `useTestPost.ts`(要確認・変更なし): `postTestOmikuji` の `priorityItems` は `!item.lottery.isPriority` で絞り込んでおり、名前と条件が逆に見える。未使用コードではなく仕様の確認が必要
- D-23 `KeyEditor/composables`: `validateKeyFormat` / `validateKeyDuplication` の `export` は同ファイル内でのみ使用、`KeyUpdateStrategy.updateReferences` は全戦略が持つため `?` は不要、`usePostActionCharacters` の `isInvalidIconKey` は返り値としては未使用(確信度 低・軽微)

### 問題なし

- `CharacterChanger` / `IconKeyChanger` の全コンポーネントと composables(`ChangeScope` / `totalItems` ほか使用中)、`KeyEditor` 一式、`importHelpers.ts`、`CategoryConfigSection` / `CategoryModeSelector` / `ConflictsList`、`useJsonClipboard`、`useScrollToSection`

## 9-5. 次に調査する箇所(patch 7 時点)

1. `src/editor/ui/`、`src/editor/dev/`、`src/editor/maps`(`CategorySectionMap` ほか)、`src/editor/types`、`src/editor/presets`、`src/editor/i18n`、`src/editor/` 直下(`EditorApp.vue` ほか)
2. 以降は「9. 次に調査する箇所」の 3〜6 のとおり(`src/editor/helpers` と `src/editor/apps` は完了)

## 8-8. patch 8(2026-10-25 / `src/editor` の残り: `ui`・`dev`・`shell`・`presets`・`maps`・`types`・直下)

patch 7 までが upstream に適用済みであることを確認した上で実施(`parts/CopyButton.vue` と `helpers/presetsImport/ConfigImport.vue` が存在しない、`useImportManager.loadFromFile` が存在しない)。`vue-tsc --noEmit` は修正前後ともエラー 0、`--noUnusedLocals --noUnusedParameters` は `src/editor/{ui,dev,shell,presets,maps,types}` と直下で指摘 0 件。変更ファイルの eslint もエラーなし。これで `src/editor` は全域の精読を完了した。

### 読み取り済み(全文)

- `ui/` 全 6 ファイル(`UiEditor` / `uiEditorRegistry` / `common/*` / `conditions/*`)
- `dev/` 全 4 ファイル(`EvaluationBlock` / `evaluationStats` / `TestComment` / `VirtualStreamPanel`)
- `shell/` 全 5 ファイル、`presets/` 全 9 ファイル、`maps/` 全 2 ファイル、`types/` 全 8 ファイル
- `src/editor/App.vue` / `EditorApp.vue` / `i18n.ts`
- 参照確認のために読んだもの: `apps/navigation/composables/useSidebarPreset.ts`(プリセットの利用側)、`src/i18n/editor/category/NavigationSidebarMessagesMap.ts` の `presets` ブロック

### 確認した参照関係

- `App.vue` → `EditorApp`(`v-show`)/ `ShellToolbar` / `GeneratorView`(非同期。`GeneratorLoading` が読み込み中表示)。`GeneratorView` → `GeneratorStage` / `TestComment` / `VirtualStreamPanel` / `EvaluationBlock`
- `presets/index.ts` の `presetMap` 8 カテゴリ → `useSidebarPreset` が `getPresets` で使用。プリセット 24 件の `id` は、`NavigationSidebarMessagesMap.ts` の `presets.{category}.{id}`(ja / en)と過不足なく対応(古い未使用キーなし)
- `types/` の export は全て外部から参照あり(例外は下の D-27)。`maps/` の `categorySectionMap` / `appInfoSections` / `colorFields` も使用中

### 修正済み

| 項目 | 変更                                                                                                                                                                          | 根拠                                                                                                                                                                                                                          |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-24 | `dev/EvaluationBlock/EvaluationBlock.vue` の `submitForm`: 冗長な `isQuoted` 判定を削除し `parseVariableValue(formValue.value)` に統一                                        | `parseVariableValue` が引用符の除去を同じ規則で処理している。12 パターン(`12` / `'12'` / `"abc"` / `''` / `'a` / `'a'b'` / `0x10` ほか)で、削除前後の結果が一致することを実行して確認                                         |
| D-25 | `presets/types.ts`: `PresetBuildResult` の末尾にある、どのメンバにも付いていない孤立コメント(「作成後に選択するデータ…」)を削除                                               | 該当プロパティは存在しない。挙動は `useSidebarPreset.addPreset`(events[0]、なければ先頭の assets を選択)側に実装済み                                                                                                          |
| D-26 | `types/events/index.ts` を削除。`types/index.ts` の `// export * from './events'` と、`types/apps/index.ts` の `// export * from './presetsImportType'`(コピー元の名残)を削除 | `types/events/index.ts` はコメントのみで export がなく、リポジトリ全体で import なし(`editor/types/events` / `./events` ともに 0 件)。削除前後の `vue-tsc` エラー 0。将来 events 用の型を置く予定があれば、復元するだけでよい |
| D-28 | `EditorApp.vue`: `daisyUiTheme` / `isDevWorld` の上にあった古いコメント「インポートマネージャー」を実態に合わせて修正                                                         | コメントのみ。インポート処理は `EditorApp` にはない                                                                                                                                                                           |

### 発見事項(修正せず・報告のみ)

- D-27 `types/apps/SidebarType.ts`(確信度 低): `CategoryGroupId` は `export` だが外部参照なし(`CategoryGroup` の内部でのみ使用)。`presets/index.ts` の `PresetBuildResult` の再 export も外部から使われていない。`evaluationStats.ts` の `NumberSummary` / `StringSummary` / `WildcardSummary` の `export` も同様(C-6 と同種)
- D-29 `shell/GeneratorStage.vue`(確信度 中): `BackgroundKey` の `'green'` と `BG_STYLES.green` は、`BG_OPTIONS` に選択肢がなく初期値も `'checker'` なので到達しない。クロマキー用の背景を戻す予定の可能性があり保留。`SIZE_PRESETS` のラベルが `'300x400'`(英字の x)と `'600×900'`(×)で不統一(表示文言のため変更せず)
- D-30 `dev/VirtualStreamPanel/VirtualStreamPanel.vue`(確信度 低): `store._devSetMeta?.(fields)` は `?.` つき、`store._devReleaseMeta()` は `?.` なし。`ServiceMetaStore` はどちらも必ず持つので `?.` は不要だが、型 `MetaState` 側では `_devSetMeta` が任意メソッドのため残している。ヘッダーに `cursor-pointer` がない(`TestComment` / `EvaluationBlock` にはある)。`TestComment.vue` の `burstSend` は `async` だが `await` がない
- D-31 `dev/` と `shell/` と `EditorApp.vue` の表示文言・トーストは日本語直書き(i18n 外)。開発用 UI のため意図的な可能性があり、i18n 化は文言追加を伴うので対象外
- D-32 `App.vue` と `EditorApp.vue` の両方が `data-theme` を設定している(`App.vue` に「EditorApp.vue の daisyUiTheme と同じ」というコメントあり。意図的な二重指定)

### 範囲外で気づいたこと(未調査・変更なし)

- (patch 9 で訂正)`src/sdk/types/` は未使用ではなく、`src/sdk/post/PostOneComme.ts` が `@/sdk/types` から `SendCommentType` / `SendTestCommentSchema` を import している。`src/types/subscribe/SendCommentSchema.ts` とはほぼ同内容の複製で、`engine/PostOmikuji/PostOmikujiService.ts` と `editor/dev/TestComment/TestComment.vue` は `@/types/subscribe` 側を使っている(8-9 の D-36 を参照)

## 9-6. 次に調査する箇所(patch 8 時点)

1. `src/sdk`(`src/sdk/types/` の複製疑いの確認から。`src/sdk/post/PostOneComme.ts`、`subscribe/GetReactions.ts` の未使用引数 `platform` もここ)
2. `src/common`、`src/engine`、`src/games`、`src/generator`(`TriggerChecker.ts` の `userIds` と editor の `TriggerUserId.vue` の対応も)、`src/layout`、`src/manager`、`src/plugin`、`src/ui`(`useStreamCounters.ts` の未使用 `_`)、`src/console`、`src/maps`、`src/i18n`
3. `src/types`(編集不可。参照されていない型の報告のみ)、`src/registerAll.ts` / `registerRuntime.ts` / `main.ts` / `DevApp.vue` / `version.ts`
4. `src/` 直下の `リポジトリのデッドコードを調査し、不要なコードを削除してください.md`(依頼文のコピー。参照ではなく、残すかどうかはユーザーに確認)
5. 範囲外の `tools/`・`server/` の `--noUnusedLocals` 指摘(`res`、`TemplateJsonProcessor.ts` の未使用 import 2 件)は、`src/` 外のため今回の依頼の対象外

## 8-9. patch 9(2026-10-25 / `src/sdk` 全域)

patch 8 適用後の状態が基準(patch 8 → patch 9 の順で適用)。`vue-tsc --noEmit` は修正前後ともエラー 0、`--noUnusedLocals --noUnusedParameters` の `src/sdk` の指摘は 0 件(修正前は `GetReactions.ts` の `platform` の 1 件)。`eslint src/sdk` もエラーなし。`src/sdk` は全 17 ファイルを精読した(`types/` の 2 ファイルは `src/types/subscribe/` と差分を取って確認)。

### 確認した参照関係

- `client.ts`(axios)← `PostSettings.ts` の `POST_SETTINGS`(`engine` / `generator` / `server` も使用)
- `PostOneComme.ts` → `postComment` / `postWordPartyId` / `postSpeech` / `postSystemMessage`、`PostWordParty.ts` の `executeWordParty` が `postWordPartyId` を使用
- `ServiceAPI`(`createService` / `getServices` / `startPolling` / `stopPolling` / `getInstance` は全て呼び出し元あり)、`PingOneSDK`、`GetComments` → `GetOmikenComments` → `OmikenCommentProcessor`、`GetReactions` / `unsubscribeReactions`、`GetServiceMeta`

### 修正済み

| 項目 | 変更                                                                                                                               | 根拠・現コード検証による信憑性評価                                                                                                                                                                                                                                                                                                                    |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-33 | `service/DetectService.ts`、`subscribe/CommentGuards.ts` を削除、`control/StopSpeech.ts` は保持(TODO追記)                                           | **信憑性 高（部分訂正あり）**: `DetectService.ts` と `CommentGuards.ts` は実際に削除適用済み（参照ゼロ）。一方、`StopSpeech.ts` は「TODO: 将来的に行き過ぎたコメント読み上げを検知して停止させる機能で使用する」というコメントを追加してコード上に保持されており、削除されていない点のみ現行コードと相違（保持が妥当）。 |
| D-34 | `post/PostOneComme.ts` の未使用関数 `postWordParty` を削除                                                                         | **信憑性 高（事実・コード適用済み）**: 参照なし。`postWordParty` 関数は削除済み。                                                                                                                                                                                                                                         |
| D-35 | `subscribe/GetReactions.ts` の未使用引数 `platform` を削除、`subscribe/GetComments.ts` の不要なコメント `// GetComments.ts` を削除 | **信憑性 高（事実・コード適用済み）**: 未使用引数および不要ヘッダーコメントは削除済み。                                                                                                                                                                                                                              |
| S-4  | `subscribe/OmikenComment/GetOmikenComments.ts` を Prettier の設定(`semi: false` / `singleQuote: true`)に合わせて整形               | **信憑性 高（事実・コード適用済み）**: Prettier 準拠の書式整形が適用済み。                                                                                                                                                                                                                  |

### 発見事項(修正せず・報告のみ)

- D-36 `src/sdk/types/subscribe/SendCommentSchema.ts` と `src/types/subscribe/SendCommentSchema.ts`(確信度 中): 同内容の複製。差分は `platform` の `.default('youtube')` の有無、`idSchema` の import 元、コメントのみ。`src/types/` は編集不可のため、統一するなら `PostOneComme.ts` の import を `@/types/subscribe` に寄せて `src/sdk/types/` を削除する形になる。ただし `platform` の既定値の差で挙動が変わりうるため、意図の確認が必要
- D-37 `subscribe/OmikenComment/OmikenCommentProcessor.ts`(確信度 中): `determineAccessLevel` の `roles.has('anonymity')` は、`getUserRoles` が `'anonymity'` を追加しないため到達しない(`'anonymous'` が返らない)。匿名判定が抜け落ちている不具合の可能性があり、削除せず報告のみ。`isCommentTester` / `convertToJPY` の `export` は同ファイル内でのみ使用(確信度 低)
- D-38 Prettier 違反(確信度 低、改行コードを除く): `GetReactions.ts` ほか 8 ファイルで書式差分が残る(`--end-of-line auto` で確認)。大半は軽微で、今回は挙動に関わらない 1 ファイルのみ整形した

## 9-7. 次に調査する箇所(patch 9 時点)

1. `src/common`、`src/engine`、`src/games`、`src/generator`(`TriggerChecker.ts` の `userIds` と editor の `TriggerUserId.vue` の対応、`useAppInitializer.ts` ほか)、`src/layout`、`src/manager`、`src/plugin`、`src/ui`(`useStreamCounters.ts` の未使用 `_`)、`src/console`、`src/maps`、`src/i18n`
2. `src/types`(編集不可。参照されていない型の報告のみ)、`src/registerAll.ts` / `registerRuntime.ts` / `main.ts` / `DevApp.vue` / `version.ts`
3. 範囲外の `tools/`・`server/` の `--noUnusedLocals` 指摘は、`src/` 外のため今回の依頼の対象外

## 8-10. patch 10(2026-10-26 / `src/common`)

HEAD `136782d` を基準(patch 9 適用済み)。`src/common` の全 37 ファイルについて、`src` / `tools` / `packages` / `server` / `docs` を grep し、静的 import・動的 import・`import.meta.glob` の参照を確認した(`src/common` 内に glob / require.context はなし)。

### 修正済み

| 項目 | 変更 | 根拠 |
| ---- | ---- | ---- |
| E-1 | `common/DraggableWrapper/DraggableWrapper.vue` を削除 | ファイル名・コンポーネント名ともリポジトリ全体で自身以外の参照なし |
| E-2 | `common/ErrorInfo/ErrorInfoDaisy.vue` を削除 | 同上。`ErrorInfo.vue` / `ConnectionStatusIndicator.vue` は `generator/App.vue` が使用中 |

### 発見事項(修正せず・報告のみ)

- E-3 `common/MockUser/maps/MockUser{Ch,En,Kr,Th}Maps.ts`(確信度 中): export(`MOCK_*_ZH/EN/KO/TH_*`)は全て参照なし。`MockGenerators.ts` に「en: ... 追加予定」のコメントがあり、多言語対応の準備と思われるため保留
- E-4 `vue-draggable-plus` は `editor/assets` の `EmotionGrid.vue` / `WeightBar.vue` が使用中のため、E-1 削除後も依存は残す

### 精読していない範囲

- 上記以外の `src/common` は参照数の機械確認のみ(被参照 1 件以上)。`migrations` / `buildValidation` / `EntryCore` は内容未精読

## 9-8. 次に調査する箇所(patch 10 時点)

1. `src/common` の精読(`migrations`、`buildValidation`、`EntryCore`、`LayerImage`、`sounds`)
2. `src/engine`、`src/games`、`src/generator`(`TriggerChecker.ts` の `userIds`)、`src/layout`、`src/manager`、`src/plugin`、`src/ui`、`src/console`、`src/maps`、`src/i18n`
3. `src/types`(報告のみ)、`registerAll.ts` ほか直下

## 8-11. patch 11(2026-10-26 / `src/engine`・`games`・`generator`・`layout`・`manager`・`plugin`・`console`・`maps` の機械走査)

patch 10 適用後の状態が基準(patch 10 → patch 11 の順で適用)。この範囲は**精読していない**。次の 2 つの機械走査のみを行った。
1. ファイル名による import 参照ゼロの `.ts` / `.vue`(`src` / `tools` / `packages` / `server` / `vite.config.ts` / html を grep)
2. 他ファイルから参照されない `export`(単語一致で `src` / `tools` / `packages` / `server` を grep)

### 修正済み

| 項目 | 変更 | 根拠 |
| ---- | ---- | ---- |
| F-1 | `games/scripts/DwarfBomb/game/dwarfTypes.ts` を削除 | 未参照ファイルは走査 1 でこの 1 件のみ。`DwarfSnapshot` は他で未使用(`DwarfBomb/game.ts` はプロパティ名を使うだけで型は import しない) |

### 発見事項(修正せず・報告のみ)

- F-2 `engine/DrawOmikuji/DrawOmikuji.ts`(確信度 中): `drawMultipleOmikuji` / `drawOmikujiWithCondition` / `getOmikujiStatistics`(デバッグ用)は参照ゼロ。エンジンの汎用ユーティリティとして残している可能性があり保留
- F-3 参照のない `export`(確信度 低。ファイル内では使われているものが多く、`export` を外すだけで済む): `generator/scripts/EventProcess/ServiceTriggerEvaluator.ts` の `evaluateServiceCondition` / `evaluateElapsedTime`、`DefaultPlaceholderBuilder.ts` の `buildBasePlaceholders`、`trigger/checkers/ExpressionChecker.ts` の `buildTriggerExpressionContext`、`ExpressionEvaluator.ts` の `normalizeTriggerExpression`、`manager/services/baseApiClient.ts` の `ApiError`、`console/scripts/summarizeState.ts` の `UserRow` / `resolveUserNames`
- F-4 games 内(確信度 低): `types/GameScriptTypes.ts` の `ScriptPreset`、`GouseiSuika` の `GameConfigs` / `ItemLottery`、`DwarfBomb/game/gameConfigs.ts` の `RewardItem` / `GoldRewardConfig`、`FortuneRanking/game.ts` の `playSlot`、`MultiplyBonanza/wordPartySelector.ts` の `WORD_PARTY_CONFIG`、`HugEmAll` の `gameModes` / `PLAYER_INITIAL_LIFE` / `ATTACK_PROBABILITIES` / `ATTACK_EFFECTS`。「games の修正は別の機会」の方針のため保留
- 環境: `npm ci` が完了せず(`node_modules` なし)、今回は `vue-tsc` / eslint を実行できていない。削除した型ファイルは参照ゼロのため影響なしと判断

## 9-9. 次に調査する箇所(patch 11 時点)

1. 上記範囲の精読(優先: `generator`(`TriggerChecker.ts` の `userIds`、`useAppInitializer.ts`)、`engine`、`plugin`)
2. `src/ui`(`useStreamCounters.ts` の未使用 `_` を含む)、`src/i18n`(キー未使用判定)、`src/common` の精読
3. `src/types`(報告のみ)、直下ファイル、テスト・ビルド設定

## 8-12. patch 12(2026-10-26 / `src/engine`)

patch 11 適用後の状態が基準(patch 11 → patch 12 の順で適用)。`src/engine` の全 21 ファイルのうち、`DrawOmikuji.ts` は全文を確認した。残りは「出現 1 回の識別子(関数・メソッド・型・定数)」の機械走査のみで、精読はしていない。

### 修正済み

| 項目 | 変更 | 根拠 |
| ---- | ---- | ---- |
| F-2(解決) | `engine/DrawOmikuji/DrawOmikuji.ts` の `drawMultipleOmikuji` / `drawOmikujiWithCondition` / `getOmikujiStatistics` を削除 | ユーザーから「仕様が固まったので、参照されていなければ消してよい」と許可(2026-10-26)。リポジトリ全体(`src` / `docs` / `tools` / `packages` / `server`)で定義以外の参照なし。`isValidItems` は `drawOmikuji` が使うため残した |

### 発見事項(修正せず・報告のみ)

- G-1 `engine/ContentPlaceholder/processor.ts` の `clearResolvedValues`、`engine/GameScriptPlay/GameScriptManager.ts` の `allReset` / `listAvailableScripts`(確信度 中): クラスの公開メソッドで、呼び出しはリポジトリ全体でゼロ。許可は `DrawOmikuji.ts` に限られるため保留。削除する場合、`listAvailableScripts` の分だけ `getRegisteredGameScriptKeys` の import も不要になる
- 環境: `npm ci` が完了せず `vue-tsc` / eslint は未実行

## 9-10. 次に調査する箇所(patch 12 時点)

1. `src/generator`(精読。`TriggerChecker.ts` の `userIds`、`useAppInitializer.ts`)、`src/plugin`
2. `src/ui`(`useStreamCounters.ts` の未使用 `_`)、`src/i18n`、`src/common` の精読、`src/engine` の精読
3. `src/types`(報告のみ)、直下ファイル、テスト・ビルド設定

## 8-13. patch 13(2026-10-26 / `src/generator`)

patch 12 適用後の状態が基準(patch 12 → patch 13 の順で適用)。`src/generator` の全ファイル(約 40 件)について出現 1 回の識別子を機械走査し、`scripts/trigger/` の 6 ファイルと `composables/useAppInitializer.ts`、`stores/useAppStatus.ts` を全文確認した。残りは精読していない。`src/plugin` は走査のみ(指摘なし)。

### 修正済み

| 項目 | 変更 | 根拠 |
| ---- | ---- | ---- |
| H-1 | `generator/scripts/trigger/checkers/TriggerHelpers.ts` の `checkTimeRange` を削除 | `checkers/CheckTimeRange.ts` に同一実装があり、`TriggerChecker.ts` はそちらだけを import。`TriggerHelpers` の `checkTimeRange` は参照ゼロ(古い実装の重複) |

### 発見事項(修正せず・報告のみ)

- H-2 `generator/stores/UserStats/UserStatsManager.ts` の `getLatest`(確信度 中): 呼び出しゼロ。LiveConsole 向けの用意の可能性があり保留
- H-3 `TriggerChecker.ts` の `userIds` 条件は `checkUserIdCondition` に接続済みで問題なし。editor 側の `TriggerUserId.vue` が未接続な点は 4-2 のとおり(判定側は使用中のため削除不可)
- H-4 前回の依頼(2026-10-24)分は反映済みを確認: `useAppInitializer.syncWithServer` の失敗時に `postSystemMessage` は呼ばれていない
- 環境: `npm ci` が完了せず `vue-tsc` / eslint は未実行

## 9-11. 次に調査する箇所(patch 13 時点)

1. `src/generator` の残り(`stores`、`scripts/EventProcess`)の精読、`src/plugin` の精読
2. `src/ui`(`useStreamCounters.ts` の未使用 `_`)、`src/i18n`、`src/common` と `src/engine` の精読
3. `src/types`(報告のみ)、直下ファイル、テスト・ビルド設定

## 8-14. patch 14(2026-10-26 / `src/ui`)

patch 13 適用後の状態が基準(patch 13 → patch 14 の順で適用)。`src/ui` 全 98 ファイルについて、ファイル名による未参照走査と、出現 1 回の識別子の走査を行った。精読はしていない(参照確認のため `counterTypes.ts` と周辺の import を確認)。

### 修正済み

| 項目 | 変更 | 根拠 |
| ---- | ---- | ---- |
| I-1 | `ui/ToastWidgets/editor/CharacterSelectorSingle.vue` を削除 | リポジトリ全体(`src` / `docs` / `tools` / `packages` / `server`)で自身以外の参照なし。同じフォルダの `CharacterSelectorMulti.vue` は使用中 |
| I-2 | `ui/StreamCounter/editor/CounterSelector/counterTypes.ts` の `getCounterLabel` と `EventRule`、不要になった `streamDefaultMap` の import を削除 | `getCounterLabel` は参照ゼロ、`EventRule` は `getCounterLabel` の引数でのみ使用。`CounterItem` は他で使用中のため残した |

### 発見事項(修正せず・報告のみ)

- I-3 `ui/GameRanking/scripts/services/MessageService.ts`(確信度 中): 参照ゼロだが、ファイル内の TODO(LiveConsole)で「GameRanking 内でのみ表示するメッセージとして使う予定」と明記されているため保留(方針どおり残す)
- 環境: `npm ci` が完了せず `vue-tsc` / eslint は未実行。`ui/common/useStreamCounters.ts:58` の `const _ = previewTick.value` は、`previewTick` への依存を張るための意図的な読み取り(`watchEffect` の再実行トリガー)で、削除不可

## 9-12. 次に調査する箇所(patch 14 時点)

1. `src/ui` の精読(特に `common`、`StreamCounter`、`CookieCounter`、`GameRanking`)
2. `src/generator` の残り(`stores`、`scripts/EventProcess`)、`src/plugin` の精読
3. `src/i18n`、`src/common` と `src/engine` の精読、`src/types`(報告のみ)、直下ファイル、テスト・ビルド設定

## 0. 調査対象外(ユーザー指示 / 2026-10-26)

- `src/ui`: 移行中のため、**これ以上調査しない**。patch 14 までの内容は有効(ユーザー確認済み)。以後の「次に調査する箇所」から除外する
- `src/console`: 調査不要

## 8-15. patch 15(2026-10-26 / `src/i18n/editor` のキー走査)

patch 14 適用後の状態が基準(patch 14 → patch 15 の順で適用)。`src/i18n/editor` の全翻訳ファイルを Node で読み込み、ja の全キー(葉)について (1) `src` / `tools` / `packages` / `server` のコード(i18n 自身を除く)にキー文字列があるか、(2) 親キー + `${` の動的構築があるか、(3) ja / en のキー不一致、を確認した。候補 10 件は全て手で精査した。

### 修正済み

| 項目 | 変更 | 根拠 |
| ---- | ---- | ---- |
| J-1 | `category/NavigationSidebarMessagesMap.ts` の `navigation.appInfo`(ja / en)を削除 | 参照なし。カテゴリ名は `categories.{category}.label`(`useSidebarCreate`)で解決され、`navigation.` 配下の動的構築は `navigation.groups.${id}` のみ |
| J-2 | `assets/PostFlow.ts` の `postFlow.gameScript.characterDesc`(en のみ)を削除 | ja に対応キーがなく、参照もなし |

### 問題なし

- `events/EventTriggers.ts` の `timerInterval.presets.s30` 〜 `s3600`(9 件): `TimerIntervalEditor.vue:66` が `` t(`timerInterval.presets.s${value}`) `` で動的に参照
- 上記以外の ja キーはすべて参照あり、ja / en の不一致は J-2 の 1 件のみ
- `src/i18n/{games,generator,ui}/index.ts` は中身がほぼコメントのみ(import 元あり)

### 範囲外(未実施)

- `src/i18n/editor` 以外の翻訳(`games` / `generator` / `ui`)は実体がなく走査対象なし
- 環境: `npm ci` が完了せず `vue-tsc` / eslint は未実行

## 9-13. 次に調査する箇所(patch 15 時点 / `src/ui`・`src/console` は除外)

1. `src/generator` の残り(`stores`、`scripts/EventProcess`)、`src/plugin` の精読
2. `src/common` と `src/engine` の精読
3. `src/maps`、`src/manager`、`src/layout`、`src/games`(精読。games は方針により報告中心)
4. `src/types`(報告のみ)、直下ファイル、テスト・ビルド設定
