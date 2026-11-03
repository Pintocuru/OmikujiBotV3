// src/i18n/editor/apps/JsonMergeMessages.ts
export const jsonMergeMessages = {
  ja: {
    jsonMerge: {
      add: 'マージ設定を追加',
      empty: {
        title: 'マージ設定がありません。',
        description: '下のボタンから追加してください。',
      },
      settings: {
        unnamed: 'マージ設定',
        unsetSource: '(ファイル未設定)',
        editTitle: 'マージ設定編集: {name}',
        fallbackName: '設定{index}',
      },
      name: {
        label: 'マージ名',
        description: '識別しやすい名前',
      },
      remap: {
        title: 'リマップ {index}',
        remove: 'このリマップを削除',
        sectionTitle: 'キーリマップ設定',
        add: 'リマップ追加',
        empty: 'リマップ設定がありません',
        fromCharacter: '元キャラキー',
        toCharacter: '新キャラキー',
        chooseCharacter: 'キャラクターを選択してください',
        missingCharacter: '入力されてません',
        fromIcon: '元アイコンキー',
        toIcon: '新アイコンキー',
        chooseIcon: 'アイコンキーを選択…',
      },
      source: {
        label: 'マージ元ファイル',
        chooseFile: 'ファイルを選択してください',
        missingFile: '入力されてません',
        suffixLabel: '複数用のキーサフィックス',
        suffixDescription: 'マージ時に元のキーに付加する接尾辞',
        suffixPlaceholder: 'キャラクターキーを入力(1文字目は自動で大文字になります)',
      },
      unselected: '上のリストからマージ設定をクリックして編集してください',
    },
  },
  en: {
    jsonMerge: {
      add: 'Add merge settings',
      empty: {
        title: 'No merge settings.',
        description: 'Add one using the button below.',
      },
      settings: {
        unnamed: 'Merge settings',
        unsetSource: '(No file selected)',
        editTitle: 'Edit merge settings: {name}',
        fallbackName: 'Setting {index}',
      },
      name: {
        label: 'Merge name',
        description: 'A name that is easy to identify',
      },
      remap: {
        title: 'Remap {index}',
        remove: 'Remove this remap',
        sectionTitle: 'Key remapping',
        add: 'Add remap',
        empty: 'No remap settings',
        fromCharacter: 'Source character key',
        toCharacter: 'Target character key',
        chooseCharacter: 'Select a character',
        missingCharacter: 'No character entered',
        fromIcon: 'Source icon key',
        toIcon: 'Target icon key',
        chooseIcon: 'Select an icon key…',
      },
      source: {
        label: 'Source file',
        chooseFile: 'Select a file',
        missingFile: 'No file selected',
        suffixLabel: 'Key suffix for multiple files',
        suffixDescription: 'Suffix to append to the original key when merging',
        suffixPlaceholder: 'Enter a character key (the first letter is automatically capitalized)',
      },
      unselected: 'Select a merge setting from the list above to edit it',
    },
  },
} as const
