// src/common/migrations/index.ts
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData'
import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { APP_VERSION, DATA_VERSION } from '@/version'
import { ensureSampleCharacters } from './sampleCharacter'
import { migrateV2ToV3 } from './v2ToV3'

/** これ未満の dataVersion は旧形式（v2 以前）。v3 の形式へ変換が必要 */
const LEGACY_DATA_VERSION_LIMIT = 3

/** データの dataVersion を数値で取得する。存在しない場合は v1 と見なす */
function getDataVersion(data: unknown): number {
  const v = (data as any)?.meta?.dataVersion
  return typeof v === 'number' ? v : 1
}

/**
 * データを現在のアプリのバージョンに合わせてマイグレーションする
 */
export function normalizeData(data: unknown): OmikujiDataType {
  // データにメタ情報がなければ、初期データとして扱う
  if (!data || typeof data !== 'object' || !('meta' in data)) {
    // OmikujiDataSchemaのデフォルト値を返す
    return ensureSampleCharacters(
      OmikujiDataSchema.parse({
        meta: {
          generatorName: 'omikuji-bot',
          generatorVersion: APP_VERSION,
          dataVersion: DATA_VERSION,
        },
      })
    )
  }

  // 読み込むデータが現在よりも新しい場合
  const incomingVersion = getDataVersion(data)
  if (incomingVersion > DATA_VERSION) {
    const msg = `このデータは v${incomingVersion} 形式です。\nこのアプリ（v${DATA_VERSION}）では読み込めません。`
    swalToast.error({ title: '読み込みエラー', text: msg })
    throw new Error(msg)
  }

  // まずは生データをそのまま使う
  let updatedData: any = { ...data }

  /**
   * マイグレーション実行
   * v2 -> v3 : events/assets/ui へのネスト、キー名の変更、廃止項目の削除
   */
  if (incomingVersion < LEGACY_DATA_VERSION_LIMIT) {
    console.log(`Migrating data from v${incomingVersion} to v${LEGACY_DATA_VERSION_LIMIT}...`)
    updatedData = migrateV2ToV3(updatedData)
    swalToast.warning({
      title: '古いバージョンのデータを変換しました',
      text: `v${incomingVersion} → v${LEGACY_DATA_VERSION_LIMIT} 形式に変換し、廃止された項目は破棄しました。`,
    })
  }

  // スキーマで保証
  return ensureSampleCharacters(
    OmikujiDataSchema.parse({
      ...updatedData,
      meta: {
        ...updatedData.meta,
        generatorVersion: APP_VERSION,
        dataVersion: DATA_VERSION,
      },
    })
  )
}
