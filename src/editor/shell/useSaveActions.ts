// src/editor/shell/useSaveActions.ts
import { computed, Component } from 'vue'
import { storeToRefs } from 'pinia'
import { FileDown, FilePlus, HardDriveUpload } from 'lucide-vue-next'
import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
import { isDev } from '@/types/env'
import i18n from '@/editor/i18n'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useManagerStore } from '@/manager/stores/useManagerStore'
import { useConfigExport } from '@/editor/helpers/presetsExport/useConfigExport'
import { ensureJsonExtension, generateDateFileName } from '@/manager/services/apiServiceUtils'

type SaveAction = {
  id: string
  label: string
  run: () => void | Promise<unknown>
}

type PrimaryAction = SaveAction & {
  class: string
  tip: string
  disabled: boolean
  /** サーバーが使えず、設定の出力しか選べないときに大きく出す */
  large: boolean
}

type MenuAction = SaveAction & { icon: Component }

const t = (key: string, named?: Record<string, unknown>) => (named ? i18n.global.t(key, named) : i18n.global.t(key))

/**
 * 上部バーの保存ボタンの出し分け。優先順: ジェネレーター用に保存 > プリセットとして保存 > 設定を出力(js) > omikujiData.js に保存
 *
 * - サーバー未接続: 「設定を出力(js)」だけ(大きく表示)
 * - 製品版(プラグインサーバー): 主=ジェネレーター用に保存 / メニュー=プリセットとして保存・設定を出力(js)
 * - 開発版(Express)で読み込み中ファイルあり: 主=そのファイルの上書き保存 / メニュー=プリセットとして保存・設定を出力(js)・omikujiData.js に保存
 * - 開発版(Express)でファイル未読込: 主=プリセットとして保存 / メニュー=設定を出力(js)・omikujiData.js に保存
 */
export const useSaveActions = () => {
  const omikujiStore = useOmikujiStore()
  const { hasChanged } = storeToRefs(omikujiStore)
  const devStore = useManagerStore()
  const { isServerConnected, isExpressMode, saveFileName, isSaving } = storeToRefs(devStore)
  const { isExporting, exportFile } = useConfigExport()

  const isBusy = computed(() => isSaving.value || isExporting.value)

  const exportAction = computed<SaveAction>(() => ({
    id: 'export',
    label: t('navigation.exportConfig'),
    run: () => exportFile('config'),
  }))

  // プリセット(presets 配下のファイル)として名前を付けて保存し、そのまま開く
  const saveAsPreset = async () => {
    const taken = new Set(devStore.availableFiles.map((file) => file.name.toLowerCase()))
    const result = await swalModal.prompt({
      icon: 'question',
      title: t('shell.save.preset'),
      text: t('shell.save.presetPrompt'),
      inputValue: generateDateFileName(),
      confirmButtonText: t('shell.save.presetConfirm'),
      inputValidator: (value: string) => {
        const name = value.trim()
        if (!name) return t('shell.save.presetNameEmpty')
        if (/[\\/:*?"<>|]/.test(name)) return t('shell.save.presetNameInvalid')
        if (taken.has(ensureJsonExtension(name).toLowerCase())) return t('shell.save.presetNameTaken')
        return null
      },
    })
    if (!result.isConfirmed) return

    const fileName = ensureJsonExtension(String(result.value).trim())
    if (!(await devStore.saveConfig(fileName))) return
    await devStore.applyConfigFile(fileName)
  }

  const primary = computed<PrimaryAction>(() => {
    // サーバーが使えないときは、設定の出力だけ
    if (!isServerConnected.value) {
      return {
        ...exportAction.value,
        class: 'btn-primary',
        tip: t('navigation.exportConfigTip'),
        disabled: isExporting.value,
        large: true,
      }
    }

    // 開発版: 読み込み中のファイルの上書き保存が主
    if (isExpressMode.value) {
      if (saveFileName.value) {
        return {
          id: 'overwrite',
          label: t('navigation.saveFile', { name: saveFileName.value.replace('.json', '') }),
          run: () => devStore.overwriteConfig(saveFileName.value),
          class: 'btn-warning',
          tip: t('navigation.saveFileTip'),
          disabled: !hasChanged.value || isBusy.value,
          large: false,
        }
      }
      return {
        id: 'preset',
        label: t('shell.save.preset'),
        run: saveAsPreset,
        class: 'btn-success',
        tip: t('shell.save.presetTip'),
        disabled: isBusy.value,
        large: false,
      }
    }

    // 製品版(プラグインサーバー)
    return {
      id: 'generator',
      label: t('shell.save.generator'),
      run: () => devStore.saveToGenerator(),
      class: 'btn-primary',
      tip: t('shell.save.generatorTip'),
      disabled: isBusy.value,
      large: false,
    }
  })

  const menu = computed<MenuAction[]>(() => {
    if (!isServerConnected.value) return []

    const entries: MenuAction[] = []
    // プリセットとして保存は、製品版・開発版のどちらでも使える
    entries.push({ id: 'preset', label: t('shell.save.preset'), run: saveAsPreset, icon: FilePlus })
    entries.push({ ...exportAction.value, icon: FileDown })
    // omikujiData.js への保存は開発用なので、必ずメニューの中に入れる
    if (isDev && isExpressMode.value) {
      entries.push({
        id: 'omikujiData',
        label: t('shell.save.omikujiData'),
        run: () => devStore.overwriteOmikujiData(),
        icon: HardDriveUpload,
      })
    }
    return entries.filter((entry) => entry.id !== primary.value.id)
  })

  return { hasChanged, isBusy, primary, menu }
}
