# AGENTS.md

## 命名

- 命名は docs/conventions/naming.md に従うこと(必読)
- ドキュメントの置き場所は docs/conventions/README.md に従うこと(恒久ルールは docs/conventions/、作業指示書は docs/work/)
- 作業はエージェント単体で実施する。エージェントを切り替える場合は、`AGENTS.md` の進捗記録を引き継ぎ、未完了の作業から再開する。

## 作業ログ

### エディター UI スタイル統一作業

**目的:** `src/editor/` と `src/console/` のボタン、アイコン、`title`、DaisyUI tooltip の使い方を規約（`docs/conventions/editor-ui-style.md`）に統一する。

**参照規約:** `docs/conventions/editor-ui-style.md`

> 注意: `docs/work/editor-ui-style-work.md` は存在しなかった。規約ファイルのみを正として作業。

---

#### 作業単位と進捗

| 単位 | 範囲                                                                                                            | 状態      |
| ---- | --------------------------------------------------------------------------------------------------------------- | --------- |
| 1    | `src/editor/parts/`                                                                                             | ✅ 完了   |
| 2    | `src/editor/shell/` + `src/editor/sidebar/records/`                                                             | ✅ 完了   |
| 3    | `src/console/`                                                                                                  | ✅ 完了   |
| 4    | `src/editor/apps/`                                                                                              | ⬜ 未着手 |
| 5    | `src/editor/assets/`                                                                                            | ⬜ 未着手 |
| 6    | `src/editor/content/` + `src/editor/events/` + `src/editor/helpers/` + `src/editor/preview/` + `src/editor/ui/` | ⬜ 未着手 |

---

#### 完了した変更

**src/editor/parts/**

| ファイル                      | 変更内容                                                                                                 |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| `ExternalLinkButton.vue`      | `btn-primary btn-outline` → `btn-sm btn-ghost btn-square`。`title` → DaisyUI tooltip + `aria-label` 追加 |
| `HelpButton.vue`              | `title` + `aria-label` → tooltip wrapper + `aria-label`（`title` と `aria-label` の重複解消）            |
| `ModalFooterActions.vue`      | `btn` → `btn btn-sm`。`flex items-center gap-1` → `gap-2`（規約の gap-2 に統一）                         |
| `SettingItem.vue`             | リセットボタン: `title` → DaisyUI tooltip wrapper + `aria-label` + `btn-square`                          |
| `ColorPicker/ColorPicker.vue` | お気に入りボタン: `btn-xs` → `btn-xs btn-neutral`                                                        |

**src/editor/shell/**

| ファイル            | 変更内容                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `TopBar.vue`        | サイドバー開閉ボタン: `title` → tooltip-bottom + `aria-label`。テーマ切替ボタン: `title` → tooltip-bottom + `aria-label` |
| `IssuesBadge.vue`   | 閉じるボタン: `btn` → `btn btn-sm btn-ghost`                                                                             |
| `SaveMenu.vue`      | ドロップダウンボタン: `title` → `aria-label`（アイコンのみボタン）                                                       |
| `GeneratorView.vue` | ツール表示切替ボタン: `title` を削除（テキスト付きボタンには原則付けない）                                               |

**src/editor/sidebar/records/**

| ファイル         | 変更内容                                                     |
| ---------------- | ------------------------------------------------------------ |
| `RecordList.vue` | プリセットボタン: tooltip wrapper に変更 + `aria-label` 追加 |

**src/console/**

| ファイル                              | 変更内容                                                                                                                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `games/components/StreamList.vue`     | 削除ボタン: `✕` 文字 → `X` Lucide アイコン。`title` → tooltip + `aria-label`。`lucide-vue-next` import 追加                                                                                            |
| `games/components/GameLogsView.vue`   | 更新ボタン: `btn-sm` → `btn-sm btn-neutral`                                                                                                                                                            |
| `users/components/UsersToolbar.vue`   | 更新ボタン: `btn-sm` → `btn-sm btn-neutral`                                                                                                                                                            |
| `users/components/UsersToolbox.vue`   | チーム名編集ボタン: テキスト+✎文字 → アイコンのみ(`Pencil`)。`title` → tooltip + `aria-label`。`lucide-vue-next` import 追加                                                                           |
| `users/components/TeamNameDialog.vue` | キャンセルボタン: `btn-sm` → `btn-sm btn-ghost`                                                                                                                                                        |
| `users/components/UserTable.vue`      | ピン留めボタン: `title` → tooltip + `aria-label`。削除ボタン: `✕` 文字 → `X` Lucide アイコン、`title` → tooltip + `aria-label`。`btn-xs`（-10, -1）: `btn-neutral` 追加。`lucide-vue-next` import 追加 |

---

#### 検証結果

- **TypeScript / lint:** `npx vue-tsc --noEmit` を2回実施。両回ともエラー0（exit code 0, no output）
- **ボタンのサイズと色:** 修正ファイルを確認。規約外の役割クラスなし・サイズなしを修正済み
- **アイコンのサイズと間隔:** 修正範囲内では `w-4 h-4` / `w-3 h-3`（btn-xs内）を確認
- **アイコンのみのボタンの aria-label:** 修正ファイル全て追加済み
- **tooltip の表示位置と clipping:** TopBar は header 内 → `tooltip-bottom` を選択。その他は `tooltip-top` を基本とした
- **既存操作への影響:** ロジック・イベント・保存処理は変更なし

#### 未確認・未実施の検証

- 実際のブラウザでの tooltip 表示確認（環境起動が必要）
- `src/editor/apps/`・`src/editor/assets/`・`src/editor/content/`・`src/editor/events/`・`src/editor/helpers/`・`src/editor/preview/`・`src/editor/ui/` は未着手

---

#### 未解決事項・確認事項

1. `docs/conventions/editor-ui-style-work.md` が存在しなかった。規約ファイルのみで作業を進めた。
2. `UsersToolbox.vue` のチーム名編集ボタンは、元々「✎ チーム名編集」というテキスト付きだったが、アイコンのみに変更した。操作仕様への影響はないが、表示が変わるため確認を推奨する。
3. `UsersMessageMap.ts` の `teamNameEdit` フィールドは未使用になったが、削除はスコープ外のため手を付けていない。
4. `SettingItem.vue` のリセットボタンは画面内で `btn-xs` を使っており、`btn-sm` との混在が起きる可能性がある。配置位置上の制約（ラベル行内の小さなコントロール）により `btn-xs` を維持した。

---

#### 次に着手する作業

**作業単位4: `src/editor/apps/`**（`btn` 使用ファイルは以下）

- `apps/appInfo/meta/PackageBasicInfo.vue`
- `apps/appInfo/settings/EditorSettingsEditor.vue`
- `apps/BaseSettings/BaseTagEditor.vue`
- `apps/dataPacks/DataPackCard.vue`
- `apps/dataPacks/DataPacks.vue`
- `apps/JsonMerge/JsonMergeEditor.vue`
- `apps/JsonMerge/JsonMergeRemapEditor.vue`
- `apps/orphans/OrphanItemsEditor.vue`
