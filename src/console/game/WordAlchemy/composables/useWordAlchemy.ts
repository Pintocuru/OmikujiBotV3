// src/console/game/WordAlchemy/composables/useWordAlchemy.ts
// 言葉の錬金術の進行 (idle ↔ running) と、コメントの受け取り。盤面の進行そのものは render/WordAlchemyStage.ts が持つ
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { createOmikenHistory } from '@/common/OmikenHistory'
import { createMockUserPool, pickTestComment, type MockUserPool } from '@/common/MockUser'
import { POST_SETTINGS } from '@/sdk/PostSettings'
import { GetOmikenComments } from '@/sdk/subscribe/OmikenComment/GetOmikenComments'
import type { OmikenCommentType } from '@/types/OmikenComment'
import { runAlchemy } from '../ai/alchemy'
import { DEFAULT_POT, type PotKey } from '../maps/WordAlchemyPotMap'
import type { StageOptions, WordAlchemyStage } from '../render/WordAlchemyStage'
import { acceptsWord } from '../scripts/potRules'
import { AUTO_COMMENT_INTERVAL_SECONDS, AUTO_COMMENT_USER_COUNT } from '../scripts/wordAlchemyConstants'

export type WordAlchemyPhase = 'idle' | 'running'
export type CommentSource = 'live' | 'auto'
export type CommentStatus = 'connecting' | 'ready' | 'error'

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

  /**
   * 盤面に渡す設定。完成品は runAlchemy で決める。AI の通信 (サーバーの中継ハンドラ) はまだないので、client は null (Mock だけ)
   * TODO(AI): 中継ハンドラと API キーの設定ができたら、AlchemyClient をここで渡す
   */
  const stageOptions: StageOptions = {
    brew: async (ingredients) => (await runAlchemy(ingredients, potType.value, null)).result.n,
    accepts: (text) => acceptsWord(potType.value, text),
  }

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

  onMounted(() => void connectComments())
  onBeforeUnmount(stopAuto)

  return {
    phase,
    commentSource,
    commentStatus,
    potType,
    stageOptions,
    setStage: (value: WordAlchemyStage) => (stage.value = value),
    start,
    abort,
    connectComments,
  }
}
