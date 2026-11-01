// src/i18n/editor/helpers/clipboardMessages.ts
// useJsonClipboard が出す通知。呼び出し側で上書きしない限り、これを使う

export const clipboardMessages = {
  ja: {
    clipboard: {
      copySuccess: 'JSONをクリップボードにコピーしました',
      copyError: 'コピーに失敗しました: {error}',
      pasteReadError: 'クリップボードの読み取りに失敗しました',
      pasteInvalidJson: 'クリップボードの内容が正しいJSON形式ではありません',
      pasteInvalidFormat: 'JSONの形式が一致しませんでした',
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
