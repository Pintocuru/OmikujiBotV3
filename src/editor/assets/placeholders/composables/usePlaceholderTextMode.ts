// src/editor/assets/placeholders/composables/usePlaceholderTextMode.ts
import { computed, type Ref, ref } from 'vue'
import {
  WeightValueSchema,
  type WeightValueType,
  type WeightValuesArrayType,
} from '@/types/OmikujiData'

type ParsedLine = { weight: number; content: string; hasError: boolean }

export function usePlaceholderTextMode(initialValues: Ref<WeightValuesArrayType>) {
  const textContent = ref('')

  // 初期値をテキストに変換
  const initializeText = () => {
    textContent.value = initialValues.value
      .map((value) => {
        if (typeof value === 'string') return value
        return value.weight === 1 ? value.content : `${value.weight},${value.content}`
      })
      .join('\n')
  }

  // 行数計算
  const lineCount = computed(() => textContent.value.split('\n').length)

  // 行をパースしてバリデーション
  const parseAndValidateLine = (line: string): ParsedLine | null => {
    const trimmed = line.trim()
    if (!trimmed) return null

    // 最初のカンマだけを分割対象にする
    const firstCommaIndex = trimmed.indexOf(',')
    let candidate: WeightValueType

    if (firstCommaIndex > -1) {
      const weightStr = trimmed.slice(0, firstCommaIndex).trim()
      const contentStr = trimmed.slice(firstCommaIndex + 1).trim()
      const weight = Number.parseInt(weightStr, 10)

      if (!Number.isNaN(weight)) {
        candidate = { weight, content: contentStr }
      } else {
        candidate = { weight: 1, content: trimmed }
      }
    } else {
      candidate = { weight: 1, content: trimmed }
    }

    const result = WeightValueSchema.safeParse(candidate)

    return {
      ...candidate,
      hasError: !result.success,
    }
  }

  // プレビューアイテム
  const previewItems = computed(() =>
    textContent.value
      .split('\n')
      .map(parseAndValidateLine)
      .filter((item): item is ParsedLine => item !== null)
  )

  // バリデーション状態
  const hasErrors = computed(() => previewItems.value.some((item) => item.hasError))
  const validItemsCount = computed(() => previewItems.value.filter((item) => !item.hasError).length)
  const errorCount = computed(() => previewItems.value.filter((item) => item.hasError).length)

  // テキストから値に変換
  const convertTextToValues = (): WeightValuesArrayType => {
    return previewItems.value
      .filter((item) => !item.hasError)
      .map(({ weight, content }) => {
        // 重みが1の場合は文字列として返す（スキーマの変換ロジックに合わせる）
        return weight === 1 ? content : { weight, content }
      })
  }

  return {
    textContent,
    lineCount,
    hasErrors,
    validItemsCount,
    errorCount,
    initializeText,
    convertTextToValues,
  }
}
