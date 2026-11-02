// src/editor/helpers/presetsExport/useConfigExport.ts
import { ref } from 'vue'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { generateJsContent } from '@/common/presetsExport/generateContent'
import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
import { confirmSaveWithIssues } from '@/editor/helpers/confirmSaveWithIssues'
import i18n from '@/editor/i18n'

const t = (key: string) => i18n.global.t(key)

type ExportType = 'config'

interface ExportConfig {
  filename: string
  contentType: string
  generateContent: (data: string) => string
  successMessage: {
    titleKey: string
    descriptionKey: string
  }
}

export const useConfigExport = () => {
  const omikujiStore = useOmikujiStore()
  const isExporting = ref(false)

  // エクスポート設定
  const exportConfigs: Record<ExportType, ExportConfig> = {
    config: {
      filename: 'omikujiData.js',
      contentType: 'application/javascript',
      generateContent: generateJsContent,
      successMessage: {
        titleKey: 'presetExport.success.title',
        descriptionKey: 'presetExport.success.description',
      },
    },
  }

  // ファイルダウンロード処理
  const downloadFile = (content: string, filename: string, contentType: string): boolean => {
    try {
      const blob = new Blob([content], { type: contentType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
      return true
    } catch (error) {
      console.error('File download error:', error)
      return false
    }
  }

  // エクスポート処理
  const exportFile = async (type: ExportType): Promise<boolean> => {
    if (isExporting.value) return false
    if (!(await confirmSaveWithIssues())) return false

    try {
      isExporting.value = true
      const config = exportConfigs[type]

      // OmikujiDataをstringで持ってくる
      const configData = omikujiStore.exportData()
      if (!configData) {
        await swalModal.error({
          title: t('presetExport.invalidData.title'),
          text: t('presetExport.invalidData.description'),
        })
        return false
      }

      const content = config.generateContent(configData)
      const success = downloadFile(content, config.filename, config.contentType)

      if (success) {
        swalModal.success({
          title: t(config.successMessage.titleKey),
          text: t(config.successMessage.descriptionKey),
        })
      } else {
        await swalModal.error({
          title: t('presetExport.downloadFailed.title'),
          text: t('presetExport.downloadFailed.description'),
        })
      }

      return success
    } catch (error) {
      console.error(`${type} export error:`, error)
      await swalModal.error({
        title: t('presetExport.exportFailed.title'),
        text: t('presetExport.exportFailed.description'),
      })
      return false
    } finally {
      isExporting.value = false
    }
  }

  return {
    isExporting,
    exportFile,
  }
}
