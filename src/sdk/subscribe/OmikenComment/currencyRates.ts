// src/sdk/subscribe/OmikenComment/currencyRates.ts

/**
 * 金額の円換算レート(1単位あたりの円)。為替の変動は追わず、「それらしい金額」で判定できればよい概算。
 * 通貨コード(YouTube の currency など)と通貨記号(unit)の両方を引ける。
 * 従来の仕様: ¥=1 / $=100 / NT$=5
 */
const YEN_RATES = new Map<string, number>([
  // 円
  ['JPY', 1],
  ['¥', 1],
  ['￥', 1],
  ['円', 1],
  // ドル系・ユーロ・ポンドなど
  ['USD', 100],
  ['$', 100],
  ['US$', 100],
  ['EUR', 110],
  ['€', 110],
  ['GBP', 130],
  ['£', 130],
  ['CHF', 115],
  ['CAD', 75],
  ['CA$', 75],
  ['CAD$', 75],
  ['AUD', 65],
  ['A$', 65],
  ['AU$', 65],
  ['NZD', 60],
  ['NZ$', 60],
  ['SGD', 75],
  ['S$', 75],
  ['HKD', 13],
  ['HK$', 13],
  ['TWD', 5],
  ['NT$', 5],
  ['CNY', 14],
  ['RMB', 14],
  ['KRW', 0.1],
  ['₩', 0.1],
  // 東南アジア・南アジア・中東
  ['THB', 3],
  ['฿', 3],
  ['PHP', 2],
  ['₱', 2],
  ['MYR', 22],
  ['IDR', 0.01],
  ['VND', 0.004],
  ['₫', 0.004],
  ['INR', 1.2],
  ['₹', 1.2],
  ['ILS', 28],
  ['₪', 28],
  ['AED', 27],
  ['SAR', 27],
  ['TRY', 3],
  // 中南米・ヨーロッパ・その他
  ['BRL', 20],
  ['R$', 20],
  ['MXN', 6],
  ['MX$', 6],
  ['ARS', 0.1],
  ['CLP', 0.1],
  ['COP', 0.03],
  ['PEN', 27],
  ['PLN', 25],
  ['ZŁ', 25],
  ['CZK', 5],
  ['KČ', 5],
  ['SEK', 10],
  ['NOK', 10],
  ['DKK', 15],
  ['KR', 10],
  ['HUF', 0.3],
  ['RON', 22],
  ['RUB', 1.2],
  ['UAH', 2.5],
  ['ZAR', 6],
])

const warnedUnits = new Set<string>()

/** 通貨コード(currency)か通貨記号(unit)から、円へのレートを求める。未知の単位は 1 倍(初回のみ警告) */
function resolveYenRate(currency?: string, unit?: string): number {
  for (const raw of [currency, unit]) {
    const key = raw?.trim()
    if (!key) continue
    const rate = YEN_RATES.get(key) ?? YEN_RATES.get(key.toUpperCase())
    if (rate !== undefined) return rate
  }

  const label = currency?.trim() || unit?.trim()
  if (label && !warnedUnits.has(label)) {
    warnedUnits.add(label)
    console.warn(`[currencyRates] 未知の金額単位です(等倍で扱います): ${label}`)
  }
  return 1
}

/**
 * 金額を円に換算する(小数は四捨五入)
 */
export function convertToJPY(price: number | undefined, currency?: string, unit?: string): number {
  if (!price || price <= 0) return 0
  return Math.round(price * resolveYenRate(currency, unit))
}
