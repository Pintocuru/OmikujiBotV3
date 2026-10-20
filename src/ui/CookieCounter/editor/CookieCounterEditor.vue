<!-- src/ui/CookieCounter/editor/CookieCounterEditor.vue -->
<template>
  <!-- プレビュー -->
  <CookieCounterPreview :cookieCounter="cookieCounter" :variable-labels="variableInput" />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="cookieCounter.component"
    :options="cookieComponentMap"
    @update:modelValue="(val) => updateField('component', val)"
  />

  <!-- カラー設定 -->
  <SettingItem label="カラー設定" description="表示するカラーを設定します" layout="vertical">
    <ColorPicker :modelValue="cookieCounter.color" @update:modelValue="(val) => updateField('color', val)" />
  </SettingItem>

  <!-- 画像パス指定（hasImage コンポーネントのみ） -->
  <template v-if="currentComponentDef.hasImage">
    <SettingItem label="メイン画像" description="1つ目に使う画像ファイルのパス">
      <input
        type="text"
        class="input input-bordered input-sm w-full"
        placeholder="images/sakura.webp"
        :value="cookieCounter.images.main"
        @change="updateImage('main', ($event.target as HTMLInputElement).value)"
      />
    </SettingItem>
    <SettingItem label="サブ画像" description="2つ目の画像パス。空欄ならメイン画像を使用">
      <input
        type="text"
        class="input input-bordered input-sm w-full"
        placeholder="空欄でメインと同じ画像"
        :value="cookieCounter.images.sub"
        @change="updateImage('sub', ($event.target as HTMLInputElement).value)"
      />
    </SettingItem>
  </template>

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
  import { computed, reactive } from 'vue'
  import { storeToRefs } from 'pinia'
  import { cookieComponentMap, CookieCounterSchema, CookieCounterCountersSchema, CookieCounterType } from '@/ui/types'
  import CookieCounterPreview from './CookieCounterPreview.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'

  import CounterSelectorPanel from '@/ui/StreamCounter/editor/CounterSelector/CounterSelectorPanel.vue'
  import { CounterItem } from '@/ui/StreamCounter/editor/CounterSelector/counterTypes'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const { data } = storeToRefs(useOmikujiStore())
  const omikujiStore = useOmikujiStore()

  const variableInput = reactive({ target: '', label: '' })

  const cookieCounter = computed(() => data.value.ui.settings.cookieCounter ?? CookieCounterSchema.parse({}))
  const counters = computed(() => cookieCounter.value.counters)
  const maxCounters = computed(() => cookieComponentMap[cookieCounter.value.component].maxCounters)
  const currentComponentDef = computed(() => cookieComponentMap[cookieCounter.value.component])

  // ---- ストア更新 ----
  const updateField = (field: keyof CookieCounterType, value: unknown) => {
    omikujiStore.updateItemSettings('cookieCounter', { ...cookieCounter.value, [field]: value })
  }

  // ---- images 更新 ----
  const updateImage = (key: keyof CookieCounterType['images'], value: string) => {
    updateField('images', { ...cookieCounter.value.images, [key]: value })
  }

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
