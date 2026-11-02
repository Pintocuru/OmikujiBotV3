// tools/JsonMerge/remaps.ts
import type {
  OmikujiDataType,
  JsonMergeRemapType,
  ScenarioStepRecordType,
  ScenarioStepMessageType,
  ScenarioStepGameScriptType,
} from '@/types/OmikujiData/'

/**
 * message の characterKey / iconKey にリマップルールを適用
 */
function remapMessage(step: ScenarioStepMessageType, remaps: JsonMergeRemapType[]): ScenarioStepMessageType {
  let remapped = step

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
function remapGameScript(step: ScenarioStepGameScriptType, remaps: JsonMergeRemapType[]): ScenarioStepGameScriptType {
  // characterKeyが空の場合は早期return
  if (!step.characterKey) return step

  for (const remap of remaps) {
    if (remap.fromCharacterKey && remap.toCharacterKey && step.characterKey === remap.fromCharacterKey) {
      return { ...step, characterKey: remap.toCharacterKey } // characterKeyは1つしかないので、マッチしたら終了
    }
  }

  return step
}

/**
 * ステップ(Record)に対してリマップルールを適用
 */
function remapSteps(steps: ScenarioStepRecordType, remaps: JsonMergeRemapType[]): ScenarioStepRecordType {
  return Object.fromEntries(
    Object.entries(steps).map(([id, step]) => {
      if (step.kind === 'message') return [id, { ...remapMessage(step, remaps), id }]
      if (step.kind === 'gameScript') return [id, { ...remapGameScript(step, remaps), id }]
      return [id, step]
    })
  )
}

/**
 * OmikujiData全体に対してリマップを適用
 * 対象: assets.scenarios
 */
export function applyRemaps(data: OmikujiDataType, remaps: JsonMergeRemapType[]): OmikujiDataType {
  if (!remaps?.length) return data

  const clonedData: OmikujiDataType = JSON.parse(JSON.stringify(data))

  for (const scenario of Object.values(clonedData.assets.scenarios)) {
    scenario.steps = remapSteps(scenario.steps, remaps)
  }

  return clonedData
}
