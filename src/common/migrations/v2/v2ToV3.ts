// src/common/migrations/v2/v2ToV3.ts
//
// v2 (dataVersion < 3) -> v3 のデータ変換。
// v2 の型定義 (./v2/OmikujiData) を元にしているが、実行時には v2 のスキーマを使わない。
// 「素のJSON」を読んで v3 の形に組み替えるだけにして、最終的な検証・補完は v3 の OmikujiDataSchema に任せる。
// ※ zod の配列は要素が1つでも不正だと配列ごと catch されるため、v3 の enum に収まらない値はここで取り除く。
import { commentTriggerCondition, criteriaThresholdCondition, reactionKeys } from '@/types/OmikujiData'

type Obj = Record<string, any>

const obj = (v: unknown): Obj => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : {})
const arr = (v: unknown): any[] => (Array.isArray(v) ? v : [])
const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback)
const only = <T extends string>(list: readonly T[], values: unknown): T[] =>
  arr(values).filter((x): x is T => (list as readonly unknown[]).includes(x))

/** Record を order 昇順（同値は元の順）の配列にする */
function sortedEntries(record: unknown): [string, Obj][] {
  return Object.entries(obj(record))
    .map(([k, v]) => [k, obj(v)] as [string, Obj])
    .sort((a, b) => (Number(a[1].order) || 0) - (Number(b[1].order) || 0))
}

/** BaseRecordSchema 相当の共通項目（daisyColor -> tagColor） */
function baseRecord(old: Obj): Obj {
  return {
    id: old.id,
    key: old.key,
    name: old.name,
    description: old.description,
    createdAt: old.createdAt,
    updatedAt: old.updatedAt,
    order: old.order,
    isEnabled: old.isEnabled,
    tags: old.tags,
    tagColor: old.tagColor ?? old.daisyColor,
  }
}

// ---------------------------------------------------------------------------
// PostFlow
// ---------------------------------------------------------------------------

/** v2 の message は { bubble, isToast } -> v3 は文字列（トースト/フキダシの分離は廃止） */
const messageText = (m: unknown): string => (typeof m === 'string' ? m : str(obj(m).bubble))

function migratePostFlow(old: unknown): Obj | null {
  const f = obj(old)
  const kind = f.actionType ?? f.kind ?? 'message'
  const base = { delaySeconds: f.delaySeconds }

  switch (kind) {
    case 'message':
      return {
        ...base,
        kind: 'message',
        characterKey: f.characterKey,
        iconKey: f.iconKey,
        sound: f.sound,
        soundPath: f.soundPath,
        message: messageText(f.message),
      }
    case 'sound':
      return { ...base, kind: 'sound', sound: f.sound, soundPath: f.soundPath }
    case 'wordParty':
      // wordParty -> wordPartyId
      return { ...base, kind: 'wordParty', wordPartyId: str(f.wordPartyId) || str(f.wordParty), repeat: f.repeat }
    case 'variable':
      return { ...base, kind: 'variable', message: messageText(f.message) }
    case 'bot':
      return { ...base, kind: 'bot', botName: f.botName, message: messageText(f.message) }
    case 'actionSet':
    case 'flowCall':
      // actionSet -> flowCall / actionSetKeys -> callKeys
      return { ...base, kind: 'flowCall', callKeys: f.actionSetKeys ?? f.callKeys }
    default:
      return null // 未知の種別は捨てる（残すと postFlows 全体が catch される）
  }
}

/** v2 の gameScripts（ActionSet の1形態）-> v3 の gameScript PostFlow */
function migrateGameScript(gs: unknown): Obj[] {
  const g = obj(gs)
  if (!g.scriptId) return []
  return [
    {
      kind: 'gameScript',
      delaySeconds: g.delaySeconds,
      scriptId: g.scriptId,
      characterKey: g.characterKey ?? '',
      queryString: g.queryString ?? '',
    },
  ]
}

function migratePostFlows(old: Obj): Obj[] {
  switch (old.type ?? 'postActions') {
    case 'gameScripts':
      return migrateGameScript(old.gameScripts)
    case 'special':
      return [] // 特殊動作は ActionSet では表現しない（おみくじアイテム側の control/log）
    default:
      return arr(old.postActions)
        .map(migratePostFlow)
        .filter((x): x is Obj => x !== null)
  }
}

// ---------------------------------------------------------------------------
// OmikujiItem (v2: おみくじ内の ActionSet + weight/criteria) -> v3: kind 付きアイテム + lottery
// ---------------------------------------------------------------------------

function migrateCriteria(c: unknown): Obj {
  const o = obj(c)
  return { ...o, conditions: only(criteriaThresholdCondition, o.conditions) }
}

