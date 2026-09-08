// src/common/migrations/index.ts
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData'
import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { APP_VERSION, DATA_VERSION } from '@/version'

/**
 * データを現在のアプリのバージョンに合わせてマイグレーションする
 */
export function normalizeData(data: unknown): OmikujiDataType {
  // データにメタ情報がなければ、初期データとして扱う
  if (!data || typeof data !== 'object' || !('meta' in data)) {
    // OmikujiDataSchemaのデフォルト値を返す
    return OmikujiDataSchema.parse({
      meta: {
        generatorName: 'omikuji-bot',
        generatorVersion: APP_VERSION,
        dataVersion: DATA_VERSION,
      },
    })
  }

  // 読み込むデータが現在よりも新しい場合
  const incomingVersion = (data as any)?.meta?.dataVersion ?? 1
  if (incomingVersion > DATA_VERSION) {
    const msg = `このデータは v${incomingVersion} 形式です。\nこのアプリ（v${DATA_VERSION}）では読み込めません。`
    swalToast.error({ title: '読み込みエラー', text: msg })
    throw new Error(msg)
  }

  // dataVersionを数値として取得。存在しない場合はv1と見なす。
  const currentDataVersion = (data as any)?.meta?.dataVersion ?? 1

  // まずは生データをそのまま使う
  let updatedData: any = { ...data }

  /**
  マイグレーション実行
  // v1 -> v1.3
  if (currentDataVersion < 1.3) {
    console.log('Migrating data from v1 to v1.3...')
    updatedData = migrateV100ToV130(updatedData)
  }
  */

  // スキーマで保証
  return OmikujiDataSchema.parse({
    ...updatedData,
    meta: {
      ...updatedData.meta,
      generatorVersion: APP_VERSION,
      dataVersion: DATA_VERSION,
    },
  })
}
