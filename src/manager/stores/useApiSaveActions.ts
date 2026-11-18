// src/manager/stores/useApiSaveActions.ts
import { AsyncActionHandler } from './useApiCore'
import { DataManagerType } from '@/manager/types'
import { configApi } from '@/manager/services/configApi'
import { generatorApi } from '@/manager/services/generatorApi'
import { omikujiApi } from '@/manager/services/omikujiApi'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { dialog } from '@/common/Dialog/dialogState'
import { notify } from '@/common/Notice/notify'
import { confirmSaveWithIssues } from '@/editor/helpers/confirmSaveWithIssues'
import i18n from '@/i18n/editorI18n'

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
      notify.success(t('manager.messages.fileSaved', { name: displayName }))

      omikujiStore.resetChangeState()
      state.isServerConnected.value = true

      return true
    }, 'isSaving')
  }

  // ジェネレーターに保存
  const saveToGenerator = async () => {
    const generatorId = window.omikujiData?.meta.id
    if (!generatorId) {
      notify.error(t('manager.messages.cannotSave'), { text: t('manager.messages.missingGeneratorId') })
      return null
    }

    const confirmed = await dialog.confirm({
      tone: 'info',
      title: t('manager.messages.saveForGenerator'),
      text: t('manager.messages.saveForGeneratorConfirm'),
      note: t('manager.messages.overwriteGenerator', { id: generatorId }),
      confirmLabel: '保存',
    })
    if (!confirmed) return
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

      notify.success(t('manager.messages.savedForGenerator'))
      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // 上書き保存（確認ダイアログ）
  const overwriteConfig = async (fileName: string) => {
    const displayName = fileName.replace('.json', '')

    const confirmed = await dialog.confirm({
      tone: 'warning',
      title: t('manager.messages.overwriteConfirm'),
      text: t('manager.messages.overwriteFile', { name: displayName }),
      confirmLabel: t('manager.messages.overwrite'),
    })

    if (!confirmed) return
    if (!(await confirmSaveWithIssues())) return

    const omikujiStore = useOmikujiStore()

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data)
      await configApi.saveConfig(fileName, configData)
      await fetchFileList()

      // 成功トースト
      notify.success(t('manager.messages.fileOverwritten', { name: displayName }))

      omikujiStore.resetChangeState()
      state.isServerConnected.value = true
      return null
    }, 'isSaving')
  }

  // server/omikujiData.js に保存（確認ダイアログ）
  const overwriteOmikujiData = async () => {
    const confirmed = await dialog.confirm({
      tone: 'warning',
      title: '上書き確認',
      text: t('manager.messages.overwriteOmikujiData'),
      confirmLabel: '上書き',
    })

    if (!confirmed) return
    if (!(await confirmSaveWithIssues())) return

    const omikujiStore = useOmikujiStore()

    return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data)
      await omikujiApi.saveOmikujiData(configData)
      await fetchFileList()

      // 成功トースト
      notify.success(`${t('manager.messages.omikujiOverwritten')}`)
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
