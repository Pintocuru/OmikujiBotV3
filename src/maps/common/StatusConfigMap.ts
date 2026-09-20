//
import { AppStatus } from '@/types/core'
import { Loader, Wifi, WifiOff } from 'lucide-vue-next'

// ステータスごとの設定をMapで一元管理
type StatusConfig = {
  icon: any
  label: string
  badgeClass: string
  isAlwaysVisible?: boolean
}

export const statusConfigMap: Record<AppStatus, StatusConfig> = {
  initializing: {
    icon: Loader,
    label: '接続中',
    badgeClass: 'text-warning border border-warning/40',
    isAlwaysVisible: true,
  },
  ready: {
    icon: Wifi,
    label: '接続済み',
    badgeClass: 'text-success border border-success/40',
    isAlwaysVisible: false,
  },
  error: {
    icon: WifiOff,
    label: '未接続',
    badgeClass: 'text-error border border-error/40',
    isAlwaysVisible: true,
  },
}
