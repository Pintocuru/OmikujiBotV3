# 命名規則指示書 — OmikujiBotV3(Vue 3 + TypeScript)

この文書は、新規ファイル作成・リネーム・生成AIへの依頼時の**唯一の命名基準**とする。

## 0. 前提

- Vue 3 + TypeScript(`type: module`)、Vue SFC を使用。
- 原則: **「同じディレクトリ内で同じ役割のファイルは、同じ命名パターンにする」**。この原則に反する場合、個別の好みより優先する。
- 既存ファイルとの整合が取れる場合を除き、本規則に合わせてリネームを行う。変更が多くなることは許容する。
- **ファイル先頭のパスコメント(`// src/xxx/yyy.ts`)は一切無視してよい**。内容の誤記・古さの指摘や、移動・リネームに伴う更新は不要(作者の独自ツールで一括修正するため)。

## 1. ケーススタイル定義

| 名称            | 形式                     | 例                                             |
| --------------- | ------------------------ | ---------------------------------------------- |
| PascalCase      | 各単語先頭大文字         | `UserStatsManager.ts`                          |
| camelCase       | 先頭小文字・以降大文字   | `getAvatarUrl.ts`                              |
| kebab-case      | 全小文字・ハイフン区切り | `user-profile.vue`(本プロジェクトでは使わない) |
| SCREAMING_SNAKE | 全大文字・アンダースコア | `APP_CONFIG`(ファイル名では使わない)           |

## 2. ファイル種別ごとの規則

### 2.1 Vue コンポーネント(`.vue`)— **PascalCase 固定**

- コンポーネント名は **PascalCase 1〜2語を基本**とする。3語以上になる場合はディレクトリで文脈を補う。
  - 良: `EmotionGrid.vue` / `NavigationSidebar.vue`
  - 不可: `faceCutout.vue` / `flower.vue`(小文字開始は禁止)
- レイアウトバリエーション も PascalCase のまま(`Sakura.vue`, `Tarot.vue`)。
- **`use` プレフィックスの `.vue` は作らない**。逆に、`composables/` ディレクトリに `.vue` を置かない。
- エントリポイントのみ慣例名を許可: `App.vue` / `main.ts`。
- 画面・ページとしての `.vue` には `View` / `App` / `Editor` など役割が分かる語を付ける(`DataManager.vue` → `ManagerView.vue` 等)。**`.vue` に `Manager` を付けない**(Manager はクラスの名称として定義済み)。

### 2.2 TypeScript ファイル — エクスポート内容で判断

| エクスポートするもの                         | ケース                                      | 例                                      |
| -------------------------------------------- | ------------------------------------------- | --------------------------------------- |
| クラス(`class X`)                            | PascalCase                                  | `CharacterResolver.ts`                  |
| 定数オブジェクト・設定まとめ                 | PascalCase                                  | `MockConstants.ts`                      |
| 関数・関数群(default export 関数含む)        | camelCase                                   | `getAvatarUrl.ts` / `summarizeState.ts` |
| Zod スキーマ・型定義のみ                     | `*Schema.ts` に統一                         | `CharacterSchema.ts`                    |
| 純粋な型(`type` / `interface`)のみのファイル | 型名の PascalCase、または `types.ts` に集約 | `TriggerCondition.ts`                   |
| コンポーザブル                               | `use` + PascalCase                          | `useEmotionDraft.ts`                    |
| barrel(再エクスポート専用)                   | **`index.ts` 固定**                         | `index.ts`                              |

- **接尾辞の乱立を禁止**: `*Type.ts` / `*Types.ts` / `types.ts` / 接尾辞なしを混在させない。
  - Zod スキーマを含む or スキーマに対応する型 → `*Schema.ts`
  - 複数型の集約 → そのディレクトリの `types.ts` または上位の `index.ts`
  - 既存の `presetsImportType.ts` / `keyEditorTypes.ts` / `shellTypes.ts` / `counterTypes.ts` は上記へ統合する。

### 2.3 CSS ファイル — kebab-case

- `animations.css` の形式を踏襲。新規 CSS は kebab-case。

### 2.4 テストファイル — 対象名 + `.test.ts`

- `resolveStageSlots.test.ts` の形式を踏襲(`*.spec.ts` は使わない)。

## 3. ディレクトリ規則

| ディレクトリ   | 役割                          | 中のファイル                           |
| -------------- | ----------------------------- | -------------------------------------- |
| `components/`  | 再利用可能なコンポーネント    | PascalCase `.vue`                      |
| `composables/` | `use*` 関数のみ               | `useXxx.ts` のみ(`.vue` 禁止)          |
| `layouts/`     | 見た目のバリエーション        | PascalCase `.vue`                      |
| `stores/`      | Pinia Store(`useXxxStore.ts`) | `useXxxStore.ts`                       |
| `types/`       | 型定義                        | `*Schema.ts` / `types.ts` / `index.ts` |
| `scripts/`     | スクリプト・関数群            | camelCase                              |
| `services/`    | API クライアント等            | camelCase(`configApi.ts` 形式)         |
| `maps/`        | 対応表データ                  | PascalCase(`XxxMap.ts`)                |
| `helpers/`     | 汎用関数                      | camelCase(`useXxx.ts` 含む)            |

- Store は **`use` + 名詞 + `Store`**: `useOmikujiStore.ts`。
- `editor/preview/`(`旧 editor/dev/`)はプレビュー用コード置き場。

## 4. プロジェクト固有ルール

1. **Manager の定義**: Manager = データを管理するもの(保存・読み込み・供給)。境界外の責務を持たせない。`Manager` を名に含むファイルは `class` をエクスポートする `.ts` に限る。
2. **クラス名は 2語まで** を目安とする。ファイル名もこれに準ずる。
3. **`Dev` プレフィックス禁止**(管理者専用時代の名残。順次除去済み。新規に付けることは禁止)。ただし **`AppDevWorld.vue` は例外としてそのまま維持**する(固有名詞扱い)。
4. **`Mikuji` / `Omikuji` は別物として区別する**:
   - `Mikuji` = **みくじ箱**(中におみくじが入る容器)
   - `Omikuji` / `OmikujiItem` = **おみくじ**(箱の中身)
   - `MikujiEditor.vue` / `MikujiSettings.vue` / `MikujiBoxSchema.ts` 等の `Mikuji` 名は**リネーム禁止**。新規ファイルもこの区別に従うこと。
5. **`Syoken`** は歴史的経緯(OmikujiBotは初見を大事にしている)により維持。
6. **ドキュメントを `src/` に置かない**。ルールに関する事は `docs/conventions/` へ移動。
7. **games/scripts の内部構造を統一**:
   - 各ゲームディレクトリ直下は `execute.ts` / `params.ts` / `game.ts` のみ。
   - 補助ファイルは `sub/` ディレクトリへ(camelCase)。`game/` という名前のサブディレクトリは使わない(直下の `game.ts` と紛らわしいため)。
   - `gameConfig.ts`(単数形)に統一。`DwarfBomb/game/` 配下は `DwarfBomb/sub/` へ統合。
