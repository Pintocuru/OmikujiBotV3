# UI内コンポーネントレジストリ移行指示 — OmikujiBotV3

> 状態: **完了**(`LifeHourglass` は新方式の構成で作成済み)

`src/ui/KujibikiPanel` を雛形として、他の UI を同じ構造に揃える作業の指示書。
**雛形と指示書が食い違う場合は、雛形(実コード)を優先する。**

## 0. 前提

- 規約: `docs/conventions/ui-component-registry.md`(先に読む)
- 雛形(コピー元):
  - `src/ui/common/uiComponentRegistry.ts`(共通レジストリ。変更しない)
  - `src/types/ui/KujibikiPanelSchema.ts`(ID の定数と型)
  - `src/ui/KujibikiPanel/KujibikiPanelRegistry.ts`(薄いラッパー)
  - `src/ui/KujibikiPanel/components/standard/register.ts`(セットの登録)
  - `src/ui/KujibikiPanel/KujibikiPanelSelector.vue`(登録からの読み込み・未登録時の扱い)
  - `src/ui/KujibikiPanel/notifyKujibikiComponentIssue.ts`(わんコメへの通知)
  - `src/ui/KujibikiPanel/editor/KujibikiPanelEditor.vue`(選択肢を登録から作る)
- 目的: UI 内コンポーネントをセット単位で追加・配布できるようにする。

## 1. 対象(上から順に、1 UI = 1 patch)

1. CommentBubble(完了)
2. GameRanking(完了)
3. LiveClock(完了)
4. StreamCounter(完了。スキーマも新方式に変更)
5. ToastWidgets(完了)
6. UserBoard(完了)
7. CookieCounter(完了。スキーマは `component` のみ変更。他の見直しは未着手)

- 対象外: KujibikiPanel(完成済み)、CharacterStage(複数の種類を持たない)。
- 次に当てはまる UI は、変更せずに報告する(§7)。
  - 「表示コンポーネントを選ぶ設定」を持たない。
  - 切り替える意味のあるコンポーネントがない。
- 迷ったら作業せずに質問する。

## 2. 触らないもの

- `src/ui/common/uiComponentRegistry.ts`
- `src/ui/uiRegistry.ts`、`src/editor/ui/uiEditorRegistry.ts`
- `src/types` のうち `src/types/ui` と `src/types/api` 以外
- 既存の JSON データ(zod に任せる)
- AGENTS.md(作業ログを含め追記しない)
- ビルド時の登録検査(別 patch)

## 3. UI ごとの作業

UI 名を `Xxx`、略称を `xxx` と表記する。

| UI | 略称 |
| --- | --- |
| CommentBubble | bubble |
| CookieCounter | cookie |
| GameRanking | ranking |
| LiveClock | clock |
| StreamCounter | counter |
| ToastWidgets | toast |
| UserBoard | board |

- 型・定数・register 関数は略称(`bubbleComponentSets`、`registerStandardBubbleComponents`)、ラッパー関数とファイル名は UI 名(`registerCommentBubbleComponents`、`CommentBubbleRegistry.ts`)。KujibikiPanel と同じ。

### 3.1 型定義(`src/types/ui/XxxSchema.ts`)

```typescript
export const xxxComponentSets = {
  standard: ['aaa', 'bbb'],
} as const

export type XxxComponentSets = typeof xxxComponentSets
export type XxxComponentSet = keyof XxxComponentSets
export type XxxComponentOf<S extends XxxComponentSet> = XxxComponentSets[S][number]
export type XxxComponent = XxxComponentOf<XxxComponentSet>
```

- `ComponentIdOf` は作らない。
- 既存の `xxxComponents` 配列と、その型は削除する。
- スキーマの `component` は `z.enum(...)` を `z.string().min(1)` に置き換える。既存の `.default(...)` / `.catch(...)` は残す。`.min(1)` は、空文字を既定 ID に戻すため(`z.enum` のときの挙動を保つ)。
  - 理由: 未同梱の ID が既定値に書き換わると、未登録を検出できないため(規約 §3.3)。
- 既定 ID はスキーマ内の `.default()` に書く(定数は作らない)。

### 3.2 ラッパー(`src/ui/<UI名>/<UI名>Registry.ts`)

