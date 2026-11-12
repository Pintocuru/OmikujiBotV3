// tools/runFix.ts
import { execSync } from 'node:child_process'

const cmds = ['tsx tools/fileName/UpdateTsFiles.ts', 'prettier --write .', 'eslint src --fix']

for (const cmd of cmds) {
  console.log(`> ${cmd}`)
  execSync(cmd, {
    stdio: 'inherit',
  })
}
