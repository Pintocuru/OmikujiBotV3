// src/generator/stores/UserStats/UserStatsControlSync.ts
// サーバーの操作結果 (LiveConsole で操作した score / team / order / tags / badges) を、UserStatsManager に取り込む。
//
// - 操作結果はサーバーが正。取り込むときは、これらのフィールドを丸ごと上書きする。
// - まだコメントしていないユーザーの操作結果は、ここで持っておき、そのユーザーが初めてコメントしたときに反映する。
// - 手動で追加したユーザー (isManual) は、コメントしなくても、操作結果から記録を作る。
import { UserStatsRecordSchema } from '@/types/api'
import type { UserStatsControlType, UserStatsLoadResponseType, UserStatsRecord } from '@/types/api'
import type { UserStatsManager } from './UserStatsManager'

type ControlFields = Pick<UserStatsRecord, 'score' | 'team' | 'order' | 'tags' | 'badges'>

/** 操作結果がないとき (リセット後など) の値 */
const DEFAULT_FIELDS: ControlFields = { score: 0, team: null, order: undefined, tags: [], badges: [] }

const toFields = (control: UserStatsControlType | undefined): ControlFields =>
  control
    ? {
        score: control.score ?? 0,
        team: control.team ?? null,
        order: control.order || undefined, // 0 は席順なし
        tags: control.tags ?? [],
        badges: control.badges ?? [],
      }
    : DEFAULT_FIELDS

export class UserStatsControlSync {
  private readonly controls = new Map<string, UserStatsControlType>()
  private lastRevision: number | undefined

  constructor(private readonly manager: UserStatsManager) {
    // コメントで記録が作られた (更新された) ときに、持っている操作結果を反映する
    manager.onUpdate((record) => this.applyTo(record.userId))
  }

  /** 次に load-user-stats へ渡す since (まだ取り込んでいなければ undefined = 全件) */
  get revision(): number | undefined {
    return this.lastRevision
  }

  /**
   * load-user-stats の結果を取り込む
   * isFull のときは、保持している操作結果をこの内容で置き換える (含まれないユーザーは、操作結果なしに戻す)
   */
  apply(response: UserStatsLoadResponseType): void {
    const changed = new Set(Object.keys(response.users))

    if (response.isFull) {
      for (const userId of this.controls.keys()) changed.add(userId)
      this.controls.clear()
    }
    for (const [userId, control] of Object.entries(response.users)) this.controls.set(userId, control)

    for (const userId of changed) this.applyTo(userId)
    this.lastRevision = response.revision
  }

  /**
   * 手動ユーザーがいなければ記録を作り直す
   * (配信開始やコメントのクリアで UserStatsManager がリセットされると、手動ユーザーも消えるため)
   */
  restoreManualUsers(): void {
    for (const [userId, control] of this.controls) {
      if (control.isManual && !control.isRemoved && !this.manager.get(userId)) this.applyTo(userId)
    }
  }

  /** 1ユーザーぶんの操作結果を、UserStatsManager に反映する */
  private applyTo(userId: string): void {
    const control = this.controls.get(userId)

    if (control?.isManual) {
      if (control.isRemoved) {
        this.manager.remove(userId)
        return
      }
      if (!this.manager.get(userId)) {
        // コメントしていないユーザー: 名前だけの記録を作る
        this.manager.upsert(UserStatsRecordSchema.parse({ userId, userName: control.userName ?? userId, lastVisit: 0 }))
      }
    }

    const record = this.manager.get(userId)
    if (!record) return // まだコメントしていない。初めてコメントしたときに、onUpdate から反映する

    const next = toFields(control)
    if (isSame(record, next)) return // onUpdate → update の繰り返しを防ぐ
    this.manager.update(userId, next)
  }
}

const isSame = (record: UserStatsRecord, next: ControlFields): boolean =>
  record.score === next.score &&
  record.team === next.team &&
  record.order === next.order &&
  JSON.stringify(record.tags) === JSON.stringify(next.tags) &&
  JSON.stringify(record.badges) === JSON.stringify(next.badges)
