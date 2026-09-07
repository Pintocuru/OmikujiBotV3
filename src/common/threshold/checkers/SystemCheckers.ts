// shared/utils/threshold/checkers/SystemCheckers.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment'
import { EnabledServiceType } from '../../../types/Threshold'

/**
 * サービス条件チェック
 */
export function checkServiceCondition(comment: Comment, services: EnabledServiceType[]): boolean {
  // 空配列ならすべて許可
  if (services.length === 0) return true

  // コメントテスター専用処理
  if (comment.id === 'COMMENT_TESTER') {
    return services.includes('external')
  }
  // プラットフォーム限定モードが含まれていれば external/system を除外
  if (services.includes('platforms')) {
    return !['external', 'system'].includes(comment.service)
  }

  // 通常のサービス一致
  return services.includes(comment.service as EnabledServiceType)
}
