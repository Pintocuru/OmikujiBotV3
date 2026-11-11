// src/games/shared/variableStep.ts
import type { ScenarioStepVariableType } from '@/types/OmikujiData'
import type { GameOutputVariable } from '@/games/types'

const SAFE_NAME_FRAGMENT = /^[A-Za-z0-9_]+$/
const FALLBACK_USER_ID = 'test' // コメントなしのときは、既定のプレースホルダー(userId = test)に合わせる
const NUMBER_LIMIT = 999_999_999

// ユーザー別の変数名に使えない ID(- や日本語を含む)は、既定値に置き換える
export const safeUserId = (userId: string | undefined): string =>
  userId && SAFE_NAME_FRAGMENT.test(userId) ? userId : FALLBACK_USER_ID

export const outputVariableName = (variable: GameOutputVariable, userId?: string): string =>
  variable.perUser ? `${variable.name}_${safeUserId(userId)}` : variable.name

const toNumber = (value: number): number => {
  const rounded = Math.round(value * 100) / 100
  return Math.max(-NUMBER_LIMIT, Math.min(NUMBER_LIMIT, Number.isFinite(rounded) ? rounded : 0))
}

/**
 * ゲームの結果を、評価ブロック(variable ステップ)として返す
 * GameScriptsHandler がスクリプト実行の直後に評価するので、後続のステップの [[変数名]] で読める
 */
export function buildVariableStep(
  entries: { variable: GameOutputVariable; value: number }[],
  userId?: string
): ScenarioStepVariableType {
  const message = entries
    .map(({ variable, value }) => `${outputVariableName(variable, userId)} = ${toNumber(value)}`)
    .join('; ')
  return { kind: 'variable', delaySeconds: 0, message }
}
