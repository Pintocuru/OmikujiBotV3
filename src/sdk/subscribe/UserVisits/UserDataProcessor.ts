// shared/sdk/subscribe/UserVisits/UserDataProcessor.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment'
import { ServiceVisitType, UserVisitSchema, UserVisitType } from '../../../types/subscribe/UserVisitSchema'
import { convertToJPY } from '../../../utils/threshold/ThresholdHelpers'
import { checkSyoken } from '../../../utils/threshold/checkers'

/**
 * ユーザーレベルのデータを処理
 */
export class UserDataProcessor {
  /**
   * ユーザーデータの処理
   */
  processUser(visits: Record<string, ServiceVisitType>, comment: Comment): void {
    const { data, meta, service: serviceKey } = comment
    if (!data || !meta) return

    const { userId, profileImage, name, badges, timestamp } = data
    const visit = visits[serviceKey]
    if (!visit) return

    // ユーザーが未登録なら初期化
    if (!visit.user[userId]) {
      visit.user[userId] = UserVisitSchema.parse({
        userId,
        service: serviceKey,
        name,
        badges,
        timestamp,
        profileImage: profileImage || '',
      })
    }

    const user = visit.user[userId]

    // 最新のコメントでユーザー情報を更新
    this.updateUserInfo(user, { name, badges, timestamp, profileImage })

    // 初見判定
    this.processSyokenCheck(user, visit, comment)

    // コメント数の取得
    this.updateCommentCount(user, meta)

    // ギフト金額の加算(メンバー加入は0円)
    const price = convertToJPY(
      'price' in data ? (data as { price?: number }).price : undefined,
      'unit' in data ? (data as { unit?: string }).unit : undefined
    )
    user.totalPrice += price
    visit.totalPrice += price
  }

  /**
   * ユーザー情報の更新
   */
  private updateUserInfo(
    user: UserVisitType,
    info: { name: string; badges: any[]; timestamp: string; profileImage?: string }
  ): void {
    user.name = info.name
    user.badges = info.badges
    user.timestamp = info.timestamp
    if (info.profileImage) user.profileImage = info.profileImage
  }

  /**
   * 初見判定の処理
   */
  private processSyokenCheck(user: UserVisitType, visit: ServiceVisitType, comment: Comment): void {
    const isSyoken = checkSyoken(comment, ['syoken'])
    if (isSyoken && !user.isSyoken) {
      // ✅ 既に初見判定済みなら加算しない
      user.isSyoken = true
      visit.syokenCount++
    }
  }

  /**
   * コメント数の更新
   */
  private updateCommentCount(user: UserVisitType, meta: Comment['meta']): void {
    if (meta && typeof meta.tc === 'number') {
      user.count = meta.tc
    } else {
      user.count += 1
    }
  }

  /**
   * ユーザーデータのマージ
   */
  mergeUserData(existing: ServiceVisitType, newVisit: ServiceVisitType): void {
    for (const [userId, newUser] of Object.entries(newVisit.user)) {
      const existingUser = existing.user[userId]

      if (!existingUser) {
        // ✅ 新規ユーザーはそのまま追加
        existing.user[userId] = newUser
      } else {
        // ✅ 既存ユーザーは情報を更新
        // meta.tc があれば絶対値、なければ増分を加算
        if (newUser.count > existingUser.count) {
          existingUser.count = newUser.count // meta.tcによる絶対値更新
        }
        existingUser.totalPrice += newUser.totalPrice

        // 最新情報で更新
        existingUser.name = newUser.name
        existingUser.badges = newUser.badges
        existingUser.timestamp = newUser.timestamp
        if (newUser.profileImage) {
          existingUser.profileImage = newUser.profileImage
        }

        // 初見フラグは一度trueになったら保持
        if (newUser.isSyoken) {
          existingUser.isSyoken = true
        }
      }
    }
  }
}
