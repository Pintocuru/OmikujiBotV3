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

#### A-1 `isCommentMode`(**撤回: 削除不可**。2026-10-25 にコードで再確認)

- 訂正: `src/ui/LiveClock/editor/LiveClockEditor.vue:25` が `<MessageTextDialog v-model="messageText" />` を prop なし(= false)で使っている。false 側は到達するため残す。資料の「全呼び出し元が true」は assets 内のみの確認だった
- 以下は当初の記述(参考)
- 場所
  - `PostFlow/Message/MessageTextDialog.vue` の prop `isCommentMode`
  - `PostFlow/Message/PlaceholderPanel.vue` の同 prop
  - `PostFlow/Message/usePlaceholderEditor.ts` の `isCommentMode` と、それに依存する `defaultBasePlaceholderLabel` の分岐
- 理由: 呼び出し元 4 か所(`MessageSettings`、`BotSettings`、`VariableSettings`、`OmikujiItemControlSettings`)が全て `:isCommentMode="true"` を渡している。false 側は到達しない。トースト/フキダシ分離の廃止の名残と思われる
- 参照: 上記 4 呼び出し元のみ(assets 内で確認)
- 影響: 挙動変化なし。`defaultBasePlaceholderLabel`(types 側)が他で未使用になる可能性がある
- 確信度: 撤回(削除しない)

#### A-2 `PostActionItem.vue` の未使用定義

- 場所
  - emits `duplicate` / `remove`(どこにも emit されない)
  - prop `index`(script / template のどちらでも未使用)
  - `v-for="(meta, type) in postFlowKindMap"` の `meta`
- 連動箇所: `PostFlowsEditor.vue` の `@duplicate` / `@remove` / `:index`
- 参照: 複製・削除は `PostActionsTabs` → `usePostActionsTab` 側で処理されている
- 影響: なし
- 確信度: 高

#### A-3 `ActionsEditor.vue` が `PostFlowsEditor` に渡す余剰 prop

- 場所: `category` / `selectedItemKey`
- 理由: `PostFlowsEditor` は `modelValue` のみ受け取るため、余りが DOM 属性として root に出力される
- 影響: なし
- 確信度: 高

#### A-4 `MikujiSettings.vue` の `category` prop(`MikujiEditor` から渡している分も含む)【修正済み(patch 2)】

- 追記: 呼び出し元は assets 外の `src/editor/events/{comment,reaction,service,timer}/*Editor.vue` にもあり(計 5 か所)。events 調査(patch 2)で prop・`EventCategoryType` の import・呼び出し側 5 か所をまとめて削除した。なお events 側の 3 か所(reaction / service / timer)は `category="comments"` を渡しており、値としても誤りだった
- 理由: 宣言のみで未使用
- 影響: なし
- 確信度: 高

#### A-5 `IconSelector.vue` の未使用要素

- 場所: `showHoverSelector`(`@mouseenter` / `@mouseleave` で代入するだけで参照なし)、emit `showSelector`(一度も emit されない)
- 影響: なし
- 確信度: 高

#### A-6 `PlaceholderTextMode.vue` の `error` フィールドと `getErrorMessage`

- 理由: `parseAndValidateLine` が `error` メッセージを組み立てるが、template は `hasError` しか使わず表示されない。メッセージは日本語固定(i18n 外)でもある
- 影響: なし(エラー詳細の表示を将来つけるなら残す)
- 確信度: 高

#### A-7 `TestPlaceholderProcessor.ts` の `highlighted`

- 場所: `processed.bubble.replace(/\{\{[\s\S]*?\}\}/g, (m) => m)`
- 理由: コールバックが引数をそのまま返すため no-op。ハイライト実装の残骸
- 影響: なし(`processed.bubble` をそのまま返せる)
- 確信度: 高

#### A-8 `PostActionPreview.vue` の到達不能分岐

