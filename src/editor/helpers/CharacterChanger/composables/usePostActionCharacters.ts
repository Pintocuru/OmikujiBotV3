// src/editor/helpers/CharacterChanger/composables/usePostActionCharacters.ts
import { PostFlowType } from '@/types/OmikujiData/'
import { FlowTarget } from './useDataExtractor'
import { useCharacterLookup } from './useCharacterLookup'

/**
 * PostFlow内のキャラクター情報を扱うユーティリティ
 */
export function usePostActionCharacters() {
  const { resolveEmotion } = useCharacterLookup()

  /**
   * アセットが持つ PostFlow 配列を取得（みくじ箱は postFlow 種別のアイテムごとに1配列）
   */
  const getFlowGroups = (target: FlowTarget): PostFlowType[][] => {
    if (target.category === 'actions') return [target.item.postFlows]
    return target.item.omikuji.flatMap((omikuji) => (omikuji.kind === 'postFlow' ? [omikuji.postFlows] : []))
  }

  /**
   * PostFlow が参照しているキャラクターキー（message / gameScript）
   */
  const getFlowCharacterKey = (flow: PostFlowType): string | null => {
    if (flow.kind === 'message' || flow.kind === 'gameScript') return flow.characterKey?.trim() || null
    return null
  }

  /**
   * 使用されているキャラクターキーを抽出
   */
  const extractCharacterKeys = (flows: PostFlowType[]): string[] => {
    const keys = new Set<string>()
    flows.forEach((flow) => {
      const key = getFlowCharacterKey(flow)
      if (key) keys.add(key)
    })
    return Array.from(keys).sort()
  }

  /**
   * キャラクター使用箇所数をカウント
   */
  const countCharacterUsage = (flows: PostFlowType[]): Record<string, number> => {
    const counts: Record<string, number> = {}
    flows.forEach((flow) => {
      const key = getFlowCharacterKey(flow)
      if (key) counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }

  /**
   * キャラクターマッピングに基づいて PostFlow 配列を更新
   */
  const applyCharacterMappings = (flows: PostFlowType[], mappings: Record<string, string>): PostFlowType[] => {
    return flows.map((flow) => {
      if (flow.kind !== 'message' && flow.kind !== 'gameScript') return flow
      const newKey = mappings[flow.characterKey || '']
      return newKey ? { ...flow, characterKey: newKey } : flow
    })
  }

  /**
   * iconKeyが不正かどうか（キャラに画像が存在しないiconKey）
   * resolveEmotionがフォールバックするということは不正
   */
  const isInvalidIconKey = (characterKey: string | null, iconKey: string): boolean => {
    if (!characterKey) return false
    return resolveEmotion(characterKey, iconKey) !== iconKey
  }

  /**
   * 不正なiconKeyの { characterKey, iconKey } ペアを抽出
   */
  const extractInvalidIconKeyPairs = (flows: PostFlowType[]): { characterKey: string; iconKey: string }[] => {
    const seen = new Set<string>()
    const pairs: { characterKey: string; iconKey: string }[] = []

    flows.forEach((flow) => {
      if (flow.kind !== 'message' || !flow.characterKey) return
      if (!isInvalidIconKey(flow.characterKey, flow.iconKey)) return

      const key = `${flow.characterKey}:${flow.iconKey}`
      if (!seen.has(key)) {
        seen.add(key)
        pairs.push({ characterKey: flow.characterKey, iconKey: flow.iconKey })
      }
    })

    return pairs
  }

  /**
   * iconKey使用回数をカウント（キーは "characterKey:iconKey" の複合形式）
   */
  const countIconKeyUsage = (flows: PostFlowType[]): Record<string, number> => {
    const counts: Record<string, number> = {}

    flows.forEach((flow) => {
      if (flow.kind !== 'message' || !flow.characterKey) return
      const key = `${flow.characterKey}:${flow.iconKey}`
      counts[key] = (counts[key] || 0) + 1
    })

    return counts
  }

  /**
   * iconKeyマッピングを適用（mappingsのキーは "characterKey:iconKey" 複合形式）
   */
  const applyIconKeyMappings = (flows: PostFlowType[], mappings: Record<string, string>): PostFlowType[] => {
    return flows.map((flow) => {
      if (flow.kind !== 'message' || !flow.characterKey) return flow
      const newIconKey = mappings[`${flow.characterKey}:${flow.iconKey}`]
      return newIconKey ? { ...flow, iconKey: newIconKey } : flow
    })
  }

  return {
    getFlowGroups,
    extractCharacterKeys,
    countCharacterUsage,
    applyCharacterMappings,
    isInvalidIconKey,
    extractInvalidIconKeyPairs,
    countIconKeyUsage,
    applyIconKeyMappings,
  }
}
