/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: '循環参照は禁止',
      from: {
        pathNot: '(^|/)node_modules/',
      },
      to: {
        circular: true,
      },
    },
    {
      name: 'types-no-runtime-dependencies',
      severity: 'warn',
      comment: '共通型定義は実装層に依存しない',
      from: {
        path: '^src/types/',
      },
      to: {
        path: '^src/(common|console|editor|engine|games|generator|i18n|layout|manager|maps|plugin|register|sdk|ui)/',
      },
    },
    {
      name: 'common-no-feature-dependencies',
      severity: 'warn',
      comment: '共通処理は各機能に依存しない',
      from: {
        path: '^src/common/',
      },
      to: {
        path: '^src/(console|editor|generator|manager|ui)/',
      },
    },
  ],

  options: {
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    tsPreCompilationDeps: true,
  },
}
