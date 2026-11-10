// src/i18n/editor/helpers/clipboardMessages.ts
// useJsonClipboard が出す通知。呼び出し側で上書きしない限り、これを使う

export const clipboardMessages = {
  ja: {
    clipboard: {
      copySuccess: 'JSONをクリップボードにコピー',
      copyError: 'コピーに失敗しました: {error}',
      pasteReadError: 'クリップボードを読み取れませんでした',
      pasteInvalidJson: 'クリップボードの内容がJSON形式ではありません',
      pasteInvalidFormat: 'JSONの形式が一致しません',
    },
  },
  en: {
    clipboard: {
      copySuccess: 'Copied JSON to clipboard',
      copyError: 'Failed to copy: {error}',
      pasteReadError: 'Failed to read clipboard',
      pasteInvalidJson: 'Clipboard content is not valid JSON',
      pasteInvalidFormat: 'The JSON format does not match',
    },
  },
}
