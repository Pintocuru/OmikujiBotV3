// src/i18n/editor/helpers/DataOperationMessages.ts
export const dataOperationMessages = {
  ja: {
    dataOperation: {
      loadError: 'データの読み込み中にエラーが発生',
      exportValidationError: {
        title: 'データの検証に失敗しました',
        description: 'データに不備があるためエクスポートできません。',
      },
      mergeSuccess: 'データを部分更新しました',
      mergeError: 'データの更新中にエラーが発生',
    },
  },
  en: {
    dataOperation: {
      loadError: 'An error occurred while loading the data.',
      exportValidationError: {
        title: 'Data validation failed',
        description: 'The data contains errors and cannot be exported.',
      },
      mergeSuccess: 'Partial data update completed.',
      mergeError: 'An error occurred while updating the data.',
    },
  },
} as const
