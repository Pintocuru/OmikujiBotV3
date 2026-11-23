// src/console/game/NuisanceSurvival/composables/useOshikuraChain.ts
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { gameStateApi } from '@/manager/services/gameStateApi'
import { ConnectionError } from '@/manager/services/baseApiClient'
import { createStreamId } from '@/console/common/scripts/streamId'
import { createOmikenHistory } from '@/common/OmikenHistory'
import { POST_SETTINGS } from '@/sdk/PostSettings'
import { GetOmikenComments } from '@/sdk/subscribe/OmikenComment/GetOmikenComments'
import { MAX_GAME_LOGS_PER_APPEND } from '@/types/api'
import type { OmikenCommentType } from '@/types/OmikenComment'
import { isMoveKey, resolveInput } from '../scripts/heroInput'
import type { NuisanceConfigType } from '../scripts/nuisanceConfig'
import { CONTRIBUTION_EVENT_KEY, MAX_FRAME_SECONDS, SURVIVAL_EVENT_KEY } from '../scripts/nuisanceConstants'
import {
  advance,
  createGame,
  getContributionRanking,
  type GameState,
  type NuisanceEvent,
  type SpawnRequest,
} from '../scripts/nuisanceEngine'
import { buildContributionLogs, buildSurvivalLog } from '../scripts/nuisanceRecord'
import { createRng, type Rng } from '../scripts/rng'
import { useNuisanceConfig } from './useNuisanceConfig'

export type NuisancePhase = 'idle' | 'running' | 'over'
/** ゲームログへの記録の状態 */
export type RecordStatus = 'idle' | 'saving' | 'saved' | 'error'
export type CommentStatus = 'connecting' | 'ready' | 'error'

/** 演出が受け取らないまま溜まるイベントの上限 */
const MAX_QUEUED_EVENTS = 200

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

/** 文字入力中のキーは、ゲームの操作にしない */
const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

/**
 * おしくらチェインの進行
 * idle (メニュー) → running → over (結果)
 * - 時間は、フレームごとの経過時間 (上限つき) を足したゲーム内の時計で進める。更新は requestAnimationFrame だけから呼ぶので、
 *   ウィンドウが非表示の間は、ゲームも止まる (再表示されたら、そのときの状態から続ける)
 * - コメントは OneSDK の購読で受け取り、届いた時刻をつけて溜める。ゲーム中のコメントだけが邪魔者になる (履歴・BOT・非表示中は除く)
 * - 進行で起きたこと (出現・撃破) は、演出用のイベントとして溜める。演出側が drainEvents で受け取る (ゲームから演出は操作しない)
 * - 結果は、終わったときに自動でゲームログ (GameLog) に記録する。ユーザーの得点 (update-user-stats) は変えない
 */
