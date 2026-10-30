// tools/JsonMerge/remaps.ts
import type {
  OmikujiDataType,
  JsonMergeRemapType,
  ScenarioStepType,
  ScenarioStepMessageType,
  ScenarioStepGameType,
} from '@/types/OmikujiData/'

/**
 * message の characterKey / iconKey にリマップルールを適用
 */
function remapMessage(flow: ScenarioStepMessageType, remaps: JsonMergeRemapType[]): ScenarioStepMessageType {
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
function remapGameScript(flow: ScenarioStepGameType, remaps: JsonMergeRemapType[]): ScenarioStepGameType {
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
 * ステップの配列に対してリマップルールを適用
 */
function remapSteps(steps: ScenarioStepType[], remaps: JsonMergeRemapType[]): ScenarioStepType[] {
  return steps.map((flow) => {
    if (flow.kind === 'message') return remapMessage(flow, remaps)
    if (flow.kind === 'gameScript') return remapGameScript(flow, remaps)
    return flow
  })
}

/**
 * OmikujiData全体に対してリマップを適用
 * 対象: assets.mikuji(各アイテムの steps) と assets.scenarios
 */
export function applyRemaps(data: OmikujiDataType, remaps: JsonMergeRemapType[]): OmikujiDataType {
  if (!remaps?.length) return data

  const clonedData: OmikujiDataType = JSON.parse(JSON.stringify(data))

  // mikuji: kind が 'steps' のアイテムのみ
  for (const box of Object.values(clonedData.assets.mikuji)) {
    for (const item of box.omikuji) {
      if (item.kind === 'steps') {
        item.steps = remapSteps(item.steps, remaps)
      }
    }
  }

  // actions
  for (const scenario of Object.values(clonedData.assets.scenarios)) {
    scenario.steps = remapSteps(scenario.steps, remaps)
  }

  return clonedData
}
