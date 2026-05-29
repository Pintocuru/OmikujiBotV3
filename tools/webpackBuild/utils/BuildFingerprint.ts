// shared/utils/webpackBuild/utils/BuildFingerprint.ts
import crypto from 'crypto'
import { ResolvedCoreBuildConfig } from '../BuildTypes'

export function createCoreFingerprint(config: ResolvedCoreBuildConfig): string {
  const payload = {
    name: config.key,
    version: config.version,
    entryPoints: config.entryPoints,
    generatorVersion: config.system.generatorVersion,
    dataVersion: config.system.dataVersion,
  }

  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex')
}
