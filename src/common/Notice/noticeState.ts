// src/common/Notice/noticeState.ts
// 通知(トースト)の一覧と、表示時間の管理。表示する側は ToastHost.vue(エディター等)と generator の NoticeWidget.vue。
// Pinia を使わない(アプリ起動前・コンポーザブルの外からでも呼べるようにするため)。文言の既定値は持たない(title は呼び出し側が渡す)
import { ref } from 'vue'

export type NoticeKind = 'success' | 'warning' | 'error' | 'info' | 'cooldown'

/**
 * 表示先
 * - app: エディター・マネージャー・コンソールなどの画面(ToastHost)
 * - stage: 配信画面(generator の NoticeWidget)
 * どちらかのホストしかない画面では、そのホストに出る(resolveScope)
 */
export type NoticeScope = 'app' | 'stage'

export type NoticeAction = { label: string; run: () => void }

export type Notice = {
  id: number
  kind: NoticeKind
  scope: NoticeScope
  title: string
  text?: string
  durationMs: number
  action?: NoticeAction
}

export type NoticeInput = {
  kind: NoticeKind
  title: string
  text?: string
  scope?: NoticeScope
  /** 表示時間(ミリ秒)。省略時は DEFAULT_DURATION_MS */
  durationMs?: number
  action?: NoticeAction
}

export const DEFAULT_DURATION_MS = 5000

/** 同じ表示先に同時に出す件数。超えたら古いものから消す */
const MAX_NOTICES_PER_SCOPE = 5

export const notices = ref<Notice[]>([])

// 表示先(ホスト)が何個マウントされているか
const hostCount: Record<NoticeScope, number> = { app: 0, stage: 0 }

/** ホストのマウント時に呼ぶ。戻り値はアンマウント時に呼ぶ */
export const registerNoticeHost = (scope: NoticeScope): (() => void) => {
  hostCount[scope] += 1
  return () => {
    hostCount[scope] -= 1
  }
}

// 指定した表示先のホストがなく、もう一方のホストがあるなら、そちらに出す(見えないまま消えるのを防ぐ)
// 例: generator 単体では app のホストがないので、app 宛の通知も NoticeWidget に出る
const resolveScope = (requested: NoticeScope): NoticeScope => {
  const other: NoticeScope = requested === 'app' ? 'stage' : 'app'
  return hostCount[requested] === 0 && hostCount[other] > 0 ? other : requested
}

// ---- 自動で消すタイマー(ホバー中の一時停止に対応) ----
type TimerState = { handle: number | undefined; remainingMs: number; startedAt: number }
const timers = new Map<number, TimerState>()

const arm = (id: number) => {
  const timer = timers.get(id)
  if (!timer) return
  timer.startedAt = Date.now()
  timer.handle = window.setTimeout(() => removeNotice(id), timer.remainingMs)
}

export const pauseNotice = (id: number) => {
  const timer = timers.get(id)
  if (!timer || timer.handle === undefined) return
  window.clearTimeout(timer.handle)
  timer.handle = undefined
  timer.remainingMs -= Date.now() - timer.startedAt
}

export const resumeNotice = (id: number) => {
  const timer = timers.get(id)
  if (!timer || timer.handle !== undefined) return
  arm(id)
}

export const removeNotice = (id: number) => {
  const timer = timers.get(id)
  if (timer?.handle !== undefined) window.clearTimeout(timer.handle)
  timers.delete(id)
  notices.value = notices.value.filter((notice) => notice.id !== id)
}

let nextId = 1

/**
 * 通知を追加する。
 * エラーは同じ文言が続けて起きやすいので、同じ表示先ですでに出ているものは入れ替えて(表示時間を延ばして)1 件にまとめる。
 * それ以外(cooldown を含む)は、重なるほど情報になるのでまとめない
 */
export const pushNotice = (input: NoticeInput): number => {
  const scope = resolveScope(input.scope ?? 'app')
  const id = nextId++
  const notice: Notice = {
    id,
    kind: input.kind,
    scope,
    title: input.title,
    text: input.text,
    durationMs: input.durationMs ?? DEFAULT_DURATION_MS,
    action: input.action,
  }

  if (notice.kind === 'error') {
    notices.value
      .filter((n) => n.scope === scope && n.kind === 'error' && n.title === notice.title && n.text === notice.text)
      .forEach((n) => removeNotice(n.id))
  }

  notices.value = [...notices.value, notice]

  // 表示先ごとに上限を超えた分を、古いものから消す
  const sameScope = notices.value.filter((n) => n.scope === scope)
  sameScope.slice(0, Math.max(0, sameScope.length - MAX_NOTICES_PER_SCOPE)).forEach((n) => removeNotice(n.id))

  timers.set(id, { handle: undefined, remainingMs: notice.durationMs, startedAt: 0 })
  arm(id)
  return id
}
