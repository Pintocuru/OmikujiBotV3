// src/manager/composables/useOpenLocal.ts
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useManagerStore } from '@/manager/stores/useManagerStore'
import { confirmDiscardChanges } from '@/editor/helpers/confirmDiscardChanges'
import { isOmikujiDataLike } from '@/common/migrations/index'
import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import i18n from '@/editor/i18n'

const t = (key: string) => i18n.global.t(key)

/**
 * ブラウザが読み込んでいる omikujiData.js を、編集データとして開く。
 * express / プラグイン / サーバー未接続のどれでも使える。
 * 開けたら true、キャンセル・失敗なら false を返す。
 */
export const useOpenLocal = () => {
  const omikujiStore = useOmikujiStore()
  const navigationStore = useNavigationStore()
  const managerStore = useManagerStore()

  const openLocal = async (): Promise<boolean> => {
    // 無いときに openLocalOmikujiData を呼ぶと、編集中のデータが初期データに置き換わるため、先に確かめる
    if (!isOmikujiDataLike(window.omikujiData)) {
      swalToast.error({ title: t('manager.messages.localLoadFailed'), text: t('manager.messages.localNotFound') })
      return false
    }

    if (!(await confirmDiscardChanges(omikujiStore.hasChanged))) return false

    if (omikujiStore.openLocalOmikujiData() !== 'loaded') return false // 読み込み拒否(エラー表示済み)

    // 読み込み元がファイルではなくなったので、上書き保存の対象を外す
    managerStore.setSaveFileName()
    omikujiStore.resetChangeState()
    navigationStore.showTopPage()
    swalToast.success({ title: t('manager.messages.localLoaded'), text: t('manager.messages.localLoadedText') })
    return true
  }

  return { openLocal }
}
