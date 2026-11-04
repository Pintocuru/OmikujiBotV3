<!-- src/ui/StreamCounter/editor/StreamCounterEditor.vue -->
<template>
  <!-- プレビュー -->
  <StreamCounterPreview :streamCounter="streamCounter" :variable-labels="previewVariableLabels" />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="streamCounter.component"
    :options="componentOptions"
    @update:modelValue="(val) => updateField('component', val)"
  />

  <!-- 配色 -->
  <CounterColorEditor :colors="streamCounter.color" @update:colors="(v) => updateField('color', v)" />

  <CounterSelectorPanel
    :counters="counters"
    :max-counters="maxCounters"
    @add="handleAdd"
    @remove="handleRemove"
    @reset="handleReset"
    @reorder="handleReorder"
    @update="handleUpdate"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { StreamCounterSchema, StreamCounterVariablesSchema } from '@/types/ui'
  import type { StreamDefaultKey, StreamCounterType } from '@/types/ui'
  import StreamCounterPreview from './StreamCounterPreview.vue'
  import CounterColorEditor from './CounterColorEditor.vue'
  import { getStreamCounterComponent, getStreamCounterComponentSets } from '../StreamCounterRegistry'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import CounterSelectorPanel from './CounterSelector/CounterSelectorPanel.vue'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import { CounterItem } from './CounterSelector/counterTypes'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const streamCounter = computed(() => data.value.ui.settings.streamCounter ?? StreamCounterSchema.parse({}))

  const updateField = (field: keyof StreamCounterType, value: unknown) => {
    omikujiStore.updateItemSettings('streamCounter', {
      ...streamCounter.value,
      [field]: value,
    })
  }

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const componentOptions = computed(() => {
    const options: Record<string, { label: string }> = {}
    const currentId = streamCounter.value.component
    if (!getStreamCounterComponent(currentId)) options[currentId] = { label: `未登録: ${currentId}` }
    for (const set of Object.values(getStreamCounterComponentSets())) {
      for (const [id, definition] of Object.entries(set)) options[id] = { label: definition.label }
    }
    return options
  })

  const resetField = (field: keyof StreamCounterType) => {
    updateField(field, StreamCounterSchema.parse({})[field])
  }

  // ---- CounterSelectorPanel 用に3フィールドを CounterItem[] に統合 ----
  const counters = computed<CounterItem[]>(() => [
    // デフォルトのカウンター
    ...streamCounter.value.defaultCounters.map((target) => ({
      id: `default:${target}`,
      type: 'default' as const,
      target,
    })),
    // 評価ブロックカウンター
    ...streamCounter.value.variableCounters, // StreamCounterVariablesSchema[] がそのまま CounterItem と互換
  ])

  const maxCounters = 24

  const handleReorder = (list: CounterItem[]) => {
    const defaultCounters: StreamDefaultKey[] = []
    const variableCounters: typeof streamCounter.value.variableCounters = []

    for (const item of list) {
      if (item.type === 'default') {
        defaultCounters.push(item.target as StreamDefaultKey)
      } else {
        // id一致で元データ拾う
        const found = streamCounter.value.variableCounters.find((v) => v.id === item.id)
        if (found) variableCounters.push(found)
      }
    }

    updateField('defaultCounters', defaultCounters)
    updateField('variableCounters', variableCounters)
  }

  const previewVariableLabels = computed<Record<string, string>>(() =>
    Object.fromEntries(streamCounter.value.variableCounters.map((c) => [c.target, c.label]))
  )

  // ---- CounterSelectorPanel イベントハンドラ ----
  const handleAdd = (item: Omit<CounterItem, 'id'>) => {
    if (item.type === 'default') {
      updateField('defaultCounters', [...streamCounter.value.defaultCounters, item.target as StreamDefaultKey])
    } else {
      // variable: スキーマの parse で id を生成
      const newItem = StreamCounterVariablesSchema.parse({
        target: item.target,
        label: item.label,
      })
      updateField('variableCounters', [...streamCounter.value.variableCounters, newItem])
    }
  }

  const handleRemove = (id: string) => {
    // variable は UUID なので prefix なし
    if (streamCounter.value.variableCounters.some((v) => v.id === id)) {
      updateField(
        'variableCounters',
        streamCounter.value.variableCounters.filter((v) => v.id !== id)
      )
      return
    }
    // default は `type:target` の固定ID から復元
    const [type, target] = id.split(':')
    if (type === 'default') {
      updateField(
        'defaultCounters',
        streamCounter.value.defaultCounters.filter((k) => k !== target)
      )
    }
  }

  // CounterSelectorPanel は CookieCounter と共用のため、type を受け取る(StreamCounter は default のみ)
  const handleReset = (type: 'default' | 'event') => {
    if (type === 'default') resetField('defaultCounters')
  }

  const handleUpdate = (payload: { id: string; patch: { target: string; label: string } }) => {
    updateField(
      'variableCounters',
      streamCounter.value.variableCounters.map((v) => (v.id === payload.id ? { ...v, ...payload.patch } : v))
    )
  }
</script>