- 場所: `if (!processed) return t('postFlow.actionPreview.hidden')`
- 理由: `processTestPlaceholder` は常にオブジェクトを返す(失敗時も `{ text, hasError }`)ため偽にならない
- 影響: i18n キー `postFlow.actionPreview.hidden` も未使用になる可能性がある(ロケール未確認)
- 確信度: 高

#### A-9 `MessagePreviewPanel.vue` の try/catch【確信度を下げ、修正せず】

- 追記: try 内で `data.assets.placeholders ?? {}`(引数評価)を行っており、`data.assets` が未定義なら catch に到達しうるため、到達不能とは言えない
- 理由: `processTestPlaceholder` 自体が内部で例外を握りつぶすため、外側の catch は到達しない
- 影響: なし
- 確信度: 中(上記追記のとおり)

#### A-10 `useEmotionDraft.ts` の未使用戻り値

- 場所: `draftItemFor`、`removeKey`
- 参照: 利用者は `EmotionEditModal` のみで、`draftValue` / `initDraft` / `updateSrc` / `updateLabel` / `updateAnimation` しか分割代入していない
- 影響: なし
- 確信度: 中〜高(assets 外の利用は未確認)

#### A-11 `ActionSetSettings.vue` の `currentKey` prop と関連引数

- 理由: 唯一の呼び出し元 `PostActionItem` が `currentKey` を渡さないため常に `undefined`。`ActionSetValidator` の「自己参照」分岐と、`availableActionSets` の `disabled: key === current` は常に偽。循環検出は `visited` で成立しているため機能は維持される
- 影響: 削除してよいか、本来は渡すべきか(意図の確認が必要)。渡し忘れなら不具合の可能性
- 確信度: 中

#### A-12 `WordPartyTestButton.vue` の `pattern` prop

- 理由: 呼び出し元(`PostActionPreview`)が常に `null` を渡し、`:disabled="!pattern && !id"` 以外で使われない
- 影響: なし(assets 外の呼び出しは未確認)
- 確信度: 中

#### A-13 `useOmikujiLottery.ts` と `OmikujiItemCriteria.vue` の重複

- 場所: `criteria` / `updateCriteriaKey` / `toggleCondition`(composable 側の戻り値)
- 理由: `OmikujiItemPriority` は 7 個中 4 個しか使わず、`OmikujiItemCriteria` が同等の処理を再実装している
- 影響: どちらかに統一(リファクタ)
- 確信度: 中

#### A-14 `CharacterEditor.vue` の `SectionType` に含まれる `'serviceSettings'`

- 理由: 対応するセクションが存在しない
- 確信度: 中

#### A-15 軽微(低リスクの掃除)

- 未使用の戻り値・export
  - `useBoxOmikujiList` の `box`
  - `usePlaceholderEditor` の `placeholderMap` / `PLACEHOLDER_ID_PATTERN`
  - `useOmikujiWeight` の `OMIKUJI_COLORS` の export
  - `useWeightValueManagement` の `updateValue`
- 冗長なコード
  - `PostFlowsEditor.vue` の `length > 0 && activeTab >= 0`、`props?.modelValue`
  - `OmikujiItemEditor.vue` の未使用 `option`、実質常に true の `shouldShowKindSelector`
  - `SoundSettings.vue` の未使用 `value`(`v-for="(value, key) in soundMap"`)
  - `CommentVoiceSettings.vue` の未使用 `value`
  - `EmotionAnimationEditor.vue` の未使用 `value`
  - `OmikujiItemToolbar.vue` の空の `<label><span> </span></label>`
  - `CharacterImageSettings.vue` の `handleUpdateImages`(`pushImages` への単純な委譲)
  - `PostActionPreview.vue` の `const _ = messageKey.value`(依存追跡のための代入。`void` に統一可能)
