// src/common/migrations/v3/stepsArrayToRecord.ts
//
// dataVersion 3.0000001004 -> 3.0000001005 のデータ変換。
// ※ 現在のコード（index.ts 等）には未接続の別途ファイルです。
//    データの手動変換がすべて完了してから、現行コード側をこの形式に合わせて改修します。
//
// 変換内容:
//   assets.scenarios[*].steps : ScenarioStepType[]  ->  Record<stepId, ScenarioStepType & { id: stepId }>
//   各ステップに id（UUID）を付与し、配列のインデックスではなく id をキーにする。
//   表示順は従来通り delaySeconds 昇順（読み込み側で Object.values を sort する）。

/** 変換後の dataVersion */
export const DATA_VERSION_3_0000001005 = 3.0000001005

/** 変換前の dataVersion（このバージョンのデータを変換対象とする） */
export const DATA_VERSION_3_0000001004 = 3.0000001004

type Obj = Record<string, any>

const obj = (v: unknown): Obj => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : {})
const arr = (v: unknown): any[] => (Array.isArray(v) ? v : [])

/** ステップに id を付与する */
function withStepId(step: unknown, index: number): Obj {
  const s = obj(step)
  return {
    ...s,
    id:
      typeof s.id === 'string' && s.id !== ''
        ? s.id
        : (globalThis.crypto?.randomUUID?.() ?? `step_${Date.now()}_${index}`),
  }
}

/**
 * 1つのシナリオの steps（配列）を Record<id, step> に変換する。
 * id が重複する場合は再採番する。
 */
export function stepsArrayToRecord(steps: unknown): Record<string, Obj> {
  // 変換済み(Record)はそのまま返す(誤って空にしない)
  if (steps && typeof steps === 'object' && !Array.isArray(steps)) return steps as Record<string, Obj>

  const record: Record<string, Obj> = {}
  arr(steps).forEach((step, index) => {
    const withId = withStepId(step, index)
    let id = String(withId.id)
    while (Object.prototype.hasOwnProperty.call(record, id)) {
      id = `${id}_dup`
      withId.id = id
    }
    record[id] = withId
  })
  return record
}

/**
 * データ全体の assets.scenarios[*].steps を配列 -> Record に変換し、
 * meta.dataVersion を 3.0000001005 に更新する。
 * 入力データは変更せず、変換後の新しいオブジェクトを返す。
 */
export function migrateStepsArrayToRecord(data: unknown): Obj {
  const root = obj(data)
  const assets = obj(root.assets)
  const scenarios = obj(assets.scenarios)

  const newScenarios: Record<string, Obj> = {}
  for (const [key, scenario] of Object.entries(scenarios)) {
    const s = obj(scenario)
    newScenarios[key] = {
      ...s,
      steps: stepsArrayToRecord(s.steps),
    }
  }

  return {
    ...root,
    assets: {
      ...assets,
      scenarios: newScenarios,
    },
    meta: {
      ...obj(root.meta),
      dataVersion: DATA_VERSION_3_0000001005,
    },
  }
}
