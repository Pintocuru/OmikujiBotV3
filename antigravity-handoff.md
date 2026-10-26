# Antigravity 引き継ぎ指示書(OmikujiBotV3 / デッドコード整理)

この文書は、ローカルのエージェントが作業を引き継ぐための手順書。**書かれていないことはしない。迷ったら止めて報告する。**

## 0. 前提

- 調査の記録は `src/dead-code-review.md`(以下「レビュー md」)。**消してはいけないものは、レビュー md の「1. 消してはいけない」が唯一の基準**。この文書では重複して書かない
- 調査対象外(中身に触れない): `src/console`、`src/plugin`。`src/ui` は移行中のため、中身は変更しない(import パスの機械的な書き換えだけ可)
- コミット・プッシュはしない。変更は作業ツリーに残すだけ
- 既存の改行コード(CRLF / LF 混在)は各ファイルのまま維持する。Prettier は `semi: false` / `singleQuote: true`

## 1. 最初にやること(前提の確認)

作業の前に、次の 3 点だけ確認する。

1. `git status` が綺麗である(未コミットの変更なし)
2. `src/generator/composables/useCharacterManager.ts` が存在する(T-4 の変更前の位置)
3. `src/types/OmikujiData/assets/ScriptGameSchema.ts` の `scriptGameKeys` に `'FortuneRanking'` がある

1 つでも満たさなければ、**そこで止めて報告**する。すべて満たしたら、次を実行して基準を取る。

```
npx vue-tsc --noEmit
```

エラー 0 が期待値。1 件でもあれば、作業せずに報告する。

## 2. 完了の報告形式

次の 3 点だけを短く報告する。

- 前提の確認結果と、作業前の `vue-tsc` の結果
- T-4 の実行後の `vue-tsc` と eslint の結果(件数)
- 想定外の変更・差分、または止まった理由と該当ファイル

## 3. 作業(T-4 のみ承認済み)

### T-4(承認済み): `CharacterManager` の名称の重複の解消

背景: engine のクラス `CharacterManager`(ストアに依存しない)と、generator の composable `useCharacterManager`(generator のストアを既定で使う)が、名前が近く、どちらがストアに依存するか分からない。patch 22 でフォルダ名の重複だけ解消した応急処置の続き。

やること(この名前で実行。変更したい場合はユーザーが承認時に指定する):

| 変更前                                             | 変更後                                              |
| -------------------------------------------------- | --------------------------------------------------- |
| クラス `CharacterManager`                          | `CharacterResolver`                                 |
| `src/engine/CharacterManager/CharacterManager.ts`  | `src/engine/CharacterResolver/CharacterResolver.ts` |
| composable `useCharacterManager`                   | `useCharacters`                                     |
| `src/generator/composables/useCharacterManager.ts` | `src/generator/composables/useCharacters.ts`        |

手順:

1. `git mv` でファイルを移動し、クラス名・関数名を変更する
2. 参照元を `src` / `tools` / `packages` / `server` / `docs` で grep し、すべて書き換える。確認済みの参照元は次のとおり
   - クラス: `engine/PostOmikuji/PostOmikujiService.ts`、`engine/OmikujiResult/BotMessageGenerator.ts`、`engine/OmikujiResult/BotMessageHelpers.ts`、`generator/composables/useCharacterManager.ts`
   - composable: `editor/helpers/CharacterChanger/composables/useCharacterLookup.ts`、`ui/CommentBubble/CommentBubble.vue`、`ui/CommentBubble/layouts/parts/CommentDisplay.vue`、`ui/ToastWidgets/ToastWidgets.vue`、`ui/ToastWidgets/editor/ToastWidgetsEditor.vue`(`src/ui` は import と呼び出しの名前の書き換えだけ)
3. クラスを指すローカル変数・プロパティ(`characterManager` など)は、クラスのインスタンスを保持しているものだけ `characterResolver` に変える。判断に迷うものは変えずに報告する
4. コメント・JSDoc の旧名称も書き換える
5. `src/dead-code-review.md` の 2-6 から、「`CharacterManager` の応急処置の残り」の節を削除し、「次にやること」の 1 を削除する
6. 動作は変えない。メソッドの追加・削除・シグネチャ変更はしない

確認:

- `grep -rIn "CharacterManager\|useCharacterManager" src tools packages server docs` が、(履歴を書いた md 以外で)0 件
- `npx vue-tsc --noEmit` がエラー 0、変更したファイルの eslint がエラー 0

### 保留(着手しない)

| ID  | 内容                                               | 状態                                        |
| --- | -------------------------------------------------- | ------------------------------------------- |
| T-5 | フォルダ名の大文字小文字の統一(`PostFlow`、`apps`) | 後回し。import の一括書き換えが広範囲のため |

実行時のルール:

- ファイル名・フォルダ名を変えるときは `git mv` を使い、参照元を全部 grep してから書き換える
- レビュー md の「1. 消してはいけない」に載っているものは、**理由があっても消さない・移さない**
- 確信度が中・低のもの(レビュー md 2-2 / 2-3)は、承認がない限り**報告のみ**。削除しない

## 4. 止まるべき場面

- 作業ツリーに未コミットの変更がある
- `vue-tsc` のエラーが 0 でなくなった
- 「消してはいけない」の対象に触れないと進められない
- 仕様や意図が、コードやコメントから判断できない
