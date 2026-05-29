// shared/sdk/subscribe/GetUserVisits.ts
// !使用しない
import { ConfigUserSchema, ConfigUserType } from '../../types/subscribe/ConfigUserSchema'
import { ServiceVisitType, UserVisitType } from '../../types/subscribe/UserVisitSchema'
import { GetUserComments } from './GetUserComments.disabled'
import { UserVisitsProcessor } from './UserVisits/UserVisitsProcessor'
import { Comment } from '@onecomme.com/onesdk/types/Comment'

/**
 * ユーザー訪問データを取得・管理するメイン関数
 */
export function GetUserVisits(config: ConfigUserType = ConfigUserSchema.parse({})) {
  const processor = new UserVisitsProcessor()
  const { fetchComments: userFetch } = GetUserComments(config, true)

  const fetchComments = async (
    callback: (userVisits: Record<string, ServiceVisitType>, comments: Comment[]) => void
  ): Promise<boolean> => {
    const result = await userFetch((comments) => {
      // 空が返った場合はリセットなので、リセット処理
      if (comments.length === 0) {
        processor.reset()
        callback({}, [])
        return
      }
      const userVisits = processor.mergeComments(comments)
      callback(userVisits, comments)
    })

    // わんコメ接続時のみポーリングを開始
    if (result) processor.startServicePolling()
    return result
  }

  /**
   * UserVisitType に追加データを入れるユーティリティ関数
   */
  const extendUserVisit = <T extends UserVisitType>(user: T, extra: Partial<Record<string, any>>): T & typeof extra =>
    Object.assign({}, user, extra)

  return {
    getUserVisits: () => processor.getUserVisits(),
    fetchComments,
    extendUserVisit,
  }
}
