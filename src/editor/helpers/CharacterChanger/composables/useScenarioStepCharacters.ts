// src/editor/helpers/CharacterChanger/composables/useScenarioStepCharacters.ts
import { ScenarioStepType, ScenarioType } from '@/types/OmikujiData/'
import { FlowTarget } from './useDataExtractor'
import { useCharacterLookup } from './useCharacterLookup'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'

/**
 * ステップ内のキャラクター情報を扱うユーティリティ
 */
export function useScenarioStepCharacters() {
  const { getCharacter } = useCharacterLookup()
  const { getAsset } = useGetAssetData()

  /**
   * みくじ箱内のアイテムが変更対象か（itemId 未指定なら箱内すべて）
   */
  const isTargetItem = (target: FlowTarget, omikujiId: string): boolean =>
    target.category !== 'mikuji' || !target.itemId || target.itemId === omikujiId

  /**
   * 対象が参照しているシナリオ(みくじ箱は steps 種別アイテムの stepKey から重複なしで解決)
   */
  const getTargetScenarios = (target: FlowTarget): ScenarioType[] => {
    if (target.category === 'scenarios') return [target.item]

    const scenarios = new Map<string, ScenarioType>()
    target.item.omikuji.forEach((omikuji) => {
      if (omikuji.kind !== 'steps' || !isTargetItem(target, omikuji.id)) return
      const scenario = getAsset('scenarios', omikuji.stepKey)
      if (scenario) scenarios.set(scenario.key, scenario)
    })
    return [...scenarios.values()]
  }

  /**
   * アセットが持つ steps 配列を取得（みくじ箱は steps 種別のアイテムごとに1配列）
   */
  const getStepGroups = (target: FlowTarget): ScenarioStepType[][] =>
    getTargetScenarios(target).map((scenario) => scenario.steps)

  /**
   * ステップが参照しているキャラクターキー（message / gameScript）
   */
  const getStepCharacterKey = (step: ScenarioStepType): string | null => {
    if (step.kind === 'message' || step.kind === 'gameScript') return step.characterKey?.trim() || null
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
  const isInvalidIconKey = (characterKey: string | null, iconKey: string): boolean => {
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
    isTargetItem,
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
