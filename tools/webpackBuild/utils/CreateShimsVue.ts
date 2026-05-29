// shared/utils/webpackBuild/utils/CreateShimsVue.ts
import path from 'path'
import fs from 'fs/promises'

/*
 * shims-vue.d.ts を生成
 */
export async function CreateShimsVue(packageRoot: string) {
  const shimsPath = path.resolve(packageRoot, 'src/types/shims-vue.d.ts')

  const content = `declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}`
  await fs.mkdir(path.dirname(shimsPath), { recursive: true })
  await fs.writeFile(shimsPath, content, 'utf-8')
  console.log(`✅ Created: ${shimsPath}`)
}

/*
 * shims-vue.d.ts を削除
 */
export async function RemoveShimsVue(packageRoot: string) {
  const shimsPath = path.resolve(packageRoot, 'src/types/shims-vue.d.ts')

  try {
    await fs.rm(shimsPath)
    console.log(`🗑️ Removed: ${shimsPath}`)
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      // そもそも存在しない → 正常
      console.log(`ℹ️ Already removed: ${shimsPath}`)
    } else {
      console.error(`❌ Failed to remove: ${shimsPath}`, err)
    }
  }
}
