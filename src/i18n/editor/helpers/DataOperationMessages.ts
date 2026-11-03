// src/i18n/editor/helpers/DataOperationMessages.ts
export const dataOperationMessages = {
  ja: {
    dataOperation: {
      loadError: 'データの読み込み中にエラーが発生しました',
      exportValidationError: {
        title: 'データの検証に失敗しました',
        description: '内容に不備があるため、エクスポートできません。',
      },
      mergeSuccess: 'データの部分更新が完了しました。',
      mergeError: 'データの更新中にエラーが発生しました',
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
