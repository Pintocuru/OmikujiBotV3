# dead-code-review.md — OmikujiBotV3 `src/editor/assets`

- 調査日: 2026-10-25
- 方法: GitHub から各ファイルを取得し、import を手で辿って参照関係を確認(コード検索 API は 0 件しか返さず使えなかった)
- 変更・削除・コミット・プッシュ: 一切なし

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

### assets 外(参照確認のために読んだもの)
- `src/editor/apps/appItems/ContentArea.vue`(エディターのマッピング)

---

## 2. 調査済み範囲 / 未調査範囲

### 調査済み
- `src/editor/assets` 配下はほぼ全ファイルを読了
- カテゴリ別エディター 4 種(mikuji / actions / placeholders / characters)から、各子コンポーネントへの import 連鎖

### 未調査・不十分
- `characters/CharacterImage/ImageSettingsInfo.vue`(EmotionEditModal から import されていることのみ確認、中身は未読)
- `PostFlow/composables/usePostActionsTab.ts` の中身(戻り値の未使用有無)
- `assets` の外側すべて
  - `src/editor/parts/`、`src/editor/helpers/`、`src/editor/stores/`、`src/editor/maps/`
  - `src/maps/OmikujiData`、`src/types/OmikujiData`
  - ロケールファイル(i18n キーの未使用判定)
- テスト、ビルド設定(vite / tsconfig / eslint)、package.json
- `src/editor` 内の events 系など、`assets` を参照しうる他エディター

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

---

## 4. 発見事項

形式: 場所 / 理由 / 参照調査 / 削除時の影響 / 確信度

### 4-1. 削除候補

#### A-1 `isCommentMode`(常に true の分岐)
- 場所
  - `PostFlow/Message/MessageTextDialog.vue` の prop `isCommentMode`
  - `PostFlow/Message/PlaceholderPanel.vue` の同 prop
  - `PostFlow/Message/usePlaceholderEditor.ts` の `isCommentMode` と、それに依存する `defaultBasePlaceholderLabel` の分岐
- 理由: 呼び出し元 4 か所(`MessageSettings`、`BotSettings`、`VariableSettings`、`OmikujiItemControlSettings`)が全て `:isCommentMode="true"` を渡している。false 側は到達しない。トースト/フキダシ分離の廃止の名残と思われる
- 参照: 上記 4 呼び出し元のみ(assets 内で確認)
- 影響: 挙動変化なし。`defaultBasePlaceholderLabel`(types 側)が他で未使用になる可能性がある
- 確信度: 高

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

#### A-4 `MikujiSettings.vue` の `category` prop(`MikujiEditor` から渡している分も含む)
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

#### A-9 `MessagePreviewPanel.vue` の try/catch
- 理由: `processTestPlaceholder` 自体が内部で例外を握りつぶすため、外側の catch は到達しない
- 影響: なし
- 確信度: 高

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

### 4-2. 要確認

| 対象 | 内容 | 要確認の理由 |
|---|---|---|
| `PostFlow/PostActionsPreview.vue` | assets 内に import なし。`displayText` が variable / gameScript / bot に未対応で旧実装に見える。単数形 `preview/PostActionPreview.vue` と名前が紛らわしい | `src/editor` の他ディレクトリからの参照が未検証。専用 i18n キー `postFlow.actionsPreview.*` もあり、削除時はロケールも整理が必要 |
| `PostFlow/Message/MessageTextEditor.vue` | `Message` / `Bot` / `variable` の各 Settings は `MessageTextDialog` を使い、このファイルは import されていない | assets 外の参照が未検証 |
| `MikujiEditor` 上部の Character/IconKey ボタンと `MikujiSettings` 内の同ボタン | 全体変更とアイテム単位変更の二段構成に見える | 意図した設計か未確認 |
| `useBoxOmikujiList` / `MessageSettings` / `MessagePreviewPanel` の `const { data } = useOmikujiStore()` | 分割代入しており、`data` がストア内で再代入される実装だとリアクティブ性が切れる | `useOmikujiStore` の実装未読 |
| `EmotionGrid.vue` の `normalizeKey` | 数字だけのキーに `k` を付けて別キー化し、並べ替え時にそのキー名で emit する。キー構成の比較が常に不一致になり、データ側のキーも書き換わる恐れがある | 数字キーが実在するか、`CharacterImageType` の制約が未確認 |
| `PostActionItem.vue` の `createDefaultAction` | Zod スキーマの既定値と重複している | キャッシュ復元との兼ね合いがあり、削除可否は設計判断 |
| `ActionsEditor` などの `:isIsEnabled="false"` | 名前が不自然 | `BaseEditor.vue` の prop 定義が未読 |

### 4-3. 機能不具合の疑い(デッドコードではないが調査中に発見)

- `EmotionAnimationEditor.vue`: `duration` スライダーと `loop` トグルは `localAnimation` を更新するだけで、`emit('update:animation')` を呼ばない。種別の `@change` でしか保存されないため、速度・ループの変更が保存されない可能性がある
- `EmotionLayerEditor.vue`: 各レイヤーの「パス設定」ボタンが、どのレイヤーでも常に 0 番目を書き換える(`handleSetDefaultPath` が index を受け取らない)
- `CommentVoiceSettings.vue`: `v-model="currentDisplayOption.mode"` / `frameId` が props を直接書き換えている。`mode` は `@change` でも更新するため二重更新になる
- `DelaySecondsAdjuster.vue`: 更新後に delaySeconds でソートするため、`activeTab`(インデックス)と選択中アクションがずれる可能性がある。`basicDelaySeconds` に `?? 1` のフォールバックがなく(`PostActionItem` にはある)、未設定なら NaN になる
- `PostActionsTabs.vue`: `<button class="tab">` の内側に `MenuDropdown`(button)が入っており、HTML として不正(ネスト button)

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