- 古いコメント
  - `EmotionEditModal.vue`: 「initialEmotionKey は廃止 ✕」「watch を完全削除」
  - `CharacterColorSettings.vue`: 「ColorModeSelector からの更新」
  - `SoundTestButton.vue`: 「pattern をサウンド名として再生」
  - `usePlaceholderEditor.ts`: 「isPlaceholder=false なら空」
  - `useWeightValueManagement.ts`: 「ActionSetとPlaceholder両方で使用可能」(現状は両方から使われているので正確。ただし配置が `PostFlow/actions/` で不自然)
- 確信度: 中〜低

#### B-1 `CommentEditor.vue` の `SectionType` の `'scriptGame'`【修正済み(patch 2)】

- 理由: `categorySectionMap.comments` に対応するセクションがない(`baseSettings` / `threshold` / `omikujiSet` のみ)。`toggleSection` の呼び出しにも現れない
- 確信度: 高

#### B-2 `i18n/editor/events` の未参照キー【修正済み(patch 2)】

- `EventTriggers.ts` の `triggerService` ブロック(ja / en 各 11 キー)。参照はリポジトリ全体で定義のみ。サービス用の文言は `serviceTrigger.*` を使用
- `CommentEditor.ts` / `ReactionEditor.ts` の `disabledNotice`(ja / en)。4 エディターとも `eventCore.disabledNotice.*` を参照している
- 根拠: 全リポジトリ grep、テンプレートリテラルでキーを組み立てる箇所(`trigger${...}` など)なし
- 確信度: 高

#### B-3 コメントの誤記・名前の不統一【修正済み(patch 2)】

- `ServiceEditor.vue`: `ServiceTrigger.vue` を `CommentTriggerEditor` という名前で import していた → `ServiceTrigger` に統一
- `ServiceTrigger.vue`: ベータ版の注意カードのコメントが「登録者数の場合の説明」の重複になっていた → 実態に合わせて修正
- `TimerIntervalEditor.vue`: モード選択のコメントが「isBaseZero トグル」の重複になっていた → 実態に合わせて修正
- 確信度: 高(挙動への影響なし)

#### B-4 `ServiceTriggerCondition.vue` の `hasPeak` と `serviceSimpleComparisonConditionMap`【未修正・報告のみ】

- 理由: 唯一の呼び出し元 `ServiceTrigger.vue` が 2 か所とも `:has-peak="true"` を渡す。`false` 側の `serviceSimpleComparisonConditionMap`(`src/maps/OmikujiData/events/ServiceTriggerMap.ts`)の参照はここだけ
- 保留の理由: 登録者数(`follower`)など、ピークなしの比較を今後つける用途の可能性がある。影響が不明なため
- 確信度: 中

#### B-5 events の軽微な不統一(報告のみ)

- `TimerEditor.vue` は `v-if="selectedItem.isEnabled"`、他 3 エディターは `!== false`(`isEnabled` が未定義になりうるかで挙動が変わるため、型を確認せず統一はしていない)
- `SectionCard` の `:variant="selectedItem.isEnabled ? 'secondary' : 'neutral'"` は reaction / timer / service のみで、comment にはない
- `TriggerComment` / `TriggerUserId` / `TriggerUsername` は textarea と配列の同期処理が同一(共通 composable 化の候補)
- `ServiceTriggerCondition.vue` の `['lowerBound','upperBound','equal','loop']` が 2 か所に重複
- 未使用の v-for 変数: `ReactionTriggerEditor` の `v`、`ServiceTrigger` の `value`、`ServiceTriggerCondition` の `info`(A-15 と同種のため修正せず)
- `ReactionTriggerEditor.vue` は `@/maps/OmikujiData` から 2 行に分けて import している
- 確信度: 中〜低

#### C-1 未参照ファイルの削除【修正済み(patch 3)】

