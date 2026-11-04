// src/ui/LifeHourglass/composables/bowls.ts

/**
 * 器のランクと砂粒の計算(純粋な関数と定数のみ。状態は持たない)。
 * ランクの追加・容量の調整は、この 1 ファイルだけを変更すればよい。
 */

/** ギフトの換算係数(100円 = 600粒。10円 = 1分ぶん = 60粒)。設定項目にしない固定値 */
export const LIFE_HOURGLASS_GRAINS_PER_YEN = 6

/** 器のランク。大きい器から順に並べる。東京ドームだけ上限なし(増え続ける) */
export const LIFE_HOURGLASS_BOWLS = [
  { id: 'tokyoDome', label: '東京ドーム', icon: '☄️', grains: 180_000, max: Infinity },
  { id: 'gym', label: '体育館', icon: '👑', grains: 60_000, max: 2 },
  { id: 'classroom', label: '教室', icon: '💎', grains: 20_000, max: 2 },
  { id: 'bucket', label: 'バケツ', icon: '💰', grains: 2_000, max: 9 },
  { id: 'riceBowl', label: '茶碗', icon: '🪙', grains: 200, max: 9 },
] as const

export type LifeHourglassBowl = (typeof LIFE_HOURGLASS_BOWLS)[number]
export type LifeHourglassBowlId = LifeHourglassBowl['id']

/** 器ごとの個数(大きい器の順) */
export type BowlCounts = Record<LifeHourglassBowlId, number>

/** 東京ドームが「🏟 × N」の数字表記に切り替わる個数 */
export const LIFE_HOURGLASS_DOME_COUNT_THRESHOLD = 4

/** 器のアイコンを並べる最大数。超えた分は小さい器から省略する */
export const LIFE_HOURGLASS_MAX_BOWL_ICONS = 12

/**
 * 砂粒の累計から、器ごとの個数を導出する(器の名前は保存しない)。
 * 大きい器から順に取り、端数(最小の器に満たない分)はアイコン化しない。
 * 合体規則(茶碗10→バケツ1、バケツ10→教室1、教室3→体育館1、体育館3→ドーム1)は
 * 容量の設定から自動的に成り立つため、別には持たない。
 */
export const computeBowls = (totalGrains: number): BowlCounts => {
  const counts = {} as BowlCounts
  let rest = Math.max(0, Math.floor(totalGrains))
  for (const bowl of LIFE_HOURGLASS_BOWLS) {
    const count = Math.min(Math.floor(rest / bowl.grains), bowl.max)
    counts[bowl.id] = count
    rest -= count * bowl.grains
  }
  return counts
}

/** 累計の砂粒(桁区切り) */
export const formatGrains = (grains: number): string => Math.max(0, Math.floor(grains)).toLocaleString('ja-JP')

/** 「託された時間」の表示(1粒 = 視聴者1人の1秒 → 砂粒 ÷ 3600 を時間と分に) */
export const formatTrustedTime = (grains: number): string => {
  const totalMinutes = Math.floor(Math.max(0, grains) / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}時間${minutes}分`
}

/** 配信時間の表示(H:MM:SS) */
export const formatStreamTime = (seconds: number): string => {
  const s = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
