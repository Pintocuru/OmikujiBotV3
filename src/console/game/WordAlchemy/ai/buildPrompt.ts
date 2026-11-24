// src/console/game/WordAlchemy/ai/buildPrompt.ts
// AI に渡すプロンプト (純粋関数)。材料は JSON 配列で渡す (コメントのカンマや引用符で壊れないように)。ユーザー名・ID は送らない
import { potMap, type PotKey } from '../maps/WordAlchemyPotMap'
import { NAME_MAX_LENGTH } from '../scripts/wordAlchemyConstants'
import { ALCHEMY_PALETTE } from './alchemyTypes'

export const buildPrompt = (materials: readonly string[], pot: PotKey): string =>
  [
    `材料: ${JSON.stringify(materials)}`,
    `鍋: ${potMap[pot].instruction}`,
    '',
    '材料と鍋にない文字・単語の追加は禁止。',
    ...(potMap[pot].omit ? [`名前は ${NAME_MAX_LENGTH} 文字以内。`] : []),
    '分類: A生物 B食物 C道具 Dガラクタ(完成物の性質で判断)。',
    `色: ${ALCHEMY_PALETTE.join('')} から 1 つ。`,
    '出力は {"c":"A|B|C|D","k":"色","n":"名前"} のみのJSON。',
  ].join('\n')
