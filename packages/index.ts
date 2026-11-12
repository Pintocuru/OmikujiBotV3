// packages/index.ts
// ビルドするパッケージの一覧。不要なものはコメントアウトして絞る
/* eslint-disable @typescript-eslint/no-unused-vars */
import OmikujiBot from './common/OmikujiBot/build'
import StrawberryChocolate from './common/StrawberryChocolate/build'
import HondaJanken from './2026-Q4/HondaJanken/build'
import LifeHourglass from './2026-Q4/LifeHourglass/build'
import MaidenOmikuji from './2026-Q4/MaidenOmikuji/build'

export default [
  /**
   * common
   */
  // OmikujiBot, // コアプロジェクト
  StrawberryChocolate, // ショコラ

  /**
   * 2026-Q4
   */
  HondaJanken, // じゃんけん
  LifeHourglass, // 命の砂時計
  MaidenOmikuji, // 巫女さんのおみくじ
]
