# AGENTS.md

## 命名

- 命名は docs/conventions/naming.md に従うこと(必読)
- ドキュメントの置き場所は docs/conventions/README.md に従うこと(恒久ルールは docs/conventions/、作業指示書は docs/work/)
- 作業はエージェント単体で実施する。エージェントを切り替える場合は、`AGENTS.md` の進捗記録を引き継ぎ、未完了の作業から再開する。

## 作業ログ

### エディター UI スタイル統一作業

**目的:** `src/editor/` と `src/console/` のボタン、アイコン、`title`、DaisyUI tooltip の使い方を規約（`docs/conventions/editor-ui-style.md`）に統一する。

---

#### 作業単位と進捗

| 単位 | 範囲 | 状態 |
| ---- | ---- | ---- |
| 1 | `src/editor/parts/` | 完了 |
| 2 | `src/editor/shell/` + `src/editor/sidebar/records/` | 完了 |
| 3 | `src/console/` | 完了 |
| 4 | `src/editor/apps/` | 完了 |
| 5 | `src/editor/assets/` | 進行中 |
| 6 | `src/editor/content/` + `src/editor/events/` + `src/editor/helpers/` + `src/editor/preview/` + `src/editor/ui/` | 未着手 |

---

#### 完了した変更

**src/editor/parts/**

| ファイル | 変更内容 |
| --- | --- |
| `ExternalLinkButton.vue` | `btn-primary btn-outline` → `btn-sm btn-ghost btn-square`。`title` → DaisyUI tooltip + `aria-label` |
| `HelpButton.vue` | `title` + `aria-label` → tooltip wrapper + `aria-label` |
| `ModalFooterActions.vue` | `btn` → `btn btn-sm`。ボタン間隔を `gap-2` に統一 |
| `SettingItem.vue` | リセットボタンを tooltip wrapper + `aria-label` + `btn-square` に変更 |
| `ColorPicker/ColorPicker.vue` | お気に入りボタンに `btn-neutral` を追加 |

**src/editor/shell/**

| ファイル | 変更内容 |
| --- | --- |
| `TopBar.vue` | サイドバー開閉・テーマ切替を tooltip + `aria-label` に変更 |
| `IssuesBadge.vue` | 閉じるボタンを `btn-sm btn-ghost` に変更 |
| `SaveMenu.vue` | アイコンのみボタンの `title` を `aria-label` に変更 |
| `GeneratorView.vue` | テキスト付きボタンの不要な `title` を削除 |

**src/editor/sidebar/records/**

| ファイル | 変更内容 |
| --- | --- |
| `RecordList.vue` | プリセットボタンを tooltip wrapper + `aria-label` に変更 |

**src/console/**

| ファイル | 変更内容 |
| --- | --- |
| `games/components/StreamList.vue` | 削除記号を Lucide X に変更し、tooltip + `aria-label` を追加 |
| `games/components/GameLogsView.vue` | 更新ボタンに `btn-neutral` を追加 |
| `users/components/UsersToolbar.vue` | 更新ボタンに `btn-neutral` を追加 |
| `users/components/UsersToolbox.vue` | チーム名編集をアイコンボタン化し、tooltip + `aria-label` を追加 |
| `users/components/TeamNameDialog.vue` | キャンセルボタンに `btn-ghost` を追加 |
| `users/components/UserTable.vue` | ピン留め・削除に tooltip + `aria-label`、削除に Lucide X、数値操作に `btn-neutral` を追加 |

**src/editor/apps/**

| ファイル | 変更内容 |
| --- | --- |
| `appInfo/meta/PackageBasicInfo.vue` | ID 再生成ボタンのサイズ・アイコン間隔・サイズを統一 |
| `appInfo/settings/EditorSettingsEditor.vue` | 通常操作のテーマ変更に `btn-neutral` を追加 |
| `BaseSettings/BaseTagEditor.vue` | タグ追加を通常操作の `btn-neutral` に変更 |
| `dataPacks/DataPackCard.vue` | 部分読み込みを `btn-neutral`、置き換えを `btn-error` に変更し、アイコンを統一 |
| `dataPacks/DataPacks.vue` | 更新ボタンに `btn-neutral` を追加 |
| `JsonMerge/JsonMergeEditor.vue` | 追加ボタンのサイズ・役割色・アイコン間隔を統一 |
| `JsonMerge/JsonMergeRemapEditor.vue` | 削除を `btn-error btn-square` にし、tooltip + `aria-label` を追加 |

**src/editor/assets/characters/CharacterImage / color / service — 部分完了**

| ファイル | 変更内容 |
| --- | --- |
| `CharacterImageSettings.vue` | エモーション追加を通常操作の `btn-sm btn-neutral` に変更。アイコンと文字の間隔を `gap-2` に統一 |
| `EmotionImageItem.vue` | 削除ボタンを `btn-error btn-square` に変更。title を tooltip に置き換え、`aria-label` を追加 |
| `EmotionPresetButtons.vue` | プリセットボタンを `btn-sm btn-neutral` に統一し、既存の outline 表現を維持 |
| `EmotionLayerEditor.vue` | レイヤー追加・パス設定ボタンのサイズ・役割色・アイコン間隔を統一。上下移動・削除を `btn-square` + tooltip + `aria-label` に変更 |
| `color/CharacterColorCard.vue` / `service/CommentVoiceCard.vue` | 編集ボタンを `btn-sm btn-neutral btn-square` + tooltip + `aria-label` に変更 |
| `service/CharacterBase64Settings.vue` | Base64リセットを `btn-sm btn-circle btn-error` + tooltip + `aria-label` に変更 |
| `src/i18n/editor/apps/AppItemsCharacters.ts` | レイヤー上下移動・削除の日本語/英語ラベルを追加 |

#### MikujiSettings / mikuji — 部分完了

| `mikuji/MikujiSettings.vue` | テスト・追加ボタンの役割色とアイコン間隔を統一 |
| `mikuji/row/OmikujiRowCooldown.vue` | 入力説明の `title` を tooltip に変更 |
| `mikuji/row/OmikujiRowRun.vue` | 実行内容・シナリオ移動ボタンの役割色・サイズ・間隔を統一 |
| `mikuji/row/OmikujiRowSummary.vue` | 名前編集を tooltip + `aria-label` + `btn-square` に変更。条件編集ボタンを標準サイズに統一 |
| `mikuji/item/OmikujiItemScenario.vue` | シナリオ選択・編集ボタンの役割色とサイズを統一 |
| `mikuji/item/ScenarioPickerDialog.vue` | 閉じるボタンに tooltip + `aria-label` を追加。選択ボタンのサイズ・役割色を統一 |

#### placeholders — 部分完了

| ファイル | 変更内容 |
| --- | --- |
| `PlaceholderInputMode.vue` | 値追加を `btn-sm btn-neutral` に変更 |
| `PlaceholderPreview.vue` | 抽選テストを `btn-neutral` に変更 |
| `PlaceholderValuesEditor.vue` | テキストモード切替を補助操作の `btn-ghost` に変更 |

#### scenarios — 部分完了

| ファイル | 変更内容 |
| --- | --- |
| `Call/ScenarioCallSettings.vue` | シナリオ移動・追加ボタンのサイズ、色、アイコン間隔を統一 |
| `preview/SoundTestButton.vue` / `WordPartyTestButton.vue` | テスト操作を `btn-sm btn-neutral` に統一 |
| `tooltab/ScenarioStepToolbar.vue` | テストを `btn-neutral`、コピー/ペーストを `btn-ghost` に変更。アイコンを統一 |
| `tooltab/DelaySecondsAdjuster.vue` | 増減ボタンに `btn-square` と `aria-label` を追加。アイコンサイズを統一 |

#### 検証結果

- 単位1〜3: `npx vue-tsc --noEmit` 済み（エラーなしと既存記録に記載）。
- 単位4: `npx vue-tsc --noEmit` と対象 ESLint 済み（成功と既存記録に記載）。
- 今回の assets/characters 部分変更: GitHub 上の差分確認のみ。TypeScript / ESLint / ブラウザ表示検証は未実施（この作業環境から実行できていない）。
- tooltip の実表示・clipping は未確認。既存画面での実測が必要。

#### 未解決事項・対象外確認

1. レイヤー上下移動・削除ボタンの翻訳キーを追加済み。
2. `ImageSettingsInfo.vue` の「パスをセット」ボタンは説明文中の操作例として表示されており、実際の操作ボタンではない。誤解を避けるため現状維持。
3. `EmotionGrid.vue` のカード選択はクリック可能なカード要素であり、ボタン統一の対象として扱うべきか未確認。操作仕様・アクセシビリティを別途確認する。

#### 未着手

- `src/editor/assets/characters/` の CharacterImage 以外
- `src/editor/assets/mikuji/`
- `src/editor/assets/placeholders/`
- `src/editor/assets/scenarios/`
- 作業単位6の各ディレクトリ

#### 次に着手する作業

**作業単位5:** `src/editor/assets/characters/CharacterImage/` の残りを確認し、完了後に characters の残りの機能へ進む。
