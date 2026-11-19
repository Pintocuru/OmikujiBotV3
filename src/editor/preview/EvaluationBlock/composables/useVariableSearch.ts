// composables/useVariableSearch.ts
import { computed, ref, type Ref } from 'vue'
import { hasWildcard, summarizeByPattern, wildcardToRegExp, type VarEntry } from '../evaluationStats'

export function useVariableSearch(entries: Ref<VarEntry[]>) {
  const query = ref('')

  // * を含む検索は、変数名へのワイルドカード検索(集計つき)
  const isWildcardQuery = computed(() => hasWildcard(query.value))

  const filteredEntries = computed(() => {
    const q = query.value.trim()
    if (!q) return entries.value
    if (isWildcardQuery.value) {
      const regex = wildcardToRegExp(q)
      return entries.value.filter(([key]) => regex.test(key))
    }
    const lower = q.toLowerCase()
    return entries.value.filter(
      ([key, value]) => key.toLowerCase().includes(lower) || String(value).toLowerCase().includes(lower)
    )
  })

  const summary = computed(() => {
    if (!isWildcardQuery.value) return null
    const result = summarizeByPattern(entries.value, query.value)
    return result.matched > 0 ? result : null
  })

  return { query, filteredEntries, summary }
}
