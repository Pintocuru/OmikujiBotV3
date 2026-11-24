// src/console/game/WordAlchemy/maps/WordAlchemyMessageMap.ts
// 画面に出す文言
export const wordAlchemyMessages = {
  title: '言葉の錬金術',
  hint: 'WASD で動いて、ことばを鍋へ押し込もう',
  pot: '鍋',
  startLive: 'スタート',
  startAuto: 'コメントオートで試す',
  bar: { auto: 'オート', abort: 'やめる', abortConfirm: 'もう一度押してやめる' },
  comments: { connecting: 'コメント接続中…', error: 'コメントに接続できません', retry: '再接続' },
} as const
