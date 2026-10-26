# Antigravity 引き継ぎ指示書(OmikujiBotV3 / デッドコード整理)

この文書は、エージェントが作業を引き継ぐための手順書。**書かれていないことはしない。迷ったら止めて報告する。**

## 0. 前提

- 調査の記録は `src/dead-code-review.md`(以下「レビュー md」)。**消してはいけないものは、レビュー md の「1. 消してはいけない」が唯一の基準**。この文書では重複して書かない
- 調査対象外(中身に触れない): `src/console`、`src/plugin`。`src/ui` は移行中のため、中身は変更しない(import パスや名前の機械的な書き換えだけ可)
- コミット・プッシュはしない。変更は作業ツリーに残すだけ
- 既存の改行コード(CRLF / LF 混在)は各ファイルのまま維持する。Prettier は `semi: false` / `singleQuote: true`

## 1. 最初にやること(前提の確認)

作業の前に、次の 3 点だけ確認する。

1. `git status` が綺麗である(未コミットの変更なし)

1 つでも満たさなければ、**そこで止めて報告**する。すべて満たしたら、次を実行して基準を取る。

```
npx vue-tsc --noEmit
```

エラー 0 が期待値。1 件でもあれば、作業せずに報告する。

## 2. 完了の報告形式

次の 3 点だけを短く報告する。

- 前提の確認結果と、作業前の `vue-tsc` の結果
- 作業後の `vue-tsc` と eslint の結果(件数)
- 想定外の変更・差分、または止まった理由と該当ファイル

## 3. 作業(作業 1 のみ承認済み)

### 作業 1(承認済み): `CharacterManager` の名称の重複の解消

背景: engine のクラス `CharacterManager`(ストアに依存しない)と、generator の composable `useCharacterManager`(generator のストアを既定で使う)が、名前が近く、どちらがストアに依存するか分からない。役割が名前から分かるように改名する。

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
5. `src/dead-code-review.md` から、2-6 の「`CharacterManager` の名称の重複(未解決)」の節と、「3. 次にやること」の 1 を削除する
6. 動作は変えない。メソッドの追加・削除・シグネチャ変更はしない

確認:

- `grep -rIn "CharacterManager\|useCharacterManager" src tools packages server docs` が 0 件
- `npx vue-tsc --noEmit` がエラー 0、変更したファイルの eslint がエラー 0

### 作業 2: レビュー md の未実行項目の処理

対象は、レビュー md の 2-1 / 2-2 / 2-3 / 2-4 / 2-5(2-6 は対象外)。
1 項目ずつ、下の基準で「実行」「保持」「質問」のどれかに振り分ける。

#### 共通の確認(削除・変更の前に必ず行う)

- `src` / `tools` / `packages` / `server` / `docs` を grep し、参照ゼロを確認する。次も参照として数える
  - テンプレート内の使用、動的 import、文字列キー、i18n キー、`defineProps` / emit を通した受け渡し
- 対象の周辺に `TODO` / 「将来」/ 「使用しない」などのコメントがないか読む
- `git log -S'名前'` で追加時期とコミットメッセージを見る(意図の手がかりにする)
- レビュー md の「1. 消してはいけない」に該当しない

#### 振り分け基準

| 結果             | 条件                                                                                                                                                                                                                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 実行(削除・修正) | 共通の確認をすべて通り、かつ次のいずれかに当たる。<br>・参照ゼロで、将来用の手がかり(TODO・コメント・CRUD の対称性・他の UI/LiveConsole 用)がない<br>・動作を変えない整形(未使用変数の `_` 化、参照のない `export` を外す、`any` の型付け)<br>・不具合の疑いのうち、修正が 1 ファイル内で完結し、仕様の選択が要らないもの |
| 保持             | 将来用の手がかりがある、または CRUD の対称性・多言語準備など「備え」と読める。レビュー md の「1」に理由つきで追記し、2 から消す                                                                                                                                                                                           |
| 質問             | 仕様の選択が要る(例: 実装するか削除するか)、複数の案がある、意図がコードやコメントから読めない、i18n の文言追加を伴う、`src/types` の編集が要る。**自分で決めずに残す**                                                                                                                                                   |

迷ったら「質問」にする。「実行」は、確信度が高いものだけ。

#### 進め方

- 1 グループ(例: 2-3 の「未使用変数の `_` 化」)ごとに実行し、そのつど `npx vue-tsc --noEmit` と変更ファイルの eslint を確認する。エラーが出たら、そのグループの変更を戻して「質問」に回す
- 1 回の作業で扱うのは 2 グループまで
- 不具合の疑い(2-1)は、修正前に「何が起きるか」を 1 行で書く。再現を説明できないものは「質問」にする

#### レビュー md の更新

- 実行したものは、レビュー md から削除する(実行済みは記載しない方針)
- 保持にしたものは「1」に追記して、2 から消す
- 質問にしたものは、2 に残したうえで、報告に次の形で書く
  - 項目 / 選択肢 A・B / 推奨とその理由(1 行)

### 保留(着手しない)

| ID     | 内容                                               | 状態                                        |
| ------ | -------------------------------------------------- | ------------------------------------------- |
| 保留 1 | フォルダ名の大文字小文字の統一(`PostFlow`、`apps`) | 後回し。import の一括書き換えが広範囲のため |

実行時のルール:

- ファイル名・フォルダ名を変えるときは `git mv` を使い、参照元を全部 grep してから書き換える
- レビュー md の「1. 消してはいけない」に載っているものは、**理由があっても消さない・移さない**
- 確信度が中・低のもの(レビュー md 2-2 / 2-3)は、承認がない限り**報告のみ**。削除しない

## 4. 止まるべき場面

- 作業ツリーに未コミットの変更がある
- `vue-tsc` のエラーが 0 でなくなった
- 「消してはいけない」の対象に触れないと進められない
- 仕様や意図が、コードやコメントから判断できない
