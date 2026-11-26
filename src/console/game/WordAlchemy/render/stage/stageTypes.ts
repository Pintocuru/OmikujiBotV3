// src/console/game/WordAlchemy/render/stage/stageTypes.ts
// 盤面の契約 (外から使う型) と、中の「ことば」の型。WordAlchemyStage.ts から分離した (import 元は WordAlchemyStage.ts でもこのファイルでもよい)
import type { Actor } from 'excalibur'
import type { PotLook } from '../../maps/WordAlchemyPotMap'

export type WordSpawnRequest = { userId: string; userName: string; comment: string }
/** 鍋に入れた材料 (ことばと、それを出した視聴者名) */
export type BrewMaterial = { text: string; userId: string; userName: string }
/** 煮込みの結果。鍋の上に出すカード (new: 新種 / known: 既発見 / lost: 抽選エラー) */
export type BrewOutcome = { title: string; subtitle?: string; kind: 'new' | 'known' | 'lost' }
/** 材料から完成品を決める (非同期。reject しない前提。万一 reject したら、抽選エラーと同じ扱い) */
export type BrewHandler = (materials: BrewMaterial[]) => Promise<BrewOutcome>
export type StageOptions = {
  brew: BrewHandler
  /** 鍋の見た目 (毎フレーム読む。鍋の種類は、ゲームごとに変わる)。なければ、既定の色 */
  potLook?: () => PotLook
  /** 煮込みの確認の出し入れ (材料が揃ったら材料を、答えが出たら・ゲームをやめたら null を渡す)。答えは confirm(yes) で返す */
  onConfirmChange?: (materials: BrewMaterial[] | null) => void
}

/** 盤面の「ことば」1 つ。位置はマス単位 (動き出す時刻までは、直前のマスにいるように見せる) */
export type Word = {
  userId: string
  userName: string
  text: string
  col: number
  row: number
  prevCol: number
  prevRow: number
  /** 動き出す時刻 (clock の秒。連鎖のウェーブでは未来) */
  movedAt: number
  /** 落下の開始時刻。null なら落下は終わっている */
  fallStartedAt: number | null
  /** 縁 (外周) / 鍋へ向かっている途中。動き終わったら消える (マスは占めない) */
  exit: 'out' | 'pot' | null
  actor: Actor
}
