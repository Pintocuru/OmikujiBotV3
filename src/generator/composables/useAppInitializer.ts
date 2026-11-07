// src/generator/composables/useAppInitializer.ts
import { EventCommentProcessor } from '@/generator/scripts/EventProcess/CommentProcessor'
import { useAppStore } from '@/generator/stores/useAppStore'
import { generatorApi } from '@/manager/services/generatorApi'
import { postSystemMessage } from '@/sdk/post/PostOneComme'
import { POST_SETTINGS } from '@/sdk/PostSettings'
import { GetOmikenComments } from '@/sdk/subscribe/OmikenComment/GetOmikenComments'
import { OmikenCommentType } from '@/types/OmikenComment'
import { startUserStatsPolling } from '@/generator/stores/UserStats/startUserStatsPolling'
import { formatParseIssuesSummary } from '@/types/core/ParseIssues'
import { describeError, showErrorNotice } from '../scripts/Notice/showNotice'
import { COMMENT_RESPONSE_WINDOW_MS } from '@/generator/GeneratorConstants'

export function useAppInitializer() {
  const appStore = useAppStore()
  let stopPolling: (() => void) | null = null

  const initialize = async () => {
    const { setStatus, setError } = appStore
    const commentProcessor = new EventCommentProcessor()
    setStatus('initializing')

    try {
      const isInit = await GetOmikenComments((omikens, isReset, isFirstLoad) => {
        try {
          // リセット検出
          if (isReset) {
            resetAppState()
            return
          }
          // 新規コメントを記録
          const filterOmikens = filterNewOmikens(omikens)
          const newOmikens = appStore.addOmikens(filterOmikens)

          // 新規コメントからユーザーデータを記録 (遅れて届いたコメントも、ギフトなどを取りこぼさないよう全件)
          recordStats(newOmikens)
          if (isFirstLoad) return

          // コメントイベント: 投稿から一定時間以内のものだけに返信する
          const recentOmikens = newOmikens.filter((o) => Date.now() - o.timestamp < COMMENT_RESPONSE_WINDOW_MS)
          commentProcessor.respondToComments(recentOmikens).catch((error) => {
            console.error('[useAppInitializer] コメントイベント処理エラー:', error)
            showErrorNotice(`コメント処理エラー: ${describeError(error)}`)
          })
        } catch (error) {
          console.error('[useAppInitializer] コメント処理エラー:', error)
          showErrorNotice(`コメント処理エラー: ${describeError(error)}`)
        }
      })

      // GetOmikenComments が失敗した場合、エラーを表示
      if (!isInit) {
        setStatus('error')
      } else {
        // エディタープラグインからデータを読み込む
        await syncWithServer()
        // omikujiData.js もサーバーもデータなし: 画面(App.vue)に表示し、わんコメにも伝える
        if (!appStore.hasData) {
          postSystemMessage('おみくじデータを読み込めませんでした(omikujiData.js もサーバーのデータもありません)', {
            username: 'error',
            speech: false,
            throttle: true,
          })
        }
        // 不正な要素を除外して読み込んだ場合: 動作は続け、わんコメに1回だけ知らせる (詳細はコンソール)
        if (appStore.dataIssues.length > 0) {
          postSystemMessage(
            `おみくじデータの不正な要素を除外して読み込みました: ${formatParseIssuesSummary(appStore.dataIssues)}`,
            { username: 'warn', speech: false, throttle: true }
          )
        }
        // LiveConsole で操作した score / team / order などを取り込む (サーバーがなければ何もしない)
        stopPolling?.()
        stopPolling = startUserStatsPolling(appStore.userStatsSync)
        setStatus('ready')
      }
    } catch (error) {
      console.error('❌ 初期化エラー:', error)
      setError(error instanceof Error ? error.message : String(error))
      postSystemMessage(`❌ 初期化エラー: ${error}`, { username: 'error' })
    }
  }

  // アンマウント時にポーリングを止める
  const dispose = () => {
    stopPolling?.()
    stopPolling = null
  }

  return { initialize, dispose }
}

// リセット検出
function resetAppState() {
  const appStore = useAppStore()
  appStore.clearOmikens()
  appStore.resetStreamData()
}

// コメントをフィルター
function filterNewOmikens(omikens: OmikenCommentType[]): OmikenCommentType[] {
  const appStore = useAppStore()
  const currentMeta = appStore.serviceMetaStore.getCurrent()
  return omikens.filter((omiken) => {
    if (ignoreOmikujiBot(omiken.userId)) return false
    if (ignoreExternalOnLive(omiken.meta.isExternal, currentMeta?.isLive)) return false
    return true
  })
}

// 新規コメントからユーザーデータを記録
function recordStats(omikens: OmikenCommentType[]) {
  const appStore = useAppStore()
  for (const omiken of omikens) {
    // 1 件の失敗で、残りのコメントの記録を止めない
    try {
      appStore.streamStats.record(omiken)
      appStore.userStats.recordComment(omiken)
    } catch (error) {
      console.error('[useAppInitializer] 統計の記録エラー:', error)
    }
  }
}

// エディタープラグインからデータを読み込む
async function syncWithServer() {
  const appStore = useAppStore()
  try {
    const serverData = await generatorApi.loadGeneratorConfig()
    if (!serverData) return // プラグインなし = null → ここで静かに終了

    appStore.loadData(serverData)
    // 配信画面には出さない(視聴者に見えるため)
    console.info(`エディタープラグイン から ${appStore.data.meta.name} のデータを読み込みました`)
  } catch (err) {
    // ここに来る時点で「本当に予期せぬエラー」のみ
    const msg = `エディタープラグインからデータ読み込みに失敗しました: ${err}`
    console.error(msg)
    if (!appStore.hasData) appStore.dataErrorDetail = String(err)
    // 起動時に1回だけ。omikujiData.js のデータで動き続けるときも、サーバーのデータを使えていないことを伝える
    postSystemMessage(msg, { username: 'error', speech: false, throttle: true })
  }
}

// OmikujiBotのコメントなら必ず弾く
const ignoreOmikujiBot = (userId: string): boolean => {
  return userId === POST_SETTINGS.botUserId
}

// 配信中は外部コメントをシャットアウトする
const ignoreExternalOnLive = (isExternalComment: boolean, isLive?: boolean): boolean => {
  if (isLive === undefined) return false // undefinedなら配信中ではないと思う
  return isExternalComment && isLive
}
