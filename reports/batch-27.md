# i18n 監査レポート batch-27

- バッチ: 27
- ブランチ: `docs/i18n-audit-preparation`
- 調査時点の commit SHA: `19fd7642d7480831523c826877465178e18a2f24`
- 調査日: 2026-11-01

## 対象ファイル（全4ファイル調査完了）

1. `src/editor/shell/TopBar.vue`
2. `src/editor/shell/shellTypes.ts`
3. `src/editor/shell/useSaveActions.ts`
4. `src/editor/shell/useVersionCheck.ts`

## 静的解析

- 実施状況: **未実行（実行環境なし）** — GitHub 読み取り API によるソース確認のみ。依存追加・設定変更は行っていない。

## 検出一覧

| ファイルパス:行 | 該当コード（短く） | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| `src/editor/shell/TopBar.vue:28` | `新しいバージョンがあります` / `バージョン情報` | hardcoded string | バージョンボタンの title を翻訳キー化 | 高 |
| 同:110 | `ライトモードに切り替え` / `ダークモードに切り替え` | hardcoded string | テーマ切替ボタンの title を翻訳キー化 | 高 |
| 同:128–131 | `エディター` / `わんコメ確認中...` / `ジェネレーター使用不可` / `ジェネレーター` | hardcoded string | generatorState と表示モードに応じたラベルを翻訳キー化 | 高 |
| 同:135–138 | `エディターに戻る` / わんコメ未接続時の説明 / ジェネレーター表示の説明 | hardcoded string | generatorState と表示モードに応じた title を翻訳キー化 | 高 |

## 検出なし（確認済み）

- `src/editor/shell/shellTypes.ts`: `GeneratorState` の型定義のみで、ユーザー向け表示文字列はない。
- `src/editor/shell/useSaveActions.ts`: 使用している `navigation.*` および `shell.save.*` キーは、日本語・英語の定義に存在する。キーの参照は `SaveMenu.vue` からの表示にも使われる。
- `src/editor/shell/useVersionCheck.ts`: `appHeader.versionNotFound`、`appHeader.versionFetchFailed`、`appHeader.updateAvailable`、`appHeader.openGithub` は日本語・英語の定義に存在する。`TopBar.vue` の `appHeader.title` も定義済み。
- `TopBar.vue` の `shell.topBar.sidebar`、`shell.topBar.openTip`、`shell.topBar.open` も `ShellMessages.ts` に定義済み。
- `versionInfo.error` は動的なエラー文字列のため、固定文言としては検出していない。
- missing key / dynamic key / locale formatting: 明確な検出なし。

## 集計

- 対象ファイル数: 4（全完了）
- 確定検出件数: 4項目（hardcoded string。各項目に複数の表示文字列を含む）
- 要確認件数: 0

## 調査上の制約

- 対象外ファイルは、対象内で参照される翻訳キーの定義確認に必要な範囲だけ読み取り、監査対象には追加していない。
- コード・翻訳定義・設定ファイル・`progress.md` は変更していない。
