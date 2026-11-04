// src/i18n/editor/apps/CooldownOverviewMessages.ts
export const cooldownOverviewMessages = {
  ja: {
    cooldownOverview: {
      description:
        'イベントから使われているすべてのおみくじのクールダウンです。クールダウンはイベントをまたいで効きます。値はここで直接変更でき、名前を押すと、そのおみくじへ移動します。',
      empty: 'イベントから使われているおみくじはありません',
      columns: {
        item: 'おみくじ / おみくじ箱',
        events: '使われるイベント',
        cooldown: 'クールダウン',
        blockedBy: '止められうる',
        blocks: '止めうる',
      },
      blockedByTooltip: 'このおみくじを(時間内に)止めうる、他のおみくじの数',
      blocksTooltip: 'このおみくじが(時間内に)止めうる、他のおみくじの数',
      disabledSuffix: '(無効)',
      note: '無効なイベントからだけ使われているおみくじは薄く表示し、「止められうる」「止めうる」の計算には含めません。件数は「止められる可能性がある数」で、実際に止まるかは直前に実行されたおみくじと経過時間で決まります。',
    },
  },
  en: {
    cooldownOverview: {
      description:
        'Cooldowns of every omikuji used by an event. Cooldowns apply across events. You can edit the values here, and press a name to jump to that omikuji.',
      empty: 'No omikuji is used by an event',
      columns: {
        item: 'Omikuji / Box',
        events: 'Used by events',
        cooldown: 'Cooldown',
        blockedBy: 'Blockable by',
        blocks: 'Can block',
      },
      blockedByTooltip: 'Number of other omikuji that can block this one (within the time)',
      blocksTooltip: 'Number of other omikuji that this one can block (within the time)',
      disabledSuffix: ' (disabled)',
      note: 'Omikuji used only by disabled events are dimmed and left out of the "Blockable by" / "Can block" counts. The counts are possibilities; what actually gets blocked depends on the last omikuji that ran and the elapsed time.',
    },
  },
} as const