- `parts/CopyButton.vue`: import 元なし(`src` / `packages` / `tools` / `server` / `docs` を grep、`import.meta.glob` は i18n のみ)。文言が i18n 化前の直書きで、旧実装に見える
- `helpers/presetsImport/ConfigImport.vue`: import 元なし。同じ機能は `manager/components/FileMenuDropdown.vue` が `ConfigImportModal` と `useImportManager` を直接使っている。文言は直書き
- 削除してもよい根拠: 他からの参照・文字列参照・グローバル登録がなく、削除後も `vue-tsc` エラー 0。専用の i18n キーはなし
- 確信度: 高

#### C-2 未参照の i18n キー【修正済み(patch 3)】

- `appHeader.currentVersion` / `checking` / `checkFailed` / `newVersion` / `latest`(ja / en)。バージョン表示を AppHeader の左上に移した際に不要になったもの。`appHeader.*` の他のキーは `AppHeader.vue` と `useVersionCheck.ts` が使用中
- `placeholder.inputMode` / `placeholder.toggleModeTitle`(ja / en)
- `postFlow.messageEditor` ブロック(ja / en、キーは `placeholder` のみ)。patch 1 で削除した `MessageTextEditor.vue` の残り
- 根拠: 全リポジトリを grep し、テンプレートリテラルでの組み立てなし
- 確信度: 高

#### C-3 未使用の型・引数・変数【修正済み(patch 3)】

- `types/apps/SidebarType.ts`: 参照ゼロの `SidebarVariant` と `SidebarRecordCategory`、およびそれに付随するコメントと import(`DataCategoryType`)
- `helpers/IconKeyChanger/IconKeyChanger.vue`: 分割代入のうち未使用の `changeScope`(`useDataExtractor` 側は `CharacterChanger` が使用中なので残す)
- `stores/composables/useEventProperties.ts`: 未使用の第 1 引数 `data` と、それにだけ必要だった import。呼び出し元は `useOmikujiStore.ts` の 1 か所のみ
- 確信度: 高

#### C-4 `parts/SectionCard.vue` の `toggle` emit と、呼び出し側の `isOpen` / `toggleSection`【未修正・報告のみ】

- 事実: `SectionCard` は prop `isOpen` を宣言しておらず、`toggle` を emit する処理もない(クリックハンドラなし)。常に展開表示で、呼び出し側が渡す `:isOpen` は DOM 属性として落ちるだけ
- 影響範囲: `@toggle="toggleSection(...)"` と `toggleSection`、`SectionType` が events 4 エディターと assets 側のエディターにある(`@toggle` を含む行が `src` 全体で 24 行)
- 保留の理由: 折りたたみ機能を意図的に外したのか、今後つけるのか不明。`activeSection` はサイドバーのハイライトなど別用途でも使われている可能性があるため、一括削除は影響が大きい
- 確信度: 中(未使用であることは確実、削除の可否は意図の確認が必要)

#### C-5 `apps/dataPacks/` 一式【未修正・報告のみ】

- `DataPacks.vue` は import 元なし。それに連なる `DataPackCard.vue` と `useDataPacks.ts` も実質未使用。`CategoryType` に `dataPacks` がなく、`useCategoryUtils.ts:31` に「いつか…取得できるように」という TODO コメントが残っている
- 保留の理由: 将来機能(配布パック)として残しているのか、廃止したのか不明。`useDataPacks.ts` の `buildRawUrl` も他から使われていない(同じ理由で保留)
- 確信度: 中
- 将来のアップデートで使用。消さないこと。TODOも書いておくこと。

#### C-6 軽微(報告のみ)

- `JsonMergeEditor.vue:87` の未使用 v-for 変数 `remap`、`useSidebarSectionMap.ts` の `useUiSections` の `export`(内部利用のみ)、`keyEditorValidation.ts` の `validateKeyFormat` / `validateKeyDuplication` と `importHelpers.ts` の `getItemName` / `checkRecordConflicts` の `export`(内部利用のみ)、`ChangeScope` 型の `export`(他からは未参照)、`evaluationStats.ts` の `NumberSummary` ほかの `export`
- `AppHeader.vue` の `新版 ${...}` は直書きで i18n 外
- 確信度: 低(`export` を外すだけの整理で、削除ではない)

