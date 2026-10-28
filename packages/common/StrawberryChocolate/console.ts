// packages/common/StrawberryChocolate/console.ts
// LiveConsole 用のアクセスポイント。build.ts の getProjects で withConsole を true にしたときだけ同梱される
import LiveConsole from '@/console/LiveConsole.vue'
import { createBaseApp } from '@/common/EntryCore/core'
import '@assets/styles/DaisyUi.css'

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountConsole = () => {
  createBaseApp(LiveConsole).mount('#App')
}
