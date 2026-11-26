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

export function useJoinComments(onPlayerJoin: (player: AmidakujiPlayer) => boolean) {
  const isRecruiting = ref(false)
  const keyword = ref('')
  const isSubscribed = ref(false)

  const handleComments = (comments: OmikenCommentType[], _isReset: boolean, isFirstLoad: boolean) => {
    // 履歴コメントや募集停止中は無視
    if (isFirstLoad || !isRecruiting.value) return

    for (const comment of comments) {
      // BOT 自身の投稿は除く
      if (comment.userId === POST_SETTINGS.botUserId || comment.userName === POST_SETTINGS.botDefaultName) {
        continue
      }

      const text = comment.comment.trim()
      const targetKeyword = keyword.value.trim()

      if (targetKeyword !== '' && !text.includes(targetKeyword)) {
        continue
      }

      const player: AmidakujiPlayer = {
        id: comment.userId,
        name: comment.userName,
        avatarUrl: comment.profileImage,
        isManual: false,
      }

      const added = onPlayerJoin(player)
      if (!added) {
        // PLAYER_MAX に達したなどの理由で追加できなかった場合はループ終了
        break
      }
    }
  }

  const startListening = async () => {
    if (isSubscribed.value) return
    try {
      await GetOmikenComments(handleComments)
      isSubscribed.value = true
    } catch (e) {
      console.error('[useJoinComments] コメント購読エラー:', e)
    }
  }

  const startRecruiting = async () => {
    isRecruiting.value = true
    await startListening()
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
    startRecruiting,
    stopRecruiting,
  }
}
