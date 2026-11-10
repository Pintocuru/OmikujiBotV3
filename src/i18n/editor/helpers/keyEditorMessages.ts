// src/i18n/editor/helpers/keyEditorMessages.ts

export const keyEditorMessages = {
  ja: {
    keyEditor: {
      buttonLabel: 'Keyを編集',
      buttonTip: 'Keyを変更。参照先の設定にも影響する可能性があります。',
      title: '{category}のKeyを編集',
      currentKey: '現在のKey',
      newKey: '新しいKey',
      newKeyPlaceholder: '新しいKey',
      validation: {
        required: 'Keyを入力',
        format: 'Keyに使える文字は英数字、アンダースコア（_）、ハイフン（-）のみ',
        duplicate: 'このKeyは使用済み',
      },
      errors: {
        unsupported: 'サポートされていないカテゴリです',
        failed: 'Keyを更新できませんでした',
        exception: 'Keyの更新中にエラーが発生',
      },
      usage: {
        title: 'このキャラクターの使用状況',
        unused: '使用されていません',
        count: '{count}箇所',
        events: {
          comments: 'コメントイベント',
          timers: 'タイマーイベント',
          services: '配信数値イベント',
          reactions: 'リアクションイベント',
          pads: 'ポン出しイベント',
        },
      },
      warning: {
        base: 'Keyを変更すると、この{target}を参照するほかの設定にも影響する可能性があります。',
        notes: {
          mikuji: 'このみくじ箱を指定しているイベントの設定が自動的に更新されます。',
          scenarios: 'このシナリオを呼び出しているステップが自動的に更新されます。',
          placeholders:
            'このプレースホルダーを使っているメッセージや他のプレースホルダーの内容が自動的に更新されます。',
          characters: 'このキャラクターを使っているステップ(みくじ箱・シナリオ)が自動的に更新されます。',
        },
      },
    },
  },
  en: {
    keyEditor: {
      buttonLabel: 'Edit Key',
      buttonTip: 'Change the key. Other settings that reference it may be affected.',
      title: 'Edit {category} Key',
      currentKey: 'Current Key',
      newKey: 'New Key',
      newKeyPlaceholder: 'Enter a new key',
      validation: {
        required: 'Please enter a key',
        format: 'Only letters, numbers, underscores (_) and hyphens (-) are allowed',
        duplicate: 'This key is already in use',
      },
      errors: {
        unsupported: 'This category is not supported',
        failed: 'Failed to update the key',
        exception: 'An error occurred while updating the key',
      },
      usage: {
        title: 'Usage of this character:',
        unused: 'Not used anywhere',
        count: '{count} place(s)',
        events: {
          comments: 'Comment events',
          timers: 'Timer events',
          services: 'Stream stats events',
          reactions: 'Reaction events',
          pads: 'Pad events',
        },
      },
      warning: {
        base: 'Changing the key may affect other settings that reference this {target}.',
        notes: {
          mikuji: 'Events that use this mikuji box are updated automatically.',
          scenarios: 'Steps that call this scenario are updated automatically.',
          placeholders: 'Messages and other placeholders that use this placeholder are updated automatically.',
          characters: 'Steps (in mikuji boxes and scenarios) that use this character are updated automatically.',
        },
      },
    },
  },
}
