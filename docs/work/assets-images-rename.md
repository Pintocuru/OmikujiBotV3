# assets/characters → assets/images への名前変更

`assets/characters/` には、キャラクター以外の画像（エフェクト・背景・カットインなど）も置くようになる。
実体に合わせて `assets/images/` に変える。配布後の `images/` と、開発時の `/images/` の URL は変えない。

## 変更すること

- フォルダ名: `assets/characters/` → `assets/images/`（`git mv`。中の `common/` `wip/` `YYYY-QN/` はそのまま）。
- `tools/viteConfig/characterAssetsPlugin.ts`
  - `charsDir`（`assets/characters`）と `SRC_PREFIX`（`/assets/characters/`）を `images` に変える。
  - ファイル名と関数名は `imageAssetsPlugin` に変える（`soundAssetsPlugin` に合わせる）。コメントの `assets/characters/` も直す。
  - 呼び出し側は `vite.config.ts`（import と `plugins`）の 1 か所。
- 各パッケージの `build.ts` の `extraFiles`（`from` だけ変える。`to: 'images/...'` は変えない）
  - `packages/common/StrawberryChocolate/build.ts`
  - `packages/2026-Q4/MaidenOmikuji/build.ts`
  - `packages/2026-Q4/HondaJanken/build.ts`
  - 今後のパッケージも `assets/images/<四半期 または common>/<名前>/` に置く。
- この文書と同じ内容が書かれた箇所があれば、あわせて直す（`docs/` を `assets/characters` で検索して確認する）。

## 変えないこと

- `src/editor/assets/characters/` は、エディターの画面（キャラクター設定）のフォルダ。素材のフォルダとは別物なので対象外。
- `images/<名前>/` の配布先、`getImagePath`、`IMAGE_DIR`、キャラクターのデータ（`profileImage` など）。
- `sounds` 側（`assets/sounds/`）。

## 確認すること

1. `npm run dev` で、エディターのキャラクター画像が今までどおり出る（`/images/chocolate/default.webp` など）。
2. `npm run dev:console`（5174）で、`/images/` と `/sounds/` が 404 にならない（下の注意を参照）。
3. 該当パッケージをビルドして、配布フォルダの `images/<名前>/` に画像が入っている。

## 注意（コンソールの開発時）

`.env.development` の `VITE_IMAGE_BASE_URL` は `http://localhost:5173/images/`。`dev:console` は 5174 で動き、`npm run dev`（5173）と同時に使えないので、`getImagePath` で作る画像の URL は、コンソールの開発時には 404 になる。
NuisanceSurvival の素材は `getImagePath` を使わず、効果音と同じく `assetBase`（なければ `./`）から作るので、5174 の `/images/` と `/sounds/`（Vite のプラグインが `assets/` から探す）でそのまま読める。ほかのコンソール機能で画像を使うときは、同じ作り方にそろえる。
