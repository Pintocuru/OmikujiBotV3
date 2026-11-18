// tools/depcruise/dependency-cruiser.config.ts
import type { IConfiguration } from 'dependency-cruiser'

const config: IConfiguration = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: '循環参照は禁止',
      from: { pathNot: '(^|/)node_modules/' },
      to: { circular: true },
    },
    {
      name: 'types-no-runtime-dependencies',
      severity: 'warn',
      comment: '共通型定義は実装層に依存しない',
      from: { path: '^src/types/' },
      to: {
        path: '^src/(common|console|editor|engine|games|generator|i18n|layout|manager|maps|plugin|register|sdk|ui)/',
      },
    },
    {
      name: 'common-no-feature-dependencies',
      severity: 'warn',
      comment: '共通処理は各機能に依存しない',
      from: { path: '^src/common/' },
      to: {
        path: '^src/(console|editor|generator|manager|ui)/',
        // 他に依存しない純粋なマップ/レジストリで、配置を src/ui 直下に固定しているもの
        pathNot: '^src/ui/(uiLayoutMap|uiRegistry)\\.ts$',
      },
    },
  ],
  options: {
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
  },
}

export default config
