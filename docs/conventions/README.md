# docs/conventions と docs/work の使い分け

## 配置の基準

| 場所                | 置くもの                                                                                                         | 例                                        |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `docs/conventions/` | **恒久ルール**。時間が経っても有効で、新規コード・新規文書が従うもの。チェックリストなど、繰り返し使う手順も含む | 命名規則、UI スタイル規約、レジストリ規約 |
| `docs/work/`        | **恒久ルールではないもの**。作業指示書、移行計画、引き継ぎ記録、AI への依頼文                                    | 命名の移行計画、UI スタイル統一作業       |

## docs/work のルール

- 各ファイルの先頭に **状態**(`作業前` / `作業中` / `完了`)を書く。
- 作業の根拠となる恒久ルールは `docs/conventions/` に置き、work 文書とルールが食い違う場合は **conventions を優先**する。
- 作業の中で恒久ルールが決まったら、`docs/conventions/` に移す(work に残さない)。
- `完了` になった文書は、残す理由がなければ削除してよい(履歴は git に残る)。
- コミット・push は依頼者の許可がある場合だけ行う(各作業指示書の指定に従う)。

## src/ には置かない

- ルール・作業指示書は `src/` に置かない(`naming.md` §4-6)。
- 例外: `src/ui/` と `src/games/` はプラグインのため、各プラグイン自身の説明ドキュメントをそのディレクトリ内に置いてよい。

## 目次

### docs/conventions/

| 文書                                                             | 内容                                     |
| ---------------------------------------------------------------- | ---------------------------------------- |
| [naming.md](./naming.md)                                         | 命名規則・用語表                         |
| [japanese-ui-writing.md](./japanese-ui-writing.md)               | 日本語 UI 文言の表現・短縮規約           |
| [editor-ui-style.md](./editor-ui-style.md)                       | ボタン・アイコン・tooltip のスタイル規約 |
| [ui-component-registry.md](./ui-component-registry.md)           | UI 内コンポーネントの登録規約            |
| [ui-kind-addition-checklist.md](./ui-kind-addition-checklist.md) | UiKind 追加の手順                        |
| [root-readme.md](./root-readme.md)                               | README・構成ドキュメントのルール         |

### docs/work/

| 文書                                                                             | 状態                   |
| -------------------------------------------------------------------------------- | ---------------------- |
| [editor-ui-style-work.md](../work/editor-ui-style-work.md)                       | 作業前                 |
| [naming-migration-plan.md](../work/naming-migration-plan.md)                     | 完了(C4b は実施しない) |
| [ui-component-registry-migration.md](../work/ui-component-registry-migration.md) | 完了                   |
| [root-readme-prompt.md](../work/root-readme-prompt.md)                           | 依頼文(随時使用)       |
