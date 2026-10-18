// src/editor/presets/timers.ts
import { buildSimpleMikuji, message } from './helpers'
import type { PresetDefinition } from './types'

/** 時報: 毎正時にお知らせ */
const hourlyChime: PresetDefinition<'timers'> = {
  id: 'hourlyChime',
  category: 'timers',
  build: () => {
    const { key, mikuji } = buildSimpleMikuji('時報', [message('時報です。')])
    return {
      assets: { mikuji: [mikuji] },
      events: [{ name: '時報', omikujiKey: key, mode: 'interval', intervalSeconds: 60 * 60, isBaseZero: true }],
    }
  },
}

/** 30秒ごとに、同時接続数ぶん WordParty を鳴らす */
const viewerWordParty: PresetDefinition<'timers'> = {
  id: 'viewerWordParty',
  category: 'timers',
  build: () => {
    const { key, mikuji } = buildSimpleMikuji('同時接続数WordParty', [
      { kind: 'wordParty', wordPartyId: '', repeat: 'viewer' }, // wordPartyId は作成後に設定
    ])
    return {
      assets: { mikuji: [mikuji] },
      events: [{ name: '同時接続数WordParty', omikujiKey: key, mode: 'interval', intervalSeconds: 30 }],
    }
  },
}

/** 定期告知: 10分ごとにコメントを促す */
const reminder: PresetDefinition<'timers'> = {
  id: 'reminder',
  category: 'timers',
  build: () => {
    const { key, mikuji } = buildSimpleMikuji('定期告知', [
      message('コメントはお気軽にどうぞ！「おみくじ」でおみくじも引けます'),
    ])
    return {
      assets: { mikuji: [mikuji] },
      events: [{ name: '定期告知', omikujiKey: key, mode: 'interval', intervalSeconds: 60 * 10 }],
    }
  },
}

export const timerPresets = [hourlyChime, reminder, viewerWordParty]