function migrateLottery(old: Obj): Obj {
  const weight = typeof old.weight === 'number' ? old.weight : 1
  const criteria = old.criteria ? migrateCriteria(old.criteria) : null
  // 優先アイテムは criteria 必須
  return old.isPriority === true
    ? { isPriority: true, weight, criteria: criteria ?? {} }
    : { isPriority: false, weight, criteria }
}

/** 特殊動作の種別。旧データ（special が文字列）は return 以外を continue として扱う（v2 の transform と同じ） */
function specialType(old: Obj): string {
  if (typeof old.special === 'string') return old.special === 'return' ? 'return' : 'continue'
  return str(obj(old.behavior).type, 'return')
}

function migrateOmikujiItem(oldItem: unknown): Obj {
  const old = obj(oldItem)
  const base = {
    id: old.id,
    key: old.key,
    name: old.name,
    description: old.description,
    createdAt: old.createdAt,
    updatedAt: old.updatedAt,
    lottery: migrateLottery(old),
  }

  if ((old.type ?? 'postActions') === 'special') {
    const behavior = obj(old.behavior)
    const type = specialType(old)

    // logUserState / logOmikuji / logGame / logVariable -> log（targetKey は v3 に無いため破棄）
    if (type.startsWith('log')) {
      const log = obj(behavior.log)
      return { ...base, kind: 'log', logFormat: log.logFormat, logLimit: log.logLimit }
    }
    return {
      ...base,
      kind: 'control',
      command: type === 'resetOmikuji' ? 'reset' : type === 'continue' ? 'continue' : 'return',
      isCountEvent: behavior.isCountEvent,
    }
  }

  return {
    ...base,
    kind: 'postFlow',
    postFlows: migratePostFlows(old),
    cooldownSeconds: typeof old.actionCooldownSeconds === 'number' ? old.actionCooldownSeconds : undefined,
  }
}

// ---------------------------------------------------------------------------
// Events: Record(inline omikuji) -> Array + assets.mikuji(みくじ箱) への分離
// ---------------------------------------------------------------------------

// v2 のカテゴリ -> v3 のカテゴリ / kind
const EVENT_MAP = [
  { from: 'comments', to: 'comments', kind: 'comments' },
  { from: 'timers', to: 'timers', kind: 'timers' },
  { from: 'metas', to: 'services', kind: 'services' }, // metas -> services
  { from: 'reactions', to: 'reactions', kind: 'reaction' }, // v3 の kind は 'reaction'
] as const

function migrateTrigger(from: string, trigger: unknown): Obj | undefined {
  const t = obj(trigger)
  switch (from) {
    case 'comments':
      // v3 から syoken / count 条件は廃止
      return { ...t, conditions: only(commentTriggerCondition, t.conditions) }
    case 'reactions':
      return { ...t, reactions: only(reactionKeys, t.reactions) }
    case 'metas':
      return t
    default:
      return undefined
  }
}

function migrateEvents(old: Obj, mikuji: Obj): Obj {
  const events: Obj = {}
  const usedKeys = new Set<string>()

  for (const { from, to, kind } of EVENT_MAP) {
    events[to] = sortedEntries(old[from]).map(([recordKey, ev]) => {
      // 各イベントの omikuji[] を、イベントと同じ key のみくじ箱へ移す（カテゴリ間で key が被る場合は接頭辞を付ける）
      let boxKey = str(ev.key, recordKey)
      if (usedKeys.has(boxKey)) boxKey = `${to}_${boxKey}`
      while (usedKeys.has(boxKey)) boxKey += '_'
      usedKeys.add(boxKey)

      mikuji[boxKey] = {
        ...baseRecord(ev),
        id: undefined, // みくじ箱は新規ID
        key: boxKey,
        omikuji: arr(ev.omikuji).map(migrateOmikujiItem),
      }

      const trigger = migrateTrigger(from, ev.trigger)
      const event: Obj = { ...baseRecord(ev), kind, omikujiKey: boxKey }
      if (trigger) event.trigger = trigger
      if (from === 'timers') {
        event.mode = ev.mode
        event.intervalSeconds = ev.intervalSeconds
        event.isBaseZero = ev.isBaseZero
      }
      return event // limits（クールダウン/連投制限）は v3 のイベントに無いため破棄
    })
  }
  return events
}

// ---------------------------------------------------------------------------
// Assets
// ---------------------------------------------------------------------------

const EMOTION_LABELS: Record<string, string> = {
  default: 'デフォルト',
  happy: '嬉しい',
  surprised: '驚き',
  sad: '悲しみ',
  angry: '怒り',
  thinking: '考え中',
}

