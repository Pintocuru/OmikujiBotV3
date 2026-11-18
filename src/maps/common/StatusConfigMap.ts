// src/maps/common/StatusConfigMap.ts
import type { AppStatus } from '@/types/core'
import type { Component } from 'vue'
import { Loader, Wifi, WifiOff } from '@lucide/vue'

// ステータスごとの設定をMapで一元管理
type StatusConfig = {
  icon: Component
  label: string
  badgeClass: string
  isAlwaysVisible?: boolean
}

export const statusConfigMap: Record<AppStatus, StatusConfig> = {
  initializing: {
    icon: Loader,
    label: '接続中 / Connecting',
    badgeClass: 'text-warning border border-warning/40',
    isAlwaysVisible: true,
  },
  ready: {
    icon: Wifi,
    label: '接続済み / Connected',
    badgeClass: 'text-success border border-success/40',
    isAlwaysVisible: false,
  },
  error: {
    icon: WifiOff,
    label: '未接続 / Disconnected',
    badgeClass: 'text-error border border-error/40',
    isAlwaysVisible: true,
  },
}
