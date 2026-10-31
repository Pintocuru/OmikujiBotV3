// src/manager/composables/useOpenPackage.ts
import { storeToRefs } from 'pinia'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useManagerStore } from '@/manager/stores/useManagerStore'
import { generatorApi } from '@/manager/services/generatorApi'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { FILE_NAME } from '@server/core/constants'

/**
 * packages に保存された設定(ジェネレーター用)を、編集データとして開く。
 * id を省略すると、omikujiData.js の meta.id のパッケージを開く。
 * 開けたら true、キャンセル・失敗なら false を返す。
 */
export const useOpenPackage = () => {
  const omikujiStore = useOmikujiStore()
  const { hasChanged } = storeToRefs(omikujiStore)
  const navigationStore = useNavigationStore()
  const devStore = useManagerStore()

  const openPackage = async (id: string | undefined = window.omikujiData?.meta.id): Promise<boolean> => {
    try {
      // 変更があるなら確認ダイアログ
      if (hasChanged.value) {
        const result = await swalModal.confirmDelete({
          title: '変更が保存されていません',
          text: '読み込むと現在の編集内容は失われます。続行しますか？',
          confirmButtonText: '読み込む',
        })
        if (!result.isConfirmed) return false
      }

      const data = await generatorApi.loadGeneratorConfig(id)
      if (!data) {
        const fileName = id ? `packages/${id}.json` : FILE_NAME.generator
        swalToast.warning({
          title: 'ジェネレーター設定が見つかりません',
          text: `${fileName} が存在しませんでした`,
        })
        return false
      }

      if (!omikujiStore.loadData(data)) return false // 読み込み拒否(エラー表示済み)
      // パッケージはプリセットのファイルではないので、上書き保存の対象を外す
      devStore.setSaveFileName()
      navigationStore.selectCategory(data.settings?.editor?.initialCategory ?? 'comments')
      omikujiStore.resetChangeState()

      swalToast.success({ title: 'ジェネレーター設定を読み込みました' })
      return true
    } catch (error) {
      swalToast.error({ title: '読み込みに失敗しました', text: String(error) })
      return false
    }
  }

  return { openPackage }
}
