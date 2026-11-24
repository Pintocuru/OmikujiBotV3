// src/engine/ContentPlaceholder/context.ts
/**
 * プレースホルダーのコンテキスト値を管理
 * ユーザー名、日付など、動的に設定される値を保持
 */
export class PlaceholderContext extends Map<string, string | number> {
  /**
   * コンテキスト値を更新
   */
  updateValues(values: Record<string, string | number>): void {
    Object.entries(values).forEach(([key, value]) => {
      this.set(key, value)
    })
  }
}
