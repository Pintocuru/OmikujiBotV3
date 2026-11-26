// src/console/game/WordAlchemy/ai/buildPrompt.ts
// AI に渡すプロンプト (純粋関数)。材料は JSON 配列で渡す (コメントのカンマや引用符で壊れないように)。ユーザー名・ID・鍋の表示名は送らない
import { potMap, type PotKey } from '../maps/WordAlchemyPotMap'
import { ALCHEMY_PALETTE } from './alchemyTypes'

/** pot は、煮込みに使う鍋 (闇鍋なら、引いたあとの鍋。resolveBrewPot を通したもの) */
export const buildPrompt = (materials: readonly string[], pot: PotKey): string =>
  [
    `材料:${JSON.stringify(materials)}`,
    `指示:${potMap[pot].instruction}`,
    '分類:A生物 B食物 C道具 Dガラクタ(完成物で判断)',
    `色:${ALCHEMY_PALETTE.join(' ')} から1つ`,
    '出力JSONのみ:{"n":"名前","c":"A|B|C|D","k":"色"}',
  ].join('\n')
