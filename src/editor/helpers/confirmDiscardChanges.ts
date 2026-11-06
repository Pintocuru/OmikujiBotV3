// src/editor/helpers/confirmDiscardChanges.ts
import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'

/**
 * 未保存の編集内容を捨てて別のデータを読み込んでよいか確認する
 * hasChanged が false のときは確認せず true を返す
 */
export async function confirmDiscardChanges(hasChanged: boolean): Promise<boolean> {
  if (!hasChanged) return true
  const result = await swalModal.confirm({
    icon: 'warning',
    title: '変更が保存されていません',
    text: '読み込むと現在の編集内容は失われます。続行しますか？',
    confirmButtonText: '読み込む',
  })
  return result.isConfirmed
}