/** 旧: string[] / 新: { label, src, animation } の混在 -> 新形式へ */
function migrateImages(image: unknown): Obj {
  const result: Obj = {}
  for (const [key, v] of Object.entries(obj(image))) {
    if (Array.isArray(v)) {
      result[key] = { label: EMOTION_LABELS[key] ?? key, src: v.filter((s) => typeof s === 'string') }
    } else if (v && typeof v === 'object') {
      const img = v as Obj
      result[key] = {
        label: img.label,
        src: img.src,
        ...(img.animation && typeof img.animation === 'object' ? { animation: img.animation } : {}),
      }
    }
  }
  return result
}

function migrateCharacter(key: string, c: Obj): Obj {
  const color = obj(c.color)
  const display = obj(c.displayOption)
  return {
    ...baseRecord(c),
    key,
    displayName: c.displayName,
    // nameColor / textColor / backgroundColor -> name / text / background（accent は既定値）
    color: { name: color.nameColor, text: color.textColor, background: color.backgroundColor },
    image: migrateImages(c.image),
    displayOption: {
      mode: display.mode === 'rpgVoice' ? 'voice' : display.mode, // rpgVoice モードは廃止
      imageBase64: display.imageBase64,
      frameId: display.frameId,
    },
  }
}

/** Record を order 順に並べ直したうえで、Record のキーを key として揃える */
function migrateRecord(record: unknown, convert: (key: string, item: Obj) => Obj): Obj {
  return Object.fromEntries(sortedEntries(record).map(([key, item]) => [key, convert(key, item)]))
}

// ---------------------------------------------------------------------------
// UI / Settings
// ---------------------------------------------------------------------------

function migrateUi(components: unknown): Obj {
  const c = obj(components)
  const bubble = obj(obj(c.settings).bubble)
  const show = obj(bubble.showCharacters)

  // 複数キャラの並び (showCharacters) は廃止。最初の1人を常時表示キャラにする
  const persistentCharacter =
    ['slot1', 'slot2', 'slot3', 'slot4', 'center']
      .flatMap((slot) => arr(show[slot]))
      .find((x): x is string => typeof x === 'string' && x !== '') ?? ''

  return {
    layout: 'commentBubble', // 標準装備は commentBubble のみ
    fontFamily: obj(c.commonStyle).fontFamily,
    settings: {
      commentBubble: {
        persistentCharacter,
        characterSize: bubble.characterSize,
        bubbleMotion: bubble.bubbleMotionEnter, // bubbleMotionEnter -> bubbleMotion
      },
    },
  }
}

// v2 の initialCategory -> v3 のカテゴリ名
const CATEGORY_RENAME: Record<string, string> = { metas: 'services', actionSets: 'actions', components: 'ui' }

function migrateSettings(settings: unknown): Obj {
  const s = obj(settings)
  return {
    generator: { commentType: s.commentType, soundEnabled: s.soundEnabled, basicDelaySeconds: s.basicDelaySeconds },
    editor: { locale: s.locale, initialCategory: CATEGORY_RENAME[s.initialCategory] ?? s.initialCategory },
    developer: { daisyUiTheme: s.daisyUiTheme },
  }
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------

/**
 * v2 のデータを v3 の形に組み替える（meta はそのまま。バージョン更新と最終検証は呼び出し側）。
 *
 * 破棄されるもの:
 *  - featureUsage（flags）/ settings の ignoreUserPattern・includeExternalComments・uiPlacement・licenseKeyHash
 *  - components の bubble 以外の設定、conditions、specialSet、commonStyle の色・音声、bubbleText*
 *  - イベントの limits、コメントトリガーの syoken / count 条件
 *  - キャラクターの customClasses、rpgVoice、その他 v2 のみの項目
 */
export function migrateV2ToV3(data: unknown): Obj {
  const old = obj(data)
  const mikuji: Obj = {}
  const events = migrateEvents(old, mikuji)

  return {
    meta: old.meta,
    events,
    assets: {
      mikuji,
      actions: migrateRecord(old.actionSets, (key, a) => ({
        ...baseRecord(a),
        key,
        postFlows: migratePostFlows(a),
      })),
      placeholders: migrateRecord(old.placeholders, (key, p) => ({ ...baseRecord(p), key, values: p.values })),
      characters: migrateRecord(old.characters, migrateCharacter),
    },
    ui: migrateUi(old.components),
    jsonMerge: arr(old.jsonMerge).map((j) => {
      const m = obj(j)
      return { ...baseRecord(m), sourceFile: m.sourceFile, keySuffix: m.keySuffix, remaps: m.remaps }
    }),
    settings: migrateSettings(old.settings),
  }
}
