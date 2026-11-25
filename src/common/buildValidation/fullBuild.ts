// src/common/buildValidation/fullBuild.ts

/**
 * 「これまでリリースしたもの全部入り」のビルドかどうか。
 * 一部の UI だけ登録するパッケージ(StrawberryChocolate など)では false のまま。
 * 次の機能の出し分けに使う:
 * - DataPacks(パッケージのダウンロード)
 * - レイアウトの選択
 *
 * マウント前に1回だけ markFullBuild() を呼ぶ前提で、リアクティブにはしていない
 */
let fullBuild = false

export const markFullBuild = (): void => {
  fullBuild = true
}

export const isFullBuild = (): boolean => fullBuild
