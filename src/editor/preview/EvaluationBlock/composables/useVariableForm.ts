// composables/useVariableForm.ts
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { parseVariableValue, VARIABLE_NAME_PATTERN, type VarValue } from '../evaluationStats'

export function useVariableForm(onSubmit: (key: string, value: VarValue) => void) {
  const { t } = useI18n()
  const key = ref('')
  const value = ref('')
  const error = ref('')

  function edit(k: string, v: VarValue) {
    key.value = k
    // 文字列は 'すいか' のように引用符つきで戻すと、数字だけの文字列も文字列のまま設定できる
    value.value = typeof v === 'string' ? `'${v}'` : String(v)
    error.value = ''
  }

  function submit() {
    const k = key.value.trim()
    if (!VARIABLE_NAME_PATTERN.test(k)) {
      error.value = t('editorPreview.evaluationBlock.errors.invalidKey')
      return
    }
    if (value.value.trim() === '') {
      error.value = t('editorPreview.evaluationBlock.errors.missingValue')
      return
    }
    // 引用符つきは常に文字列、それ以外は数値として読めれば数値
    onSubmit(k, parseVariableValue(value.value))
    error.value = ''
  }

  return { key, value, error, edit, submit }
}
