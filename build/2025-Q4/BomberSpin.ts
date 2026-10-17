// build/2025-Q4/BomberSpin.ts
import { createPackageProject } from '@tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectPackageConfig, ProjectParams } from '@tools/types'

const PROJECT = {
  key: 'BomberSpin',
  title: 'ボンバースロット',
  description: '数値の大きさで楽しむ、ミニゲーム系のジェネレーター',
  banner: '',
  tags: ['ゲームスクリプト', 'ボンバースロット', 'うさぎスロット', '桜吹雪スロット'],
  boothId: '7730686',
  category: '2025-Q4',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（推定）
const buildTargets: PackageBuildTarget[] = [
  { project: 'BomberSpin', type: 'FULL', sourceProject: 'OmikujiBot' },
  { project: 'BomberSpin', type: 'JSON' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectPackageConfig[] {
  return COLOR_VARIANTS.map((color) => createPackageProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
