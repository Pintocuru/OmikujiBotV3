// src/editor/apps/appItems/useVersionCheck.ts
import { ref, computed, Ref } from 'vue'
import Swal from 'sweetalert2'
import i18n from '@/editor/i18n'

const t = (key: string, named?: Record<string, unknown>) => (named ? i18n.global.t(key, named) : i18n.global.t(key))

// TODO: 型定義をエクスポートして、別のファイル(src/editor/types など)に定義するほうがいいのでは？
export interface VersionInfo {
  current: string
  latest: string | null
  isLatest: boolean
  hasNewVersion: boolean
  isLoading: boolean
  error: string | null
}

/**
 * バージョンチェック機能を提供する専属コンポーザブル
 * storeに依存せず、現在のバージョンを引数で受け取る
 */
export function useVersionCheck(currentVersion: Ref<string>) {
  const latestVersion = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // バージョン比較用の正規化
  function normalizeVersion(v: string | null): string | null {
    return v ? v.trim().replace(/^v/, '') : null
  }

  // 最新版かどうか
  const isLatest = computed(() => {
    if (!latestVersion.value) return true
    return normalizeVersion(currentVersion.value) === normalizeVersion(latestVersion.value)
  })

  // 新バージョンが存在するか
  const hasNewVersion = computed(() => {
    if (!latestVersion.value) return false
    return normalizeVersion(currentVersion.value) !== normalizeVersion(latestVersion.value)
  })

  // バージョン情報オブジェクト
  const versionInfo = computed<VersionInfo>(() => ({
    current: currentVersion.value,
    latest: latestVersion.value,
    isLatest: isLatest.value,
    hasNewVersion: hasNewVersion.value,
    isLoading: isLoading.value,
    error: error.value,
  }))

  /**
   * GitHubから最新バージョンをチェック
   */
  const checkVersion = async (): Promise<void> => {
    if (isLoading.value) return // 重複実行防止

    isLoading.value = true
    error.value = null

    try {
      // TODO: 定数は別のファイルに定義したい
      const res = await fetch('https://api.github.com/repos/Pintocuru/OmikujiBot-Docs/releases/latest')

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const release = await res.json()
      latestVersion.value = release.tag_name?.replace(/^v/, '') || null

      if (!latestVersion.value) {
        throw new Error(t('appHeader.versionNotFound'))
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : t('appHeader.versionFetchFailed')
      console.error('バージョンチェックエラー:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 更新通知ダイアログを表示
   */
  const showUpdateDialog = () => {
    if (!hasNewVersion.value) return

    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'info',
      title: t('appHeader.updateAvailable', { current: versionInfo.value.current, latest: versionInfo.value.latest }),
      showConfirmButton: true,
      confirmButtonText: t('appHeader.openGithub'),
      timer: 15000,
      timerProgressBar: true,
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(openLatestRelease(), '_blank')
      }
    })
  }

  /**
   * 最新リリースページのURLを取得
   */
  const openLatestRelease = (): string => {
    return 'https://github.com/Pintocuru/OmikujiBot-Docs/releases/latest'
  }

  return {
    // 状態
    versionInfo,

    // アクション
    checkVersion,
    showUpdateDialog,
    openLatestRelease,
  }
}
