// src/console/game/WordAlchemy/composables/useWordAlchemy.ts
// 言葉の錬金術の進行 (idle ↔ running) と、コメントの受け取り。盤面の進行そのものは render/WordAlchemyStage.ts が持つ
import { onBeforeUnmount, onMounted, reactive, ref, shallowRef } from 'vue'
import { ConnectionError } from '@/manager/services/baseApiClient'
import { gameStateApi } from '@/manager/services/gameStateApi'
import { createStreamId } from '@/console/common/scripts/streamId'
import { createOmikenHistory } from '@/common/OmikenHistory'
import { createMockUserPool, pickTestComment, type MockUserPool } from '@/common/MockUser'
import { POST_SETTINGS } from '@/sdk/PostSettings'
import { GetOmikenComments } from '@/sdk/subscribe/OmikenComment/GetOmikenComments'
import type { AiSlotKeyType } from '@/types/api'
import type { OmikenCommentType } from '@/types/OmikenComment'
import { createAiClient } from '../ai/aiClient'
import { runAlchemy } from '../ai/alchemy'
import { itemList } from '../maps/WordAlchemyItemMap'
import { wordAlchemyMessages } from '../maps/WordAlchemyMessageMap'
import { DEFAULT_POT, type PotKey } from '../maps/WordAlchemyPotMap'
import type { BrewHandler, StageOptions, WordAlchemyStage } from '../render/WordAlchemyStage'
import { drawItem } from '../scripts/drawItem'
import { buildDiscoveryLogs, WORD_ALCHEMY_EVENT_KEY } from '../scripts/discoveryLog'
import { acceptsWord } from '../scripts/potRules'
import { useAiSettings } from './useAiSettings'
import { useCodex } from './useCodex'
import { AUTO_COMMENT_INTERVAL_SECONDS, AUTO_COMMENT_USER_COUNT } from '../scripts/wordAlchemyConstants'

export type WordAlchemyPhase = 'idle' | 'running'
export type CommentSource = 'live' | 'auto'
export type CommentStatus = 'connecting' | 'ready' | 'error'
/** 直近の完成品の判定に使ったもの (main / sub: その接続先の AI / mock: キー未設定 / failed: AI が失敗して Mock / limited: 上限超過で Mock) */
export type AiLast = 'main' | 'sub' | 'mock' | 'failed' | 'limited'

/**
 * - コメントは OneSDK の購読で受け取り、ゲーム中に届いた新規コメントだけを盤面へ渡す (履歴・BOT・非表示中は除く)
 * - コメントオートモードでは、実コメントを無視して、一定間隔で架空のコメントを入れる (非表示の間は入れない)
 */
