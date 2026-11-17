// tools/viteBuild/shared/vendor.ts
// 全 entry (main / editor / console) で重複していたライブラリを 1 回だけ束ねる。
// 各 entry のビルドでは external + globals で、ここが公開するグローバルを参照する。
//
// 注意: iife の external は、default import が「Node モード」の互換処理で包まれる。
//   import axios from 'axios' → グローバルオブジェクト自身が default になる (.default は見られない)
// そのため default 形式で使うライブラリは、default export そのものを公開する。
// (axios.AxiosError のような名前付き export も、default export 自身の持つプロパティで参照できる)
import './shared.css'
import axios from 'axios'
import Swal from 'sweetalert2'
import * as motion from '@vueuse/motion'
import * as exprEval from 'expr-eval-fork'

// どちらの互換処理でも動くように、自分自身を default としても持たせる
const selfDefault = <T extends object>(value: T): T => Object.assign(value, { default: value })

// 名前付き import だけで使うライブラリは、名前空間をそのまま展開する
const named = (ns: object) => ({ ...ns, __esModule: true })

const w = window as unknown as Record<string, unknown>
w.OmikujiAxios = selfDefault(axios)
w.OmikujiSwal = selfDefault(Swal)
w.OmikujiMotion = named(motion)
w.OmikujiExprEval = named(exprEval)