export function useOshikuraChain() {
  const configStore = useNuisanceConfig()

  const phase = ref<NuisancePhase>('idle')
  /** メニュー (タイトル・コンフィグ・スタート) を出すか。上部バーのクリックで開閉する */
  const showMenu = ref(false)
  const state = shallowRef<GameState | null>(null)
  /** ゲーム中に使っている設定 (スタートしたときの値。ゲーム中は変わらない) */
  const activeConfig = shallowRef<NuisanceConfigType | null>(null)
  const commentStatus = ref<CommentStatus>('connecting')
  const recordStatus = ref<RecordStatus>('idle')
  const recordError = ref('')
  /** ゲームログの保存先 (1配信 = 1ファイル)。このウィンドウを開いている間は、同じファイルに残す */
  const streamId = createStreamId()

  let rng: Rng = createRng(1)
  let runId = ''
  /** ゲーム内の時計 (開始からの秒)。ゲーム中だけ、フレームごとに進む */
  let gameClock = 0
  let lastFrameAt = 0
  let recordedAt = 0
  let pendingSpawns: SpawnRequest[] = []
  let eventQueue: NuisanceEvent[] = []
  const heldCodes: string[] = []
  let frameId = 0

  const ranking = computed(() => (state.value ? getContributionRanking(state.value) : []))

  /** 描画用の時計。ゲーム中はゲーム内の時計、それ以外は止まった時刻 */
  const getClock = () => (phase.value === 'running' ? gameClock : (state.value?.elapsed ?? 0))

  /** 溜まった演出用のイベントを渡して、空にする (受け取り手がいなくても溜まり続けないよう、上限がある) */
  const drainEvents = (): NuisanceEvent[] => {
    const events = eventQueue
    eventQueue = []
    return events
  }

  // ---- 進行 ----

  const stopDriver = () => {
    cancelAnimationFrame(frameId)
    frameId = 0
  }

  const pump = () => {
    const current = state.value
    const config = activeConfig.value
    if (phase.value !== 'running' || !current || !config) return
    const result = advance(current, config, gameClock, resolveInput(heldCodes), pendingSpawns, rng)
    pendingSpawns = result.pending
    if (result.events.length) eventQueue = [...eventQueue, ...result.events].slice(-MAX_QUEUED_EVENTS)
    if (result.state === current) return
    state.value = result.state
    if (result.state.over) finish()
    // 刻みの上限で止まったときは、次のフレームで続きを進める
  }

  const startDriver = () => {
    stopDriver()
    lastFrameAt = 0
    const loop = (timestamp: number) => {
      // 非表示の間は、このコールバックが呼ばれない。再表示の最初のフレームは、経過時間の上限で丸める
      const dt = lastFrameAt ? Math.min(MAX_FRAME_SECONDS, (timestamp - lastFrameAt) / 1000) : 0
      lastFrameAt = timestamp
      gameClock += dt
      pump()
      if (phase.value === 'running') frameId = requestAnimationFrame(loop)
    }
    frameId = requestAnimationFrame(loop)
  }

  const start = async () => {
    if (phase.value === 'running') return
    const config = await configStore.commit()
    stopDriver()
    activeConfig.value = config
    rng = createRng((Date.now() ^ Math.floor(Math.random() * 0x100000000)) >>> 0)
    runId = `run-${Date.now().toString(36)}-${Math.floor(rng() * 0x10000).toString(36)}`
    state.value = createGame(config)
    pendingSpawns = []
    heldCodes.length = 0
    recordStatus.value = 'idle'
    recordError.value = ''
    gameClock = 0
    eventQueue = []
    phase.value = 'running'
    showMenu.value = false
    startDriver()
  }

  const finish = () => {
    stopDriver()
    phase.value = 'over'
    recordedAt = Date.now()
    void record()
  }

  const toMenu = () => {
    if (phase.value === 'running') return
    phase.value = 'idle'
    state.value = null
    showMenu.value = true
  }

  /** 上部バーのクリック。ゲーム中は何もしない (ゲームは止めない) */
  const toggleMenu = () => {
    if (phase.value === 'idle') showMenu.value = !showMenu.value
  }

  // ---- 記録 ----

  /** 結果をゲームログに記録する (同じ内容を何度送っても、サーバーが二重に保存しない。失敗したら再試行できる) */
  const record = async () => {
    const finished = state.value
    if (!finished?.over || !runId || recordStatus.value === 'saving' || recordStatus.value === 'saved') return
    const id = runId
    recordStatus.value = 'saving'
    recordError.value = ''
    try {
      // ユーザーごとの貢献度 (1 回に送れる件数の上限があるので、分けて送る) と、全体の生存時間は、別の eventKey に記録する
      const contributionLogs = buildContributionLogs(finished, id, recordedAt)
      for (let i = 0; i < contributionLogs.length; i += MAX_GAME_LOGS_PER_APPEND) {
        await gameStateApi.appendGameLogs(
          streamId,
          CONTRIBUTION_EVENT_KEY,
          contributionLogs.slice(i, i + MAX_GAME_LOGS_PER_APPEND)
        )
      }
      await gameStateApi.appendGameLogs(streamId, SURVIVAL_EVENT_KEY, [buildSurvivalLog(finished, id, recordedAt)])
      if (id === runId) recordStatus.value = 'saved'
    } catch (error) {
      if (id !== runId) return // 保存中に、次のゲームが始まっていた
      recordStatus.value = 'error'
      recordError.value = error instanceof ConnectionError ? 'サーバーに接続できません' : messageOf(error)
    }
  }

  // ---- コメント (OneSDK の購読) ----

  // 受け取り済みコメントの履歴 (再配信されたコメントを、邪魔者にしないため)
  const { addOmikens, clearOmikens } = createOmikenHistory()

  const onComments = (omikens: OmikenCommentType[], isReset: boolean, isFirstLoad: boolean) => {
    if (isReset) {
      clearOmikens()
      return
    }
    // 履歴 (購読の最初に届く過去のコメント) やゲーム前のコメントも、「受け取り済み」として覚える
    // (覚えておかないと、あとから再配信されたときに、新規コメントとして邪魔者になる)
    const newOmikens = addOmikens(omikens)
    // 邪魔者になるのは、ゲーム中に届いた新規コメントだけ (非表示の間は、ゲームが止まっているので無視する)
    if (isFirstLoad || phase.value !== 'running' || document.hidden) return
    const atSeconds = gameClock
    for (const omiken of newOmikens) {
      if (omiken.userId === POST_SETTINGS.botUserId) continue // おみくじBOT自身の投稿は、ユーザーではない
      pendingSpawns.push({
        atSeconds,
        userId: omiken.userId,
        userName: omiken.userName,
        profileImage: omiken.profileImage,
        lc: omiken.meta.lc, // 0 は不明 (ボスにならない)
        isFirst: omiken.meta.tc === 1, // その人の最初のコメント (初見さん)。係数が 1 に戻る
        comment: omiken.comment, // 文字数に応じて、「ことば」が降ってくる
        giftPrice: omiken.giftPrice ?? undefined, // ギフトなら、邪魔者ではなく障害物になる
      })
    }
  }

  /** 購読は 1 回だけ行う (呼び直すと履歴が再配信されるため。ゲーム中かどうかは phase で切り替える) */
  const connectComments = async () => {
    commentStatus.value = 'connecting'
    try {
      commentStatus.value = (await GetOmikenComments(onComments)) ? 'ready' : 'error'
    } catch (error) {
      console.error('[OshikuraChain] コメントの購読に失敗しました:', error)
      commentStatus.value = 'error'
    }
  }

  // ---- キー入力 (WASD) ----

  const onKeydown = (event: KeyboardEvent) => {
    if (!isMoveKey(event.code) || isTyping(event.target)) return
    if (phase.value === 'running') event.preventDefault()
    if (!heldCodes.includes(event.code)) heldCodes.push(event.code)
  }
  const onKeyup = (event: KeyboardEvent) => {
    const index = heldCodes.indexOf(event.code)
    if (index >= 0) heldCodes.splice(index, 1)
  }
  /** ウィンドウが外れたとき、キーを離したことが伝わらず、押しっぱなしになるのを防ぐ */
  const clearKeys = () => {
    heldCodes.length = 0
  }

  onMounted(() => {
    void configStore.load()
    void connectComments()
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('keyup', onKeyup)
    window.addEventListener('blur', clearKeys)
  })
  onBeforeUnmount(() => {
    stopDriver()
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('keyup', onKeyup)
    window.removeEventListener('blur', clearKeys)
  })

  return {
    phase,
    showMenu,
    state,
    activeConfig,
    ranking,
    commentStatus,
    recordStatus,
    recordError,
    streamId,
    configStore,
    getClock,
    drainEvents,
    start,
    toMenu,
    toggleMenu,
    record,
    connectComments,
  }
}
