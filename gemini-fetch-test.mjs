const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error('GEMINI_API_KEY が設定されていません')
  process.exit(1)
}

const url = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
const body = {
  model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  max_tokens: 200,
  messages: [{ role: 'user', content: 'Explain how AI works in a few words' }],
}

const started = Date.now()
console.log('送信開始:', new Date().toISOString())

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  })

  console.log('応答まで:', Date.now() - started, 'ms')
  console.log('HTTP status:', response.status)
  console.log('Headers:', Object.fromEntries(response.headers.entries()))
  console.log('Body:', await response.text())
} catch (error) {
  console.error('失敗まで:', Date.now() - started, 'ms')
  console.error('Error name:', error?.name)
  console.error('Error message:', error?.message)
  console.error('Error cause:', error?.cause)
}
