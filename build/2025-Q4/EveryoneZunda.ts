// build/2025-Q4/EveryoneZunda.ts
import { createPackageProject } from '@tools/webpackBuild/projectFactory'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'EveryoneZunda',
  title: 'みんなのずんだもん',
  description: 'ずんだもんがリスナーを歓迎してくれるジェネレーター',
  banner: '',
  tags: [
    'ずんだもん',
    'VOICEVOX',
    '（ず・ω・きょ）',
    '初見判定',
    '初見詐欺',
    'ギフト',
    'コメント数表示',
    'コメントチェック',
    '閲覧数チェック',
    '漆黒のおみくじ',
    'じゃんけん',
    '閲覧数チェック',
    '告知',
  ],
  boothId: '6053855',
  category: '2025-Q4',
  licenseLabel: '利用規約に従う',
  extraFiles: [{ from: 'assets/Characters/zunda/', to: 'Characters/zunda/' }],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（両方定義）
const buildTargets: PackageBuildTarget[] = [{ project: 'EveryoneZunda', type: 'FULL', sourceProject: 'OmikujiBot' }]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
