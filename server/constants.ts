// server/constants.ts
import path from 'path'
import { fileURLToPath } from 'url'

// わんコメプラグインと同じ位置にするため、この位置から動かさないこと
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const SERVER_ROOT = path.join(__dirname)
