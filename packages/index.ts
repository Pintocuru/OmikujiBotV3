// packages/index.ts
// ビルドするパッケージの一覧。不要なものはコメントアウトして絞る
/* eslint-disable @typescript-eslint/no-unused-vars */
import OmikujiBot from './common/OmikujiBot/build'
import StrawberryChocolate from './common/StrawberryChocolate/build'
import LifeHourglass from './2026-Q4/LifeHourglass/build'

export default [
  // OmikujiBot, // コアプロジェクト
  // StrawberryChocolate, // ショコラ
  LifeHourglass, // 命の砂時計
]
