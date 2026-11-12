# UiKind 追加チェックリスト — OmikujiBotV3

`uiSchemas`(安定版 / 実験枠)に新しい UI スキーマを追加するときの手順。
**追加の前後に、この順で確認する。**

## 0. 追加してよいかの判断(最初に)

UiKind の追加は、配線ファイルが多く、型で守れない箇所もあるため軽業ではない。
**まず、既存 UiKind の component(schema の `component` フィールド)の追加で目的を達成できないかを検討する。**

- 見た目のバリエーションが目的 → **既存 UiKind に component を足す(UI内コンポーネントレジストリ規約に従う)**
- 保存データの構造・エディター設定項目そのものが変わる → UiKind の追加(本書の対象)

UiKind を足すのは「保存データの形が増える」ときだけ、が原則。
汎用性の高いスキーマ設計(設定項目を component 側の Meta で吸収できる形)を優先する。

## 1. 追加する(型エラーが出る場所は tsc が教えてくれる)

以下は `Record<UiKind, ...>` / `satisfies` で型に守られている。**エラーが出た場所を全部直せばよい。**

| ファイル                                                                          | 追加するもの                                                                   |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `src/types/ui/XxxSchema.ts`                                                       | スキーマ本体(雛形: `GameRankingSchema.ts`。`component` は `z.string().min(1)`) |
| `src/types/ui/index.ts`                                                           | export 行                                                                      |
| `src/types/OmikujiData/ui/uiSchemas.experimental.ts` または `uiSchemas.stable.ts` | スキーマ 1 行(実験枠は安定版に昇格するまで experimental)                       |
| `src/maps/OmikujiData/ui/UiKindMap.ts`                                            | `uiKindMap` / `uiKindMetaMap` / `uiKindIcons` の 3 つすべて                    |
| `src/types/generator/scripts/BotMessageSlotMap.ts`                                | `UiMessageSpecs` に 1 行(投稿を受け取らない UI は `bubble: false, slots: {}`)  |
| `src/register/registerUi.ts`                                                      | UI 本体の loader と、components の register 呼び出し                           |
| `src/register/registerUiEditor.ts`                                                | エディターの loader                                                            |

注意: `useSettingsOperations.ts` の `updateItemSettings` は loose スキーマの index signature
(`[x: string]: unknown`)を含むため、spread の型エラー(TS2698)が出ることがある。
出た場合は `typeof current === 'object'` で絞り込む(挙動は不変)。

## 2. 型が検査しない箇所(手動で必ず足す。tsc は拾わない)

**入れ忘れても tsc は通るが、UI が単に表示されない / タブ名がキー文字列のままになる。**

| ファイル                                 | 追加するもの                                                            | 入れ忘れたときの症状                   |
| ---------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------- |
| `src/maps/OmikujiData/ui/UiLayoutMap.ts` | 表示させたいレイアウトの `kinds`(実験枠はまず `sesupinTest`)            | エディター・配信画面にその UI が出ない |
| `src/i18n/editor/maps/UiMapMessages.ts`  | `mapText.uiKind.<kind>` の `label` / `description`(**ja と en の両方**) | 編集画面のタブ名がキー文字列のまま     |

## 3. 実装本体

- ディレクトリ構成・レジストリは `docs/conventions/ui-component-registry.md` と
  `docs/work/ui-component-registry-migration.md` に従う。
- Registry の型名は ID 型と衝突させない(雛形では ID 型 = 略称 + `Component`、Registry 型 = UI名 + `Component`。
  UI 名と ID 型名が同名になる UI では、Registry 型に `Ui` を挟むなどして区別する)。
- アイコン名(lucide)は `LucideIconName` 型に存在するものを使う(存在しないと tsc が拾うが、
  `as` で握り潰さないこと)。

## 4. 適用後の目視確認(検証項目)

1. `npm run tsc` / `npm run lint` が通る
2. **エディターのレイアウト選択で、対象レイアウトを選ぶと該当 UI のタブが出る**(タブ名が日本語/英語で正しい)
3. 編集画面が開き、設定を変更できる
4. 配信画面(ジェネレーター)に表示される
5. 旧 ID・旧 Map の残存を grep する(§5 の移行指示書と同じ)

## 5. 報告に含めること

- 追加した UiKind(実験枠 / 安定枠の別)
- 触った全ファイル(上表のどこを足したか)
- tsc / lint の結果(通せなければ「検証未実施」と明記)
- 上記 4 の目視確認結果(エージェントが実行できない場合は「未確認」と明記して依頼者に依頼する)
