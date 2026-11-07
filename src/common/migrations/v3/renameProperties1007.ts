// src/common/migrations/v3/renameProperties1007.ts
//
// dataVersion 3.0000001006 (3.0.0-alpha6) -> 3.0000001007 (3.0.0-alpha7) のデータ変換。
//
// 変換内容:
//   assets.mikuji[*].omikuji[]  (kind: 'steps')      stepKey   -> scenarioKey
//   assets.mikuji[*].omikuji[].lottery.criteria      userName  -> usernames
//   assets.scenarios[*].steps (kind: 'gameScript')   scriptId  -> scriptKey
//   assets.scenarios[*].steps (message / gameScript) characterKey: null -> ''
//   assets.characters[*].image[*].animation          duration  -> durationSeconds
//   events.comments[].trigger                        userName  -> usernames

/** 変換後の dataVersion */
export const DATA_VERSION_3_0000001007 = 3.0000001007

type Obj = Record<string, any>

const obj = (v: unknown): Obj => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : {})
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v)

/** from のキーを to に移す。to が既にあれば to を優先し、from は捨てる */
function renameKey(o: Obj, from: string, to: string): Obj {
  if (!(from in o)) return o
  const { [from]: value, ...rest } = o
  return to in rest ? rest : { ...rest, [to]: value }
}

/** criteria / trigger の userName -> usernames */
function migrateUsernames(target: unknown): unknown {
  return isObj(target) ? renameKey(target, 'userName', 'usernames') : target
}

/** みくじ箱のアイテム */
function migrateOmikujiItem(item: unknown): unknown {
  if (!isObj(item)) return item
  let next: Obj = renameKey(item, 'stepKey', 'scenarioKey')
  if (isObj(next.lottery) && isObj(next.lottery.criteria)) {
    next = { ...next, lottery: { ...next.lottery, criteria: migrateUsernames(next.lottery.criteria) } }
  }
  return next
}

/** シナリオのステップ */
function migrateStep(step: unknown): unknown {
  if (!isObj(step)) return step
  let next: Obj = step
  if (next.kind === 'gameScript') next = renameKey(next, 'scriptId', 'scriptKey')
  if ((next.kind === 'message' || next.kind === 'gameScript') && 'characterKey' in next && next.characterKey == null) {
    next = { ...next, characterKey: '' }
  }
  return next
}

/** steps は Record(id キー)。念のため配列も受ける */
function migrateSteps(steps: unknown): unknown {
  if (Array.isArray(steps)) return steps.map(migrateStep)
  if (!isObj(steps)) return steps
  return Object.fromEntries(Object.entries(steps).map(([id, step]) => [id, migrateStep(step)]))
}

/** キャラクターの画像セット */
function migrateImages(image: unknown): unknown {
  if (!isObj(image)) return image
  return Object.fromEntries(
    Object.entries(image).map(([emotion, value]) => {
      if (!isObj(value) || !isObj(value.animation)) return [emotion, value]
      return [emotion, { ...value, animation: renameKey(value.animation, 'duration', 'durationSeconds') }]
    })
  )
}

/** record の各値を fn で変換する(record でなければそのまま返す) */
function mapRecord(record: unknown, fn: (value: unknown) => unknown): unknown {
  if (!isObj(record)) return record
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, fn(value)]))
}

/**
 * データ全体のプロパティ名を alpha7 の形に変換し、meta.dataVersion を 3.0000001007 に更新する。
 * 入力データは変更せず、変換後の新しいオブジェクトを返す。
 */
export function migrateRenameProperties1007(data: unknown): Obj {
  const root = obj(data)
  const assets = obj(root.assets)
  const events = obj(root.events)

  const mikuji = mapRecord(assets.mikuji, (box) => {
    if (!isObj(box) || !Array.isArray(box.omikuji)) return box
    return { ...box, omikuji: box.omikuji.map(migrateOmikujiItem) }
  })
  const scenarios = mapRecord(assets.scenarios, (scenario) =>
    isObj(scenario) ? { ...scenario, steps: migrateSteps(scenario.steps) } : scenario
  )
  const characters = mapRecord(assets.characters, (character) =>
    isObj(character) ? { ...character, image: migrateImages(character.image) } : character
  )
  const comments = Array.isArray(events.comments)
    ? events.comments.map((event) =>
        isObj(event) ? { ...event, trigger: migrateUsernames(event.trigger) } : event
      )
    : events.comments

  return {
    ...root,
    ...('assets' in root
      ? {
          assets: {
            ...assets,
            ...('mikuji' in assets ? { mikuji } : {}),
            ...('scenarios' in assets ? { scenarios } : {}),
            ...('characters' in assets ? { characters } : {}),
          },
        }
      : {}),
    ...('events' in root ? { events: { ...events, ...('comments' in events ? { comments } : {}) } } : {}),
    meta: {
      ...obj(root.meta),
      dataVersion: DATA_VERSION_3_0000001007,
    },
  }
}
