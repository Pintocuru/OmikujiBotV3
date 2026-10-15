// src/editor/helpers/CharacterChanger/usePostActionCharacters.ts
import { useCharacterManager } from '@/generator/scripts/CharacterManager/useCharacterManager'
import { PostFlowType, ActionSetType } from '@/types/OmikujiData/'

/**
 * PostAction内のキャラクター情報を扱うユーティリティ
 */
export function usePostActionCharacters() {
  const { resolveEmotion } = useCharacterManager()

  /**
   * Actions から使用されているキャラクターキーを抽出（GameScriptsを含む）
   */
  const extractCharacterKeys = (actions: ActionSetType): string[] => {
    const keys = new Set<string>()

    actions.postFlows.forEach((action) => {
      if (action.kind === 'message' && action.characterKey?.trim()) {
        keys.add(action.characterKey)
      }
    })

    return Array.from(keys).sort()
  }

  /**
   * ActionSetからキャラクター使用箇所数をカウント（GameScriptsを含む）
   */
  const countCharacterUsage = (actions: ActionSetType): Record<string, number> => {
    const counts: Record<string, number> = {}

    // PostActionsからカウント
    actions.postFlows.forEach((action) => {
      if (action.kind === 'message') {
        const key = action.characterKey
        if (key) counts[key] = (counts[key] || 0) + 1
      }
    })

    return counts
  }

  /**
   * キャラクターマッピングに基づいてPostAction配列を更新
   */
  const mapPostActionsCharacterKey = (
    postActions: PostFlowType[],
    mappings: Record<string, string>
  ): PostFlowType[] => {
    return postActions.map((action) => {
      if (action.kind === 'message') {
        const newCharacterId = mappings[action.characterKey || '']
        if (newCharacterId) {
          return { ...action, characterKey: newCharacterId }
        }
      }
      return action
    })
  }

  /**
   * キャラクターマッピングに基づいてActionSetを更新（GameScriptsを含む）
   */
  const applyCharacterMappings = (actions: ActionSetType, mappings: Record<string, string>): ActionSetType => {
    const newActionSet = { ...actions }

    // PostActionsを更新
    newActionSet.postFlows = mapPostActionsCharacterKey(actions.postFlows, mappings)

    return newActionSet
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
   * ActionSetから不正なiconKeyの { characterKey, iconKey } ペアを抽出
   */
  const extractInvalidIconKeyPairs = (actions: ActionSetType): { characterKey: string; iconKey: string }[] => {
    const seen = new Set<string>()
    const pairs: { characterKey: string; iconKey: string }[] = []

    actions.postFlows.forEach((action) => {
      if (action.kind !== 'message') return
      if (!action.characterKey) return
      if (!isInvalidIconKey(action.characterKey, action.iconKey)) return

      const key = `${action.characterKey}:${action.iconKey}`
      if (!seen.has(key)) {
        seen.add(key)
        pairs.push({ characterKey: action.characterKey, iconKey: action.iconKey })
      }
    })

    return pairs
  }

  /**
   * ActionSetのiconKey使用回数をカウント
   * キーは "characterKey:iconKey" の複合形式
   */
  const countIconKeyUsage = (actions: ActionSetType): Record<string, number> => {
    const counts: Record<string, number> = {}

    actions.postFlows.forEach((action) => {
      if (action.kind !== 'message') return
      if (!action.characterKey) return
      const key = `${action.characterKey}:${action.iconKey}`
      counts[key] = (counts[key] || 0) + 1
    })

    return counts
  }

  /**
   * iconKeyマッピングを適用してActionSetを更新
   * mappingsのキーは "characterKey:iconKey" 複合形式
   */
  const applyIconKeyMappings = (actions: ActionSetType, mappings: Record<string, string>): ActionSetType => {
    const newPostActions = actions.postFlows.map((action) => {
      if (action.kind !== 'message') return action
      if (!action.characterKey) return action
      const compositeKey = `${action.characterKey}:${action.iconKey}`
      const newIconKey = mappings[compositeKey]
      if (!newIconKey) return action
      return { ...action, iconKey: newIconKey }
    })

    return { ...actions, postFlows: newPostActions }
  }

  return {
    extractCharacterKeys,
    countCharacterUsage,
    applyCharacterMappings,
    isInvalidIconKey,
    extractInvalidIconKeyPairs,
    countIconKeyUsage,
    applyIconKeyMappings,
  }
}