export function useWordAlchemy() {
  const phase = ref<WordAlchemyPhase>('idle')
  const commentSource = ref<CommentSource>('live')
  const commentStatus = ref<CommentStatus>('connecting')
  const stage = shallowRef<WordAlchemyStage | null>(null)
  /** 鍋の種類 (1 ゲーム 1 鍋。ゲーム中は変えない)。コンフィグができるまでは、タイトルで選ぶ */
  const potType = ref<PotKey>(DEFAULT_POT)

  const aiSettings = useAiSettings()
  /** 画面に出す、AI の状態 (直近の判定に使ったものと、このウィンドウを開いてからの回数) */
  const aiUsage = reactive({ last: 'mock' as AiLast, ai: 0, mock: 0 })

  /**
   * 盤面に渡す設定。完成品は runAlchemy で決める。
   * AI の接続先が設定されていれば、サーバーの中継ハンドラ経由で聞く (メイン → サブの切り替えはサーバーが行う)。未設定なら Mock だけ
   */
  const codex = useCodex()
  /** ゲームログの保存先 (1配信 = 1ファイル)。このウィンドウを開いている間は、同じファイルに残す */
  const streamId = createStreamId()
  /** ゲームログへの記録に失敗したときの理由 (成功したら空) */
  const recordError = ref('')

  /** 発見をゲームログに記録する (材料を出したユーザーごとに 1 件。同じ内容を再送しても二重にならない)。オートの架空ユーザーは記録しない */
  const recordDiscovery = async (found: { name: string; isNew: boolean; users: { userId: string; userName: string }[] }) => {
    if (commentSource.value === 'auto') return
    const createdAt = Date.now()
    const logs = buildDiscoveryLogs({
      ...found,
      discoveryId: `d-${createdAt.toString(36)}-${Math.floor(Math.random() * 0x10000).toString(36)}`,
      createdAt,
    })
    if (!logs.length) return
    try {
      await gameStateApi.appendGameLogs(streamId, WORD_ALCHEMY_EVENT_KEY, logs)
      recordError.value = ''
    } catch (error) {
      recordError.value =
        error instanceof ConnectionError ? 'サーバーに接続できません' : error instanceof Error ? error.message : String(error)
    }
  }

  /** 煮込み: 完成品の判定 (名前・分類・色) → アイテムの抽選 → 図鑑に記録。抽選できなければ、アイテムは生成せずメッセージだけ出す */
  const brew: BrewHandler = async (materials) => {
    const pot = potType.value
    let usedSlot: AiSlotKeyType = 'main'
    const client = aiSettings.configured.value ? createAiClient((slot) => (usedSlot = slot)) : null
    const { result, source, rateLimited } = await runAlchemy(
      materials.map((m) => m.text),
      pot,
      client
    )
    if (source === 'ai') {
      aiUsage.ai++
      aiUsage.last = usedSlot
    } else {
      aiUsage.mock++
      aiUsage.last = rateLimited ? 'limited' : client ? 'failed' : 'mock'
    }
    const item = drawItem(itemList, result.c, result.k)
    if (!item) {
      const lost = wordAlchemyMessages.lost
      return { title: lost[Math.floor(Math.random() * lost.length)], kind: 'lost' }
    }
    const isNew = codex.record({ itemId: item.id, name: result.n, userNames: materials.map((m) => m.userName), pot })
    void recordDiscovery({ name: result.n, isNew, users: materials })
    return {
      title: result.n,
      subtitle: isNew ? wordAlchemyMessages.outcome.new : wordAlchemyMessages.outcome.known,
      kind: isNew ? 'new' : 'known',
    }
  }

  const stageOptions: StageOptions = { brew, accepts: (text) => acceptsWord(potType.value, text) }

  let autoPool: MockUserPool | null = null
  let autoTimer = 0

  const stopAuto = () => {
    clearInterval(autoTimer)
    autoTimer = 0
    autoPool = null
  }

  const start = (source: CommentSource) => {
    if (phase.value === 'running' || !stage.value) return
    commentSource.value = source
    stopAuto()
    if (source === 'auto') {
      const pool = createMockUserPool(AUTO_COMMENT_USER_COUNT)
      autoPool = pool
      autoTimer = window.setInterval(() => {
        if (document.hidden) return
        const user = pool.pick('regular')
        stage.value?.spawn({ userId: user.userId, userName: user.userName, comment: pickTestComment('chat') })
      }, AUTO_COMMENT_INTERVAL_SECONDS * 1000)
    }
    stage.value.start()
    phase.value = 'running'
  }

  const abort = () => {
    if (phase.value !== 'running') return
    stopAuto()
    stage.value?.stop()
    phase.value = 'idle'
  }

  // ---- コメント (OneSDK の購読) ----

  // 受け取り済みコメントの履歴 (再配信されたコメントを、ことばにしないため)
  const { addOmikens, clearOmikens } = createOmikenHistory()

  const onComments = (omikens: OmikenCommentType[], isReset: boolean, isFirstLoad: boolean) => {
    if (isReset) {
      clearOmikens()
      return
    }
    // 履歴やゲーム前のコメントも、「受け取り済み」として覚える (再配信されたときに、新規コメントにならないように)
    const newOmikens = addOmikens(omikens)
    if (isFirstLoad || phase.value !== 'running' || document.hidden || commentSource.value === 'auto') return
    for (const omiken of newOmikens) {
      if (omiken.userId === POST_SETTINGS.botUserId) continue // おみくじBOT自身の投稿は、ユーザーではない
      stage.value?.spawn({ userId: omiken.userId, userName: omiken.userName, comment: omiken.comment })
    }
  }

  /** 購読は 1 回だけ行う (呼び直すと履歴が再配信されるため。ゲーム中かどうかは phase で切り替える) */
  const connectComments = async () => {
    commentStatus.value = 'connecting'
    try {
      commentStatus.value = (await GetOmikenComments(onComments)) ? 'ready' : 'error'
    } catch (error) {
      console.error('[WordAlchemy] コメントの購読に失敗しました:', error)
      commentStatus.value = 'error'
    }
  }

  onMounted(() => {
    void connectComments()
    void codex.load()
    void aiSettings.load()
  })
  onBeforeUnmount(stopAuto)

  return {
    phase,
    commentSource,
    commentStatus,
    potType,
    codex,
    aiSettings,
    aiUsage,
    recordError,
    stageOptions,
    setStage: (value: WordAlchemyStage) => (stage.value = value),
    start,
    abort,
    connectComments,
  }
}
