<!-- src/ui/CookieCounter/editor/CookieCounterEditor.vue -->
<template>
  <!-- プレビュー -->
  <CookieCounterPreview :cookieCounter="cookieCounter" :variable-labels="variableInput" />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="cookieCounter.component"
    :options="componentOptions"
    @update:modelValue="(val) => updateField('component', val)"
  />

  <!-- カラー設定 -->
  <SettingItem
    labelKey="uiSettings.common.color.label"
    descriptionKey="uiSettings.common.color.description"
    layout="vertical"
  >
    <ColorPicker :modelValue="cookieCounter.color" @update:modelValue="(val) => updateField('color', val)" />
  </SettingItem>

  <!-- キャラクター指定（maxCharacters が 1 以上のコンポーネントのみ。リセットで未選択に戻る） -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <SettingItem
      v-for="index in characterSlots"
      :key="index"
      :label="t('uiSettings.cookieCounter.character.label', { n: index + 1 })"
      :description="t('uiSettings.cookieCounter.character.description')"
      layout="vertical"
      :showReset="true"
      @reset="resetCharacter(index)"
    >
      <CharacterIconPicker
        :character-key="characterAt(index).characterKey"
        :icon-key="characterAt(index).iconKey"
        @select="(payload) => setCharacter(index, payload)"
      />
    </SettingItem>
  </div>

  <!-- カウンター設定 -->
  <CounterSelectorPanel
    :counters="counters"
    :max-counters="maxCounters"
    @add="pushCounter"
    @remove="removeCounter"
    @reset="(type) => updateCounters(counters.filter((c) => c.type !== type))"
    @reorder="updateCounters"
    @update="updateCounter"
  />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, reactive } from 'vue'
  import { storeToRefs } from 'pinia'
  import {
    CookieCounterSchema,
    CookieCounterCharacterSchema,
    CookieCounterCountersSchema,
    CookieCounterType,
  } from '@/types/ui'
  import { getCookieCounterComponent, getCookieCounterComponentSets } from '../CookieCounterRegistry'
  import CookieCounterPreview from './CookieCounterPreview.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'
  import CharacterIconPicker from '@/editor/parts/CharacterPicker/CharacterIconPicker.vue'
  import type { SelectPayload } from '@/editor/parts/CharacterPicker/types'

  import CounterSelectorPanel from '@/ui/StreamCounter/editor/CounterSelector/CounterSelectorPanel.vue'
  import { CounterItem } from '@/ui/StreamCounter/editor/CounterSelector/counterTypes'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { streamDefaultMap } from '@/maps/ui'

  const { data } = storeToRefs(useOmikujiStore())
  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()

  const variableInput = reactive({ target: '', label: '' })

  const cookieCounter = computed(() => data.value.ui.settings.cookieCounter ?? CookieCounterSchema.parse({}))
  const counters = computed(() =>
    cookieCounter.value.counters.map((counter) =>
      counter.type === 'default' ? { ...counter, label: streamDefaultMap[counter.target] } : counter
    )
  )
  const currentDefinition = computed(() => getCookieCounterComponent(cookieCounter.value.component))
  // 未登録のコンポーネントのときは、スキーマの上限(8)にする
  const maxCounters = computed(() => currentDefinition.value?.maxCounters ?? 8)
  // キャラクターの設定欄(未登録のコンポーネントのときは出さない)
  const characterSlots = computed(() =>
    Array.from({ length: currentDefinition.value?.maxCharacters ?? 0 }, (_, i) => i)
  )

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const componentOptions = computed(() => {
    const options: Record<string, { label: string }> = {}
    const currentId = cookieCounter.value.component
    if (!currentDefinition.value) options[currentId] = { label: t('uiSettings.common.unregistered', { id: currentId }) }
    for (const set of Object.values(getCookieCounterComponentSets())) {
      for (const [id, definition] of Object.entries(set)) options[id] = { label: t(definition.labelKey) }
    }
    return options
  })

  // ---- ストア更新 ----
  const updateField = (field: keyof CookieCounterType, value: unknown) => {
    omikujiStore.updateItemSettings('cookieCounter', { ...cookieCounter.value, [field]: value })
  }

  // ---- characters 更新 ----
  const characterAt = (index: number) => cookieCounter.value.characters[index] ?? CookieCounterCharacterSchema.parse({})

  // 指定の番号まで空で埋めて、その番号だけ差し替える
  const setCharacter = (index: number, payload: SelectPayload) => {
    const next = [...cookieCounter.value.characters]
    while (next.length <= index) next.push(CookieCounterCharacterSchema.parse({}))
    next[index] = CookieCounterCharacterSchema.parse(payload)
    updateField('characters', next)
  }

  const resetCharacter = (index: number) => setCharacter(index, { characterKey: '' })

  // counters 配列の全体を差し替える（並び替え・フィルタ共用）
  const updateCounters = (next: CounterItem[] | typeof counters.value) => updateField('counters', next)

  const updateCounter = (payload: { id: string; patch: { target: string; label: string } }) => {
    updateCounters(
      counters.value.map((c) => {
        if (c.id !== payload.id || c.type !== 'variable') return c
        return { ...c, ...payload.patch }
      })
    )
  }

  const removeCounter = (id: string) => updateCounters(counters.value.filter((c) => c.id !== id))

  const pushCounter = (payload: Parameters<typeof CookieCounterCountersSchema.parse>[0]) => {
    if (counters.value.length >= maxCounters.value) return
    try {
      updateCounters([...counters.value, CookieCounterCountersSchema.parse(payload)])
    } catch (e) {
      console.error('Failed to parse counter item:', e)
    }
  }
</script>
