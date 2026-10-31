// src/manager/composables/useOpenLocal.ts
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useManagerStore } from '@/manager/stores/useManagerStore'
import { isOmikujiDataLike } from '@/common/migrations/index'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

/**
 * ブラウザが読み込んでいる omikujiData.js を、編集データとして開く。
 * express / プラグイン / サーバー未接続のどれでも使える。
 * 開けたら true、キャンセル・失敗なら false を返す。
 */
export const useOpenLocal = () => {
  const omikujiStore = useOmikujiStore()
  const navigationStore = useNavigationStore()
  const devStore = useManagerStore()

  const openLocal = async (): Promise<boolean> => {
    // 無いときに openLocalOmikujiData を呼ぶと、編集中のデータが初期データに置き換わるため、先に確かめる
    if (!isOmikujiDataLike(window.omikujiData)) {
      swalToast.error({ title: '読み込み失敗', text: 'omikujiData.js が見つからない、または読めませんでした。' })
      return false
    }

    if (omikujiStore.hasChanged) {
      const result = await swalModal.confirmDelete({
        title: '変更が保存されていません',
        text: '読み込むと現在の編集内容は失われます。続行しますか？',
        confirmButtonText: '読み込む',
      })
      if (!result.isConfirmed) return false
    }

    if (omikujiStore.openLocalOmikujiData() !== 'loaded') return false // 読み込み拒否(エラー表示済み)

    // 読み込み元がファイルではなくなったので、上書き保存の対象を外す
    devStore.setSaveFileName('')
    omikujiStore.resetChangeState()
    navigationStore.showTopPage()
    swalToast.success({ title: '読み込み完了', text: 'omikujiData.js を読み込みました。' })
    return true
  }

  return { openLocal }
}
