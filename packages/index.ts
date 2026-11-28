// packages/index.ts
// ビルドするパッケージの一覧。不要なものはコメントアウトして絞る
/* eslint-disable @typescript-eslint/no-unused-vars */
import OmikujiBot from './common/OmikujiBot/build'
import StrawberryChocolate from './common/StrawberryChocolate/build'
import GouseiSuika from './2026-Q4/GouseiSuika/build'

export default [
  /**
   * common
   */
  OmikujiBot, // コアプロジェクト
   StrawberryChocolate, // ショコラ

  /**
   * 2026-Q4
   */
   GouseiSuika, // スイカジェネレーター
]
