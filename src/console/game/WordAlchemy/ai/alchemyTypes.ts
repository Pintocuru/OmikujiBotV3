// src/console/game/WordAlchemy/ai/alchemyTypes.ts
// 完成品の判定で使う型

/** 分類: A 生物 / B 食物 / C 道具 / D ガラクタ (完成物の性質で判断) */
export const ALCHEMY_CATEGORIES = ['A', 'B', 'C', 'D'] as const
export type AlchemyCategory = (typeof ALCHEMY_CATEGORIES)[number]

/** 色のパレット (固定。AI に 1 つ選ばせる) */
export const ALCHEMY_PALETTE = ['赤', '橙', '黄', '緑', '青', '紫', '白', '黒'] as const
export type AlchemyColor = (typeof ALCHEMY_PALETTE)[number]

/** 完成品の判定の結果。実際に表示するアイテムは、c と k でゲーム側が抽選する */
export type AlchemyResult = { c: AlchemyCategory; k: AlchemyColor; n: string }

/** 0 以上 1 未満の乱数 (テストでは固定の値を渡す) */
export type Rng = () => number
