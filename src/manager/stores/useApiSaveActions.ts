// src/manager/stores/useApiSaveActions.ts
import { AsyncActionHandler } from './useApiCore'
import { DataManagerType } from '@/manager/types'
import { configApi } from '@/manager/services/configApi'
import { generatorApi } from '@/manager/services/generatorApi'
import { omikujiApi } from '@/manager/services/omikujiApi'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { confirmSaveWithIssues } from '@/editor/helpers/confirmSaveWithIssues'
import { escapeHtml } from '@/common/escapeHtml'
import i18n from '@/editor/i18n'

const t = (key: string, named?: Record<string, unknown>) => (named ? i18n.global.t(key, named) : i18n.global.t(key))

export function useSaveActions(state: DataManagerType, handleAsyncAction: AsyncActionHandler) {
  // ファイル一覧取得
  const fetchFileList = async () => {
    const files = await configApi.getFileList()
    state.availableFiles.value = files
    state.isServerConnected.value = true
    return files
  }

  // 名前指定で保存
  const saveConfig = async (fileName: string): Promise<boolean | null> => {
    const omikujiStore = useOmikujiStore()
    const trimmedFileName = fileName.trim()
    if (!trimmedFileName) return false
    if (!(await confirmSaveWithIssues())) return false

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data)
      const res = await configApi.saveConfig(trimmedFileName, configData)
      if (!res) throw new Error(t('manager.messages.saveFailed'))

      await fetchFileList()
      const displayName = trimmedFileName.split('/').pop()!.replace('.json', '')
      swalToast.success({ title: t('manager.messages.fileSaved', { name: displayName }) })

      omikujiStore.resetChangeState()
      state.isServerConnected.value = true

      return true
    }, 'isSaving')
  }

  // ジェネレーターに保存
  const saveToGenerator = async () => {
    const generatorId = window.omikujiData?.meta.id
    if (!generatorId) {
      swalToast.error({
        title: t('manager.messages.cannotSave'),
        text: t('manager.messages.missingGeneratorId'),
      })
      return null
    }

    const result = await swalModal.confirm({
      icon: 'info',
      title: t('manager.messages.saveForGenerator'),
      html: `
    <p>${t('manager.messages.saveForGeneratorConfirm')}</p>
    <p style="font-size: 0.8em; color: #666; margin-top: 8px;">
      ${t('manager.messages.overwriteGenerator', { id: escapeHtml(generatorId) })}
    </p>
  `,
      confirmButtonText: '保存',
    })
    if (!result.isConfirmed) return
    if (!(await confirmSaveWithIssues())) return
    const omikujiStore = useOmikujiStore()

    // store の data は触らない。保存用にだけコピーを作る
    const dataForSave = {
      ...omikujiStore.data,
      meta: {
        ...omikujiStore.data.meta,
        id: generatorId,
      },
    }

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(dataForSave)
      await generatorApi.saveGeneratorConfig(configData)
      await fetchFileList()
      omikujiStore.resetChangeState()

      swalToast.success({ title: t('manager.messages.savedForGenerator') })
      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // 上書き保存（確認ダイアログ）
  const overwriteConfig = async (fileName: string) => {
    const displayName = fileName.replace('.json', '')

    const result = await swalModal.confirm({
      icon: 'warning',
      title: t('manager.messages.overwriteConfirm'),
      text: t('manager.messages.overwriteFile', { name: displayName }),
      confirmButtonText: t('manager.messages.overwrite'),
    })

    if (!result.isConfirmed) return
    if (!(await confirmSaveWithIssues())) return

    const omikujiStore = useOmikujiStore()

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data)
      await configApi.saveConfig(fileName, configData)
      await fetchFileList()

      // 成功トースト
      swalToast.success({ title: t('manager.messages.fileOverwritten', { name: displayName }) })

      omikujiStore.resetChangeState()
      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // server/omikujiData.js に保存（確認ダイアログ）
  const overwriteOmikujiData = async () => {
    const result = await swalModal.confirm({
      icon: 'warning',
      title: '上書き確認',
      text: t('manager.messages.overwriteOmikujiData'),
      confirmButtonText: '上書き',
    })

    if (!result.isConfirmed) return
    if (!(await confirmSaveWithIssues())) return

    const omikujiStore = useOmikujiStore()

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data)
      await omikujiApi.saveOmikujiData(configData)
      await fetchFileList()

      // 成功トースト
      swalToast.success({ title: `${t('manager.messages.omikujiOverwritten')}` })
      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  return {
    saveConfig,
    saveToGenerator,
    overwriteConfig,
    overwriteOmikujiData,
  }
}
