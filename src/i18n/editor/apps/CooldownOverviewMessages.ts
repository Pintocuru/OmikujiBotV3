// src/i18n/editor/apps/CooldownOverviewMessages.ts
export const cooldownOverviewMessages = {
  ja: {
    cooldownOverview: {
      description:
        'イベントで使用中のおみくじのクールダウン。イベントをまたいで適用されます。値の変更と、おみくじ名からの移動ができます。',
      empty: '使用中のおみくじはありません',
      columns: {
        item: 'おみくじ / おみくじ箱',
        events: '使われるイベント',
        cooldown: 'クールダウン',
        blockedBy: '止められうる',
        blocks: '止めうる',
      },
      blockedByTooltip: 'このおみくじを時間内にブロックできる、ほかのおみくじの数',
      blocksTooltip: 'このおみくじが時間内にブロックできる、ほかのおみくじの数',
      disabledSuffix: '(無効)',
      note: '無効なイベントでのみ使われるおみくじは薄く表示し、件数の計算から除外します。件数はブロックされる可能性のある数です。実際にブロックされるかは、直前に実行されたおみくじと経過時間で決まります。',
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