### 4-2. 要確認

| 対象                                                                           | 内容                                                                                                                                                                          | 要確認の理由                                                                                                                                                 |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| (削除済み)`PostFlow/PostActionsPreview.vue`                                    | assets 内に import なし。`displayText` が variable / gameScript / bot に未対応で旧実装に見える。単数形 `preview/PostActionPreview.vue` と名前が紛らわしい                     | `src/editor` の他ディレクトリからの参照が未検証。専用 i18n キー `postFlow.actionsPreview.*` もあり、削除時はロケールも整理が必要                             |
| `PostFlow/Message/MessageTextEditor.vue`                                       | `Message` / `Bot` / `variable` の各 Settings は `MessageTextDialog` を使い、このファイルは import されていない                                                                | assets 外の参照が未検証                                                                                                                                      |
| `MikujiEditor` 上部の Character/IconKey ボタンと `MikujiSettings` 内の同ボタン | 全体変更とアイテム単位変更の二段構成に見える                                                                                                                                  | 意図した設計か未確認                                                                                                                                         |
| (解決済み → 4-3)`const { data } = useOmikujiStore()` の分割代入                | `useOmikujiStore` を読んで確認。該当は `MessageSettings.vue` のみ(`useBoxOmikujiList` と `MessagePreviewPanel` は該当なし)                                                    | 4-3 に移動                                                                                                                                                   |
| `EmotionGrid.vue` の `normalizeKey`                                            | 数字だけのキーに `k` を付けて別キー化し、並べ替え時にそのキー名で emit する。キー構成の比較が常に不一致になり、データ側のキーも書き換わる恐れがある                           | 数字キーが実在するか、`CharacterImageType` の制約が未確認                                                                                                    |
| `PostActionItem.vue` の `createDefaultAction`                                  | Zod スキーマの既定値と重複している                                                                                                                                            | キャッシュ復元との兼ね合いがあり、削除可否は設計判断                                                                                                         |
| `ActionsEditor` などの `:isIsEnabled="false"`                                  | 名前が不自然                                                                                                                                                                  | `BaseEditor.vue` の prop 定義が未読                                                                                                                          |
| `events/trigger/TriggerUserId.vue`                                             | import 元がなく、`commentTriggerCondition` にも `userId` がない。一方で `triggerConditions` の型と `TriggerChecker.ts` には `userId` 条件が実装済み(`trigger.userIds` を参照) | 未接続の UI なのか廃止した機能なのか意図が不明。接続するなら `userIds` というキーとの対応が必要。削除する場合は i18n の `triggerUserId`(ja / en)も整理が必要 |

### 4-3. 機能不具合の疑い(デッドコードではないが調査中に発見)

- `EmotionAnimationEditor.vue`: `duration` スライダーと `loop` トグルは `localAnimation` を更新するだけで、`emit('update:animation')` を呼ばない。種別の `@change` でしか保存されないため、速度・ループの変更が保存されない可能性がある
- `EmotionLayerEditor.vue`: 各レイヤーの「パス設定」ボタンが、どのレイヤーでも常に 0 番目を書き換える(`handleSetDefaultPath` が index を受け取らない)
- `CommentVoiceSettings.vue`: `v-model="currentDisplayOption.mode"` / `frameId` が props を直接書き換えている。`mode` は `@change` でも更新するため二重更新になる
- `DelaySecondsAdjuster.vue`: 更新後に delaySeconds でソートするため、`activeTab`(インデックス)と選択中アクションがずれる可能性がある。`basicDelaySeconds` に `?? 1` のフォールバックがなく(`PostActionItem` にはある)、未設定なら NaN になる
- `PostActionsTabs.vue`: `<button class="tab">` の内側に `MenuDropdown`(button)が入っており、HTML として不正(ネスト button)
- `MessageSettings.vue:48`: `const { data } = useOmikujiStore()` で分割代入している。`useDataIO.ts:25` と `useDataMerge.ts:31` が `data.value` を再代入するため、ファイル読み込み・マージ後は `soundEnabled`(`data.settings.generator.soundEnabled`)が古い値のまま残る可能性がある(`storeToRefs` なら追従する)

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

