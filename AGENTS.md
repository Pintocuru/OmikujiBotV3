# AGENTS.md

## ダイアログ統一(作業中)

複数の agent が順番に進める作業。1 patch = 1 単位。コミット・push はしない(patch で提出し、本人が適用して確認する)。

### 方針(決定済み)

- 確定操作が「保存」(ドラフトを元データへ書き戻す) → `BaseEditDialog`
- 確定操作がそれ以外(実行・挿入・選択・確認・表示) → `BaseDialog` + `actions` スロット(`ModalFooterActions`)
- 固有レイアウトは独自実装を許容。ただし開閉の挙動(`<dialog>` + showModal、Esc、バックドロップ、アニメーション)は揃える
- 対象外: `src/console`(TeamNameDialog)
- `src/manager` は `src/editor/parts` を import してよい(置き場の再検討は別件)
- 新規移行は `<BaseDialog v-model:open>` を使う。BaseEditDialog の `showModal()` 方式の整理は今回しない
- 開いた直後のフォーカスは、対象要素に `autofocus` 属性を付ける(BaseDialog は拡張しない)
- swal(SweetAlert2)は `swalModal.*` を使えば、開いている最前面の `<dialog>` の中に自動で出る。`target` を手で渡さない

### patch の順序

1. SweetAlert2 の target 中央化 + BaseDialog 調整(A / B)
2. ScenarioPickerDialog / InlinePlaceholderDialog / IssuesBadge
3. CharacterChanger / IconKeyChanger
4. ConfigImportModal
5. EmotionEditModal(削除・追加の整理)+ EmotionGrid(削除・複製)
6. ManagerDialog(内部のみ `<dialog>` 化・任意)

### 作業ログ

#### patch 1: SweetAlert2 target 中央化 + BaseDialog 調整

- `src/common/SweetAlert2/SweetAlert2Toast.ts`: `resolveSwalTarget()` を追加(開いている `dialog[open]` の最後 → なければ `'body'`)。`swalModal.*` すべてで既定の `target` にし、`options` の後展開で呼び出し側の明示指定を優先。`baseModalOptions` と `prompt` の `target: 'body'` 直書きを削除
- `swalToast` は変更なし(下記「未確認」参照)
- `src/editor/assets/characters/CharacterImage/EmotionEditModal.vue`: 手動の `target: baseDialog.value?.$el` を削除
- `src/editor/parts/BaseDialog.vue`: `modal-box` に `text-base-content` を追加。autofocus の使い方をコメントに追記
- `MessageTextDialog.vue` / `PlaceholderTextMode.vue`: `showModal()` 直後の `nextTick(() => textarea.focus())` を削除し、textarea に `autofocus` を付与(BaseDialog は `rendered` → `nextTick` → `showModal` の順のため、前者は showModal 前に実行され効いていなかった可能性が高い)
- `Swal.fire` 直呼びの `src/editor/shell/useVersionCheck.ts` は対象外(ダイアログ外で使われる前提)

未確認・次以降に持ち越し:

- 実ブラウザでの動作確認(swal がダイアログ内で最前面に出る / autofocus が効く)
- `swalToast` をダイアログ内で出すと、ダイアログを閉じた瞬間にトーストも消える可能性があるため body のまま。ダイアログ背後に隠れる問題は未確認
- `IssuesBadge` / `ManagerDialog` の自前 `text-base-content` は、それぞれの移行 patch で削除する

#### patch 2: ScenarioPickerDialog / InlinePlaceholderDialog / IssuesBadge を BaseDialog へ

- `ScenarioPickerDialog.vue`: `<dialog>` 自前実装をやめ `BaseDialog`(`open` prop をそのまま中継)に。「解除 / 新規作成」は `actions` スロット。close の tooltip は廃止。開くたびに検索語をリセットする watch は残した
- `InlinePlaceholderDialog.vue`: `BaseDialog` + 内部 `isOpen`。`open()` の公開は維持(MessageTextDialog から呼ぶ)。`actions` に「キャンセル / 挿入」。先頭の候補 input に `autofocus`。ヘッダーのアイコンの `text-accent` は失われた(`icon` prop は色指定不可)
- `IssuesBadge.vue`: ボタンと同居のまま `BaseDialog` に。`title` は summary、`icon="TriangleAlert"`。自前の `text-base-content` は削除(patch 1 で BaseDialog 側に追加済み)
- `src/common/LucideIcon/useLucideIcon.ts`: `Braces` / `TriangleAlert` を登録(`icon` prop は登録済みのものしか使えないため)
- `BaseDialog.vue`: 長いタイトルで × ボタンが潰れないよう `shrink-0` を追加
- 未使用になった i18n キー: `omikujiItem.scenario.dialog.close`(削除は未実施)
- 検証: `vue-tsc --noEmit` エラー0、変更ファイルの eslint 問題なし。実ブラウザは未確認

未確認(本人確認待ち):

- IssuesBadge の長い title の折り返しの見た目
- InlinePlaceholderDialog を MessageTextDialog の上に開いたときの積み重なり・Esc は最前面だけが閉じること

#### patch 3: CharacterChanger / IconKeyChanger を BaseDialog へ

- `CharacterChanger.vue` / `IconKeyChanger.vue`: `div.modal.modal-open` + `v-if` をやめ、トリガーボタンと同居のまま `BaseDialog`(`:open="isModalOpen"`、`icon` は Users / Image、`size="3xl"`)に。`ModalFooterActions` は `actions` スロット(`class="w-full"`)。これにより Esc・バックドロップ閉じが新たに効く
- ×・Esc・バックドロップで閉じたときも `closeModal()`(= 編集中マッピングの破棄)を呼ぶよう `@update:open` を接続(`useMappingModalState` は変更なし)
- 未使用になった i18n キー `omikujiItem.scenario.dialog.close`(ja / en)を削除(`src/i18n/editor/assets/OmikujiItemMessages.ts`)
- 検証: `vue-tsc --noEmit` エラー0、`eslint src/editor/helpers src/i18n` 問題なし。実ブラウザは未確認

未確認(本人確認待ち):

- 内部コンポーネント(CharacterMappingEditor 等)の中身が `max-h-[90vh]` のダイアログ内でスクロールしても崩れないか(従来の見た目と同じ構造のため大きな差は想定していない)
- `CharacterSummary.vue` 上で2つのボタンから開く動作

#### patch 4: ConfigImportModal を BaseDialog へ

- `ConfigImportModal.vue`: `div.modal.modal-open` + `SectionCard` ヘッダーをやめ `BaseDialog`(`:open="importManager.showPreviewModal.value"`、`icon="Merge"`、`size="3xl"`)に。SectionCard の `label` → `title`、`description`(合計件数)は本文先頭の小さな段落へ。`variant="success"` の色は失われた
- `ModalFooterActions` は `actions` スロット。×・Esc・バックドロップは `onUpdateOpen` で `closePreviewModal()` に接続
- 親(`DataPacks.vue` / `FileMenuDropdown.vue`)は `v-if` のまま変更なし。閉じるアニメーションは出ない(本人が許容: 判断済み)
- 検証: `vue-tsc --noEmit` エラー0、`eslint src/editor/helpers/presetsImport` 問題なし。実ブラウザは未確認

未確認(本人確認待ち):

- DataPacks と FileMenuDropdown の両方から開いてプレビュー・取り込み・キャンセルが動くこと
- 大量のカテゴリがあるとき、`max-h-[90vh]` のダイアログ内スクロールで見づらくないか
