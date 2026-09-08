// src/sdk/subscribe/GetUserComments.disabled.ts
// !使用しない
import { ref } from 'vue'
import { GetComments } from './GetComments'
import { ConfigUserType } from '../../types/subscribe/ConfigUserSchema'
import { checkAllConditions } from '../../utils/threshold/ThresholdChecker'
import { Comment } from '@onecomme.com/onesdk/types/Comment'

export function GetUserComments(config: ConfigUserType, isFirstComment: boolean = false) {
  const processor = new UserCommentsProcess(config)
  const userComments = ref<Comment[]>([])

  const fetchComments = async (callback?: (comments: Comment[]) => void): Promise<boolean> => {
    const call = (comments: Comment[]) => {
      // comments が空なら、リセット処理
      if (comments.length === 0) {
        userComments.value = []
        if (callback) callback([])
        return
      }
      // コメントをフィルタリング
      const processed = processor.process(comments, userComments.value)
      if (processed !== null) {
        userComments.value = processed
        // 外部から処理を追加するcallback
        if (callback) callback(processed)
      }
    }

    // @ts-ignore 使用しないため
    return await GetComments(call, config.isDiffMode)
  }

  return {
    userComments, // フィルタリングされたコメント
    fetchComments, // 初期化
  }
}

class UserCommentsProcess {
  constructor(private readonly config: ConfigUserType) {}

  // ユーザーのコメントをconfig に沿ってフィルタリング
  process(comments: Comment[], existingComments: Comment[] = []): Comment[] | null {
    const validComments = comments.filter((comment) => checkAllConditions(comment, this.config.threshold))

    if (validComments.length === 0) return null

    // DIFF_MODEに基づいて結果を返す
    return this.config.isDiffMode
      ? validComments // 上書きモードでは新しいコメントのみ返す
      : this.mergeComments(existingComments, validComments) // 追加モードでは既存のものと結合
  }

  // 新しいコメントを既存のコメントに追加（重複排除）
  private mergeComments(existingComments: Comment[], newComments: Comment[]): Comment[] {
    const existingIds = new Set(existingComments.map((c) => c.data.id))
    return [...existingComments, ...newComments.filter((c) => !existingIds.has(c.data.id))]
  }
}
