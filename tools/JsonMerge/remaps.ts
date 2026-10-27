// tools/JsonMerge/remaps.ts
import type {
  OmikujiDataType,
  JsonMergeRemapType,
  PostFlowType,
  PostFlowMessageType,
  PostFlowGameType,
} from '@/types/OmikujiData/'

/**
 * message の characterKey / iconKey にリマップルールを適用
 */
function remapMessage(flow: PostFlowMessageType, remaps: JsonMergeRemapType[]): PostFlowMessageType {
  let remapped = flow

  for (const remap of remaps) {
    // characterKeyの置き換え
    if (remap.fromCharacterKey && remap.toCharacterKey && remapped.characterKey === remap.fromCharacterKey) {
      remapped = { ...remapped, characterKey: remap.toCharacterKey }
    }

    // iconKeyの置き換え
    if (remap.fromIconKey && remap.toIconKey && remapped.iconKey === remap.fromIconKey) {
      remapped = { ...remapped, iconKey: remap.toIconKey }
    }
  }

  // 変更がなければ元のオブジェクトを返す(メモリ節約)
  return remapped
}

/**
 * gameScript の characterKey にリマップルールを適用
 */
function remapGameScript(flow: PostFlowGameType, remaps: JsonMergeRemapType[]): PostFlowGameType {
  // characterKeyが空の場合は早期return
  if (!flow.characterKey) return flow

  for (const remap of remaps) {
    if (remap.fromCharacterKey && remap.toCharacterKey && flow.characterKey === remap.fromCharacterKey) {
      return { ...flow, characterKey: remap.toCharacterKey } // characterKeyは1つしかないので、マッチしたら終了
    }
  }

  return flow
}

/**
 * PostFlow の配列に対してリマップルールを適用
 */
function remapPostFlows(postFlows: PostFlowType[], remaps: JsonMergeRemapType[]): PostFlowType[] {
  return postFlows.map((flow) => {
    if (flow.kind === 'message') return remapMessage(flow, remaps)
    if (flow.kind === 'gameScript') return remapGameScript(flow, remaps)
    return flow
  })
}

/**
 * OmikujiData全体に対してリマップを適用
 * 対象: assets.mikuji(各アイテムの postFlows) と assets.actions
 */
export function applyRemaps(data: OmikujiDataType, remaps: JsonMergeRemapType[]): OmikujiDataType {
  if (!remaps?.length) return data

  const clonedData: OmikujiDataType = JSON.parse(JSON.stringify(data))

  // mikuji: postFlows を持つアイテム(kind 省略時も postFlow 扱い)のみ
  for (const box of Object.values(clonedData.assets.mikuji)) {
    for (const item of box.omikuji) {
      if ('postFlows' in item) {
        item.postFlows = remapPostFlows(item.postFlows, remaps)
      }
    }
  }

  // actions
  for (const actionSet of Object.values(clonedData.assets.actions)) {
    actionSet.postFlows = remapPostFlows(actionSet.postFlows, remaps)
  }

  return clonedData
}