`KujibikiPanelRegistry.ts` をコピーし、次の 3 点だけを変える。

1. `UI_NAME`(camelCase)
2. `Meta`(非 export。その UI 固有のメタ。今ある設定・表示条件の分岐から決める。ID の分岐がなければ `object` でよい。並べ方・ラベルの見せ方など、見た目に関わるものは Meta にせず、コンポーネント側で決める)
3. 名前の `KujibikiPanel` を UI 名に置き換える

### 3.3 セットの登録(`src/ui/<UI名>/components/<セット名>/register.ts`)

- `satisfies Record<XxxComponentOf<'セット名'>, <UI名>Component>` にする(`: Record<...>` にしない)。
- `label` は日本語固定。ID は先頭小文字の camelCase。
- `src/maps/ui/XxxMap.ts` に表示名・メタがある場合は、`register.ts` に移し、Map ファイルと `src/maps/ui/index.ts` の export を削除する。
- Map ファイルに component 以外の定義(ソート順など)が残る場合は、ファイルを残し、component の分だけ削除する。
- 元の Map の中身が表示名だけでない場合、移し先が判断できなければ質問する。
- コード内に `component === 'ID'` のような ID 直書きの分岐があれば、`Meta` の項目に置き換える。

### 3.4 Selector・通知・Editor

- Selector: 静的 import の `componentMap` をやめ、`KujibikiPanelSelector.vue` と同じ読み込みにする。
  - 未登録・読み込み失敗は無表示にし、`notifyXxxComponentIssue` でわんコメへ 1 回だけ通知する。
  - 既定のコンポーネントへのフォールバックはしない。
- 通知: `notifyKujibikiComponentIssue.ts` をコピーして UI 名に置き換える。
- Selector がエディターのプレビューにも使われている場合は、`editorPreview` を受け取り、そのときだけ画面にエラーを出す(通知はしない)。Selector をエディターで使わない場合は、Editor 側にエラー表示を置く。
- Editor: 選択肢を登録から作る(`KujibikiPanelEditor.vue` の `componentOptions`)。未登録の ID が選ばれていれば、エラー表示を出す。

### 3.5 登録の呼び出し

- `src/register/registerUi.ts`: UI ごとの関数にまとめて `registerAllUi` から呼ぶ。
- `packages/` のエントリ: その UI を登録している箇所(例: `packages/_shared/commentBubble.ts`)で、セットも一緒に登録する。登録しないと、そのパッケージで何も表示されない。

### 3.6 ディレクトリ構成

```text
src/ui/<UI名>/
├─ <UI名>.vue
├─ <UI名>Selector.vue
├─ <UI名>Registry.ts
├─ notify<UI名>ComponentIssue.ts
├─ editor/
├─ components/<セット名>/
│  ├─ register.ts
│  └─ <コンポーネント>.vue
└─ parts/                  … 同じ UI 内で共有する部品(あれば)
```

- 既存の `layouts/` が「コンポーネントの選択肢」そのものなら、`components/<セット名>/` に移す。`layouts/` は残さない。
- 他の UI からも参照されている部品は `src/ui/common` に置く。

## 4. コンポーネントが 1〜2 個しかない UI

- セットは `standard` の 1 つでよい。
- 1 個だけでも同じ構造で作る。
- 新しいコンポーネントの追加は別作業。依頼がない限り、見た目・挙動・設定項目は変えない。

## 5. 検証

- 各 UI の作業後に `npm run tsc` と `npx eslint <変更したディレクトリ>` を通す。通せなければ「検証未実施」と明記する。
- 既存の失敗がある場合は、自分の変更によるものと区別して報告する。
- 旧 ID・旧 Map の残存を grep し、結果を報告に書く。

## 6. 進め方

- 変更は patch ファイルで渡す(`git apply --check` で確認)。コミット・push はしない。
- 不明点や、雛形・規約と食い違う箇所は、実装前に質問する。

## 7. 報告

UI ごとに次を報告する。

- 移した / 移さなかった(理由つき)
- 作成・移動・削除したファイル
- コンポーネント数、セット名、既定 ID、Meta の項目
- 検証結果(tsc / lint / 残存検索)
- 未解決の点(TODO)
