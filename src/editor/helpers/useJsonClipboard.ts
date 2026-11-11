// src/editor/helpers/useJsonClipboard.ts
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

// 通知文言。省略したものは i18n の clipboard.* を使う(用途に合わせて上書きしたいものだけ渡す)
type NotifyMessages = {
  copySuccess?: string
  copyError?: string
  pasteReadError?: string
  pasteInvalidJson?: string
  /** parse が null を返したとき(JSON ではあるが、期待する形ではない) */
  pasteInvalidFormat?: string
}

type UseJsonClipboardOptions<T> = {
  parse: (raw: unknown) => T | null
  serialize?: (value: T) => unknown
  // 関数で渡すと、通知のたびに評価する(言語を切り替えても追従する)
  messages?: NotifyMessages | (() => NotifyMessages)
}

// setup 内で呼ぶこと(useI18n を使うため)
export function useJsonClipboard<T>(options: UseJsonClipboardOptions<T>) {
  const { serialize = (v: T) => v, parse } = options
  const messages = (): NotifyMessages | undefined =>
    typeof options.messages === 'function' ? options.messages() : options.messages
  const { t } = useI18n()

  const isCopying = ref(false)
  const isPasting = ref(false)
  const lastError = ref<string | null>(null)

  const copyJson = async (value: T): Promise<boolean> => {
    lastError.value = null
    isCopying.value = true
    try {
      const json = JSON.stringify(serialize(value), null, 2)
      await navigator.clipboard.writeText(json)
      swalToast.success({ title: messages()?.copySuccess ?? t('clipboard.copySuccess') })
      return true
    } catch (e) {
      const reason = e instanceof Error ? e.message : String(e)
      lastError.value = reason
      swalToast.error({ title: messages()?.copyError ?? t('clipboard.copyError', { error: reason }) })
      return false
    } finally {
      isCopying.value = false
    }
  }

  // 失敗したときは、通知を出して null を返す(理由は lastError にも入る)
  const fail = (message: string, reason?: string): null => {
    lastError.value = reason ?? message
    swalToast.error({ title: message })
    return null
  }

  const pasteJson = async (): Promise<T | null> => {
    lastError.value = null
    isPasting.value = true
    try {
      let text: string
      try {
        text = await navigator.clipboard.readText()
      } catch (e) {
        const reason = e instanceof Error ? e.message : String(e)
        return fail(messages()?.pasteReadError ?? t('clipboard.pasteReadError'), reason)
      }

      let raw: unknown
      try {
        raw = JSON.parse(text)
      } catch {
        return fail(messages()?.pasteInvalidJson ?? t('clipboard.pasteInvalidJson'))
      }

      const result = parse(raw)
      if (result === null) return fail(messages()?.pasteInvalidFormat ?? t('clipboard.pasteInvalidFormat'))
      return result
    } finally {
      isPasting.value = false
    }
  }

  return { copyJson, pasteJson, isCopying, isPasting, lastError }
}
