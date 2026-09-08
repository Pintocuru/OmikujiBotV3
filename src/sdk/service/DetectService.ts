// src/sdk/service/DetectService.ts
import { ServiceType } from '@onecomme.com/onesdk/types/Service'

// サービスマップの定数化
const SERVICE_DOMAIN_MAP: Record<string, ServiceType> = {
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'twitch.tv': 'twitch',
  'twitcasting.tv': 'twicas',
  'showroom-live.com': 'showroom',
  'live.bilibili.com': 'bilibili',
  'mixch.tv': 'mixch',
  'nicovideo.jp': 'niconama',
  'live.nicovideo.jp': 'niconama',
  'kick.com': 'kick',
  'tiktok.com': 'tiktok',
  'mirrativ.com': 'mirrativ',
} as const

/**
 * URLパターンからServiceTypeを判別
 */
export function detectServiceFromUrl(url: string): ServiceType | null {
  if (!url) return null

  try {
    const parsedUrl = new URL(url.toLowerCase().startsWith('http') ? url : `https://${url}`)
    const hostname = parsedUrl.hostname.toLowerCase()

    // 通常のマッピング
    for (const [domain, service] of Object.entries(SERVICE_DOMAIN_MAP)) {
      if (hostname.includes(domain)) return service
    }

    return null
  } catch {
    return null
  }
}
