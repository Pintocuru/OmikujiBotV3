// src/console/control/Amidakuji/composables/useJoinComments.ts
import { onBeforeUnmount, ref } from 'vue'
import { GetOmikenComments } from '@/sdk/subscribe/OmikenComment/GetOmikenComments'
import { POST_SETTINGS } from '@/sdk/PostSettings'
import type { OmikenCommentType } from '@/types/OmikenComment'

export type AmidakujiPlayer = {
  id: string // userId
  name: string
  avatarUrl?: string
  isManual?: boolean
}

/** 参加者の追加結果。'full' (上限) のときだけ、同じ回のコメントの処理を打ち切る */
export type JoinResult = 'added' | 'duplicate' | 'full'

export function useJoinComments(onPlayerJoin: (player: AmidakujiPlayer) => JoinResult) {
  const isRecruiting = ref(false)
  const keyword = ref('')
  const error = ref('')
  const isSubscribed = ref(false)
  let isConnecting = false

  const handleComments = (comments: OmikenCommentType[], _isReset: boolean, isFirstLoad: boolean) => {
    // 履歴コメントや募集停止中は無視
    if (isFirstLoad || !isRecruiting.value) return

    for (const comment of comments) {
      // BOT 自身の投稿は除く
      if (comment.userId === POST_SETTINGS.botUserId || comment.userName === POST_SETTINGS.botDefaultName) {
        continue
      }

      const targetKeyword = keyword.value.trim()
      if (targetKeyword !== '' && !comment.comment.trim().includes(targetKeyword)) {
        continue
      }

      const result = onPlayerJoin({
        id: comment.userId,
        name: comment.userName,
        avatarUrl: comment.profileImage,
        isManual: false,
      })
      // 参加済み・削除済みのユーザーは飛ばして、あとの人の処理を続ける。上限のときだけ打ち切る
      if (result === 'full') break
    }
  }

  // OneSDK の購読は 1 回だけ (解除の手段がないため)
  const ensureSubscribed = async (): Promise<boolean> => {
    if (isSubscribed.value) return true
    if (isConnecting) return false
    isConnecting = true
    try {
      const ok = await GetOmikenComments(handleComments)
      if (!ok) throw new Error('購読に失敗しました')
      isSubscribed.value = true
      return true
    } catch (e) {
      console.error('[useJoinComments] コメント購読エラー:', e)
      return false
    } finally {
      isConnecting = false
    }
  }

  const startRecruiting = async () => {
    error.value = ''
    const ok = await ensureSubscribed()
    if (!ok) {
      isRecruiting.value = false
      error.value = 'コメントの購読に失敗しました。わんコメとの接続を確認してください'
      return
    }
    isRecruiting.value = true
  }

  const stopRecruiting = () => {
    isRecruiting.value = false
  }

  onBeforeUnmount(() => {
    isRecruiting.value = false
  })

  return {
    isRecruiting,
    keyword,
    error,
    startRecruiting,
    stopRecruiting,
  }
}
