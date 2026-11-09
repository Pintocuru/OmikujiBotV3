// src/editor/helpers/CharacterChanger/composables/useScenarioStepCharacters.ts
import { ScenarioStepType, ScenarioType } from '@/types/OmikujiData/'
import { FlowTarget } from '../types'
import { useCharacterLookup } from './useCharacterLookup'

/**
 * ステップ内のキャラクター情報を扱うユーティリティ
 */
export function useScenarioStepCharacters() {
  const { getCharacter } = useCharacterLookup()

  /**
   * 対象が参照しているシナリオ
   */
  const getTargetScenarios = (target: FlowTarget): ScenarioType[] => [target.item]

  /**
   * シナリオが持つ steps 配列を取得
   */
  const getStepGroups = (target: FlowTarget): ScenarioStepType[][] =>
    getTargetScenarios(target).map((scenario) => Object.values(scenario.steps))

  /**
   * ステップが参照しているキャラクターキー（message / gameScript）
   */
  const getStepCharacterKey = (step: ScenarioStepType): string | null => {
    if (step.kind === 'message' || step.kind === 'gameScript') return step.characterKey.trim() || null
    return null
  }

  /**
   * 使用されているキャラクターキーを抽出
   */
  const extractCharacterKeys = (steps: ScenarioStepType[]): string[] => {
    const keys = new Set<string>()
    steps.forEach((step) => {
      const key = getStepCharacterKey(step)
      if (key) keys.add(key)
    })
    return Array.from(keys).sort()
  }

  /**
   * キャラクター使用箇所数をカウント
   */
  const countCharacterUsage = (steps: ScenarioStepType[]): Record<string, number> => {
    const counts: Record<string, number> = {}
    steps.forEach((step) => {
      const key = getStepCharacterKey(step)
      if (key) counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }

  /**
   * キャラクターマッピングに基づいて ステップ配列を更新
   */
  const applyCharacterMappings = (steps: ScenarioStepType[], mappings: Record<string, string>): ScenarioStepType[] => {
    return steps.map((step) => {
      if (step.kind !== 'message' && step.kind !== 'gameScript') return step
      const newKey = mappings[step.characterKey || '']
      return newKey ? { ...step, characterKey: newKey } : step
    })
  }

  /**
   * iconKeyが不正かどうか（キャラに画像が存在しないiconKey）
   * resolveEmotionがフォールバックするということは不正
   */
  const isInvalidIconKey = (characterKey: string, iconKey: string): boolean => {
    if (!characterKey) return false

    const character = getCharacter(characterKey)
    return !character || !(iconKey in character.image)
  }

  /**
   * 不正なiconKeyの { characterKey, iconKey } ペアを抽出
   */
  const extractInvalidIconKeyPairs = (steps: ScenarioStepType[]): { characterKey: string; iconKey: string }[] => {
    const seen = new Set<string>()
    const pairs: { characterKey: string; iconKey: string }[] = []

    steps.forEach((step) => {
      if (step.kind !== 'message' || !step.characterKey) return
      if (!isInvalidIconKey(step.characterKey, step.iconKey)) return

      const key = `${step.characterKey}:${step.iconKey}`
      if (!seen.has(key)) {
        seen.add(key)
        pairs.push({ characterKey: step.characterKey, iconKey: step.iconKey })
      }
    })

    return pairs
  }

  /**
   * iconKey使用回数をカウント（キーは "characterKey:iconKey" の複合形式）
   */
  const countIconKeyUsage = (steps: ScenarioStepType[]): Record<string, number> => {
    const counts: Record<string, number> = {}

    steps.forEach((step) => {
      if (step.kind !== 'message' || !step.characterKey) return
      const key = `${step.characterKey}:${step.iconKey}`
      counts[key] = (counts[key] || 0) + 1
    })

    return counts
  }

  /**
   * iconKeyマッピングを適用（mappingsのキーは "characterKey:iconKey" 複合形式）
   */
  const applyIconKeyMappings = (steps: ScenarioStepType[], mappings: Record<string, string>): ScenarioStepType[] => {
    return steps.map((step) => {
      if (step.kind !== 'message' || !step.characterKey) return step
      const newIconKey = mappings[`${step.characterKey}:${step.iconKey}`]
      return newIconKey ? { ...step, iconKey: newIconKey } : step
    })
  }

  return {
    getStepGroups,
    getTargetScenarios,
    extractCharacterKeys,
    countCharacterUsage,
    applyCharacterMappings,
    isInvalidIconKey,
    extractInvalidIconKeyPairs,
    countIconKeyUsage,
    applyIconKeyMappings,
  }
}
