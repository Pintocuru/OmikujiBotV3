// src/manager/services/userStatsApi.ts
import { API_ACTION } from '@server/api/actions'
import {
  AddManualUserResponseSchema,
  AddManualUserResponseType,
  UserListResponseSchema,
  UserListResponseType,
  UserStatsLoadResponseSchema,
  UserStatsLoadResponseType,
  UserStatsUpdateResponseSchema,
  UserStatsUpdateResponseType,
  UserStatsUpdateType,
} from '@/types/api'
import { BaseApiClient } from './baseApiClient'

/**
 * ブラウザから OBS の表示を変更するための、ユーザー統計の操作 API
 * - 操作する側: updateUserStats / resetUserStats
 * - 反映する側 (Generator): loadUserStats を、前回の revision 付きでポーリングする
 */
class UserStatsApiService extends BaseApiClient {
  /**
   * 操作結果を取得 (since 以降に変更されたものだけ。isFull のときは全件)
   */
  async loadUserStats(since?: number): Promise<UserStatsLoadResponseType> {
    const response = await this.get(API_ACTION.loadUserStats.action, { since })
    this.validateResponse(response, 'ユーザー統計の取得に失敗しました')

    return UserStatsLoadResponseSchema.parse(response.data)
  }

  /**
   * ユーザーリストを取得 (コメント由来 + 手動追加 + 操作結果)
   */
  async loadUsers(): Promise<UserListResponseType> {
    const response = await this.get(API_ACTION.loadUsers.action)
    this.validateResponse(response, 'ユーザーリストの取得に失敗しました')

    return UserListResponseSchema.parse(response.data)
  }

  /**
   * コメントしないユーザー (ROM 勢など) を手動で追加
   */
  async addManualUser(userName: string): Promise<AddManualUserResponseType> {
    const response = await this.post(API_ACTION.addManualUser.action, { userName })
    this.validateResponse(response, 'ユーザーの追加に失敗しました')

    return AddManualUserResponseSchema.parse(response.data)
  }

  /**
   * 手動で追加したユーザーを削除
   */
  async removeManualUser(userId: string): Promise<void> {
    const response = await this.post(API_ACTION.removeManualUser.action, { userId })
    this.validateResponse(response, 'ユーザーの削除に失敗しました')
  }

  /**
   * コメント由来のユーザーリストを空にする (手動の操作結果と手動ユーザーは残る)
   */
  async resetUsers(): Promise<void> {
    const response = await this.post(API_ACTION.resetUsers.action, {})
    this.validateResponse(response, 'ユーザーリストのリセットに失敗しました')
  }

  /**
   * ユーザー統計を更新 (1回で最大200ユーザー)
   */
  async updateUserStats(updates: UserStatsUpdateType[]): Promise<UserStatsUpdateResponseType> {
    const response = await this.post(API_ACTION.updateUserStats.action, { updates })
    this.validateResponse(response, 'ユーザー統計の更新に失敗しました')

    return UserStatsUpdateResponseSchema.parse(response.data)
  }

  /**
   * 操作結果を全件リセット
   */
  async resetUserStats(): Promise<void> {
    const response = await this.post(API_ACTION.resetUserStats.action, {})
    this.validateResponse(response, 'ユーザー統計のリセットに失敗しました')
  }
}

export const userStatsApi = new UserStatsApiService()
