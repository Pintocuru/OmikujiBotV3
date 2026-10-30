// src/generator/scripts/EventProcess/OmikujiControlProcessor.ts
import { OmikujiItemControlType, OmikujiItemType } from '@/types/OmikujiData/'
import { OmikenCommentType } from '@/types/OmikenComment'
import { OmikujiProcessor } from '@/generator/scripts/EventProcess/OmikujiProcessor'

/**
 * postFlow 以外の kind (control: return / continue) を処理するクラス
 * @param omiken variable 内の <<user>> 等のプレースホルダー解決に使用
 */
export class OmikujiControlProcessor {
  /**
   * @returns postFlow なら null / return なら true / continue なら false
   */
  process(item: OmikujiItemType, omiken?: OmikenCommentType): boolean | null {
    switch (item.kind) {
      // 通常ステップ (BOTメッセージ送信) は対象外
      case 'postFlow':
        return null

      // 処理の流れを制御する (return / continue)
      case 'control':
        return this.processControl(item, omiken)
    }
  }

  private processControl(item: OmikujiItemControlType, omiken?: OmikenCommentType): boolean {
    // 評価ブロック {{ }} を評価
    if (item.variable.trim()) new OmikujiProcessor().evaluateControlVariable(item.variable, omiken)

    switch (item.command) {
      // 処理を終了する
      case 'return':
        return true

      // 次のイベントへ進む
      case 'continue':
        return false
    }
  }
}
