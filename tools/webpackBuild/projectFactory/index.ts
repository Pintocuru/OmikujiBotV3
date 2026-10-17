// tools/webpackBuild/projectFactory/index.ts
// プロジェクト設定(コア/パッケージ)を組み立てる関連ものの入口

export { DEFAULT_FILES_TO_COPY } from './defaults'
export { createCoreBuildConfig } from './createCoreProject'
export { createPackageProject } from './createPackageProject'
export { findJsonPath } from './findJsonPath'
