// src/console/game/NuisanceSurvival/composables/useNuisanceSurvival.ts
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { gameStateApi } from '@/manager/services/gameStateApi'
import { ConnectionError } from '@/manager/services/baseApiClient'
import { createStreamId } from '@/console/common/scripts/streamId'
import { POST_SETTINGS } from '@/sdk/PostSettings'
import { GetOmikenComments } from '@/sdk/subscribe/OmikenComment/GetOmikenComments'
import { MAX_GAME_LOGS_PER_APPEND } from '@/types/api'
import type { OmikenCommentType } from '@/types/OmikenComment'
import { isMoveKey, resolveInput } from '../scripts/heroInput'
import type { NuisanceConfigType } from '../scripts/nuisanceConfig'
import { DAMAGE_EVENT_KEY, PUMP_INTERVAL_MS, SURVIVAL_EVENT_KEY } from '../scripts/nuisanceConstants'
import {
  advance,
  createGame,
  getContributionRanking,
  type GameState,
  type SpawnRequest,
} from '../scripts/nuisanceEngine'
import { buildDamageLogs, buildSurvivalLog } from '../scripts/nuisanceRecord'
import { createRng, type Rng } from '../scripts/rng'
import { useNuisanceConfig } from './useNuisanceConfig'

export type NuisancePhase = 'idle' | 'running' | 'over'
/** ゲームログへの記録の状態 */
export type RecordStatus = 'idle' | 'saving' | 'saved' | 'error'
export type CommentStatus = 'connecting' | 'ready' | 'error'

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

/** 文字入力中のキーは、ゲームの操作にしない */
const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

/**
 * 邪魔者サバイバルの進行
 * idle (メニュー) → running → over (結果)
 * - 時間は壁時計 (performance.now) で進める。更新は requestAnimationFrame とタイマーの両方から呼ぶので、
 *   ウィンドウが隠れて描画が止まっても、ゲームは止まらない (止まっていた分は、次の更新でまとめて追いつく)
 * - コメントは OneSDK の購読で受け取り、届いた時刻をつけて溜める。ゲーム中のコメントだけが邪魔者になる (履歴・BOT は除く)
 * - 結果は、終わったときに自動でゲームログ (GameLog) に記録する。ユーザーの得点 (update-user-stats) は変えない
 */
export function useNuisanceSurvival() {
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
  let runStartedAt = 0
  let recordedAt = 0
  let pendingSpawns: SpawnRequest[] = []
  const heldCodes: string[] = []
  let frameId = 0
  let intervalId: ReturnType<typeof setInterval> | undefined

  const ranking = computed(() => (state.value ? getContributionRanking(state.value) : []))

  /** ゲーム開始からの実時間 (秒) */
  const wallSeconds = () => (performance.now() - runStartedAt) / 1000
  /** 描画用の時計。ゲーム中は実時間、それ以外は止まった時刻 */
  const getClock = () => (phase.value === 'running' ? wallSeconds() : (state.value?.elapsed ?? 0))

  // ---- 進行 ----

  const stopDrivers = () => {
    cancelAnimationFrame(frameId)
    if (intervalId) clearInterval(intervalId)
    intervalId = undefined
  }

  const pump = () => {
    const current = state.value
    const config = activeConfig.value
    if (phase.value !== 'running' || !current || !config) return
    const result = advance(current, config, wallSeconds(), resolveInput(heldCodes), pendingSpawns, rng)
    pendingSpawns = result.pending
    if (result.state === current) return
    state.value = result.state
    if (result.state.over) finish()
    // 刻みの上限で止まったときは、次のタイマー (数十ミリ秒後) で続きを進める
  }

  const startDrivers = () => {
    stopDrivers()
    intervalId = setInterval(pump, PUMP_INTERVAL_MS)
    const loop = () => {
      pump()
      frameId = requestAnimationFrame(loop)
    }
    frameId = requestAnimationFrame(loop)
  }

  const start = async () => {
    if (phase.value === 'running') return
    const config = await configStore.commit()
    stopDrivers()
    activeConfig.value = config
    rng = createRng((Date.now() ^ Math.floor(Math.random() * 0x100000000)) >>> 0)
    runId = `run-${Date.now().toString(36)}-${Math.floor(rng() * 0x10000).toString(36)}`
    state.value = createGame(config)
    pendingSpawns = []
    heldCodes.length = 0
    recordStatus.value = 'idle'
    recordError.value = ''
    runStartedAt = performance.now()
    phase.value = 'running'
    showMenu.value = false
    startDrivers()
  }

  const finish = () => {
    stopDrivers()
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
      const damageLogs = buildDamageLogs(finished, id, recordedAt)
      for (let i = 0; i < damageLogs.length; i += MAX_GAME_LOGS_PER_APPEND) {
        await gameStateApi.appendGameLogs(streamId, DAMAGE_EVENT_KEY, damageLogs.slice(i, i + MAX_GAME_LOGS_PER_APPEND))
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

  const onComments = (omikens: OmikenCommentType[], isReset: boolean, isFirstLoad: boolean) => {
    // 履歴 (購読の最初に届く過去のコメント) とリセットは、邪魔者にしない。ゲーム中のコメントだけが対象
    if (isReset || isFirstLoad || phase.value !== 'running') return
    const atSeconds = wallSeconds()
    for (const omiken of omikens) {
      if (omiken.userId === POST_SETTINGS.botUserId) continue // おみくじBOT自身の投稿は、ユーザーではない
      pendingSpawns.push({
        atSeconds,
        userId: omiken.userId,
        userName: omiken.userName,
        profileImage: omiken.profileImage,
      })
    }
  }

  /** 購読は 1 回だけ行う (呼び直すと履歴が再配信されるため。ゲーム中かどうかは phase で切り替える) */
  const connectComments = async () => {
    commentStatus.value = 'connecting'
    try {
      commentStatus.value = (await GetOmikenComments(onComments)) ? 'ready' : 'error'
    } catch (error) {
      console.error('[NuisanceSurvival] コメントの購読に失敗しました:', error)
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
    stopDrivers()
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
    start,
    toMenu,
    toggleMenu,
    record,
    connectComments,
  }
}
