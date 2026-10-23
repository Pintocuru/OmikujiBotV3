// server/core/utils/userList.ts
// ユーザーリスト (load-users) を作る純粋関数
import type { UserListItemType, UserStatsControlType, UserStatsRecord } from '@/types/api'

/**
 * コメント由来のユーザー + 手動ユーザー に、操作結果 (score / team / order / tags / badges) を合わせる
 * - 並びは、最後のコメントが新しい順 (手動ユーザーは最後)。LiveConsole 側で並べ替えて使う
 * - 操作結果がないユーザーは、score 0 / team なし。コメント由来の score は使わない (サーバーの操作結果が正)
 * - 削除済み (isRemoved) の手動ユーザーは含めない
 */
export function buildUserList(
  commentUsers: UserStatsRecord[],
  controls: ReadonlyMap<string, UserStatsControlType>
): UserListItemType[] {
  const fromComments: UserListItemType[] = commentUsers.map((user) => {
    const control = controls.get(user.userId)
    return {
      userId: user.userId,
      userName: user.userName,
      profileImage: user.profileImage ?? '',
      isManual: false,
      commentCount: user.tc,
      lastCommentAt: user.lastVisit,
      score: control?.score ?? 0,
      team: control?.team ?? null,
      order: control?.order || null, // 0 は席順なし
      tags: control?.tags ?? [],
      badges: control?.badges ?? [],
    }
  })
  fromComments.sort((a, b) => b.lastCommentAt - a.lastCommentAt)

  const commented = new Set(commentUsers.map((u) => u.userId))
  const manual: UserListItemType[] = []
  for (const [userId, control] of controls) {
    if (!control.isManual || control.isRemoved || commented.has(userId)) continue
    manual.push({
      userId,
      userName: control.userName ?? userId,
      profileImage: '',
      isManual: true,
      commentCount: 0,
      lastCommentAt: 0,
      score: control.score ?? 0,
      team: control.team ?? null,
      order: control.order || null, // 0 は席順なし
      tags: control.tags ?? [],
      badges: control.badges ?? [],
    })
  }
  manual.sort((a, b) => a.userName.localeCompare(b.userName, 'ja'))

  return [...fromComments, ...manual]
}