| 項目 | 変更                                                                                                                               | 根拠                                                                                                                                                                                                                                                                                                                    |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-33 | `control/StopSpeech.ts`、`service/DetectService.ts`、`subscribe/CommentGuards.ts` を削除                                           | 各 export(`stopSpeech` / `detectServiceFromUrl` / `useCommentGuards`)は、リポジトリ全体(`src` / `server` / `tools` / `packages` / `docs` / `*.md` / `*.json`、`node_modules` 除く)で定義以外に参照なし。import・文字列参照・動的 import もなし。削除後も `vue-tsc` エラー 0。SDK の予備として残していたなら復元してよい |
| D-34 | `post/PostOneComme.ts` の未使用関数 `postWordParty` を削除                                                                         | 参照なし(同ファイルの `postWordPartyId` は使用中)。`delayPost` は他の関数が使用                                                                                                                                                                                                                                         |
| D-35 | `subscribe/GetReactions.ts` の未使用引数 `platform` を削除、`subscribe/GetComments.ts` の不要なコメント `// GetComments.ts` を削除 | 呼び出し元(`ReactionProcessor.ts`)は引数 1 つだけ渡している。`--noUnusedParameters` の指摘                                                                                                                                                                                                                              |
| S-4  | `subscribe/OmikenComment/GetOmikenComments.ts` を Prettier の設定(`semi: false` / `singleQuote: true`)に合わせて整形               | `.prettierrc` と不統一(セミコロン・ダブルクォート)。挙動変更なし(差分は書式のみで、行末は CRLF を維持)                                                                                                                                                                                                                  |

### 発見事項(修正せず・報告のみ)

- D-36 `src/sdk/types/subscribe/SendCommentSchema.ts` と `src/types/subscribe/SendCommentSchema.ts`(確信度 中): 同内容の複製。差分は `platform` の `.default('youtube')` の有無、`idSchema` の import 元、コメントのみ。`src/types/` は編集不可のため、統一するなら `PostOneComme.ts` の import を `@/types/subscribe` に寄せて `src/sdk/types/` を削除する形になる。ただし `platform` の既定値の差で挙動が変わりうるため、意図の確認が必要
- D-37 `subscribe/OmikenComment/OmikenCommentProcessor.ts`(確信度 中): `determineAccessLevel` の `roles.has('anonymity')` は、`getUserRoles` が `'anonymity'` を追加しないため到達しない(`'anonymous'` が返らない)。匿名判定が抜け落ちている不具合の可能性があり、削除せず報告のみ。`isCommentTester` / `convertToJPY` の `export` は同ファイル内でのみ使用(確信度 低)
- D-38 Prettier 違反(確信度 低、改行コードを除く): `GetReactions.ts` ほか 8 ファイルで書式差分が残る(`--end-of-line auto` で確認)。大半は軽微で、今回は挙動に関わらない 1 ファイルのみ整形した

## 9-7. 次に調査する箇所(patch 9 時点)

1. `src/common`、`src/engine`、`src/games`、`src/generator`(`TriggerChecker.ts` の `userIds` と editor の `TriggerUserId.vue` の対応、`useAppInitializer.ts` ほか)、`src/layout`、`src/manager`、`src/plugin`、`src/ui`(`useStreamCounters.ts` の未使用 `_`)、`src/console`、`src/maps`、`src/i18n`
2. `src/types`(編集不可。参照されていない型の報告のみ)、`src/registerAll.ts` / `registerRuntime.ts` / `main.ts` / `DevApp.vue` / `version.ts`
3. 範囲外の `tools/`・`server/` の `--noUnusedLocals` 指摘は、`src/` 外のため今回の依頼の対象外
