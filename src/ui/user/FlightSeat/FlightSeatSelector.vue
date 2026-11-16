<!-- src/ui/user/FlightSeat/FlightSeatSelector.vue -->
<template>
  <div
    class="flex"
    :class="framed ? 'card p-4 rounded-xl shadow-xl space-y-2' : 'bg-base-100 transparent-bg'"
    :style="frameStyle"
  >
    <component
      :is="currentComponent"
      v-if="currentComponent"
      :key="totalSeats"
      :color="settings.color"
      :seats="seats"
      :statKey="statKey"
      :customLayout="customLayout"
    />
    <div v-else-if="editorPreview && loadError" class="alert alert-error" role="alert">
      {{ $t(loadError.key, { id: loadError.id }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, shallowRef, watch, type Component } from 'vue'
  import type { UserStatsRecord } from '@/types/api'
  import type { FlightSeatStatKey, FlightSeatType } from '@/types/ui'
  import { getFlightSeatComponent } from './FlightSeatRegistry'
  import { notifyFlightSeatComponentIssue } from './notifyFlightSeatComponentIssue'

  const props = withDefaults(
    defineProps<{
      settings: FlightSeatType
      seats: (UserStatsRecord | null)[]
      statKey: FlightSeatStatKey | null
      totalSeats: number
      customLayout?: number[]
      editorPreview?: boolean
    }>(),
    { editorPreview: false }
  )

  // 枠(カード)で囲むかどうか(未登録のときは枠なし)
  const framed = computed(() => getFlightSeatComponent(props.settings.component)?.framed ?? false)

  // 枠の背景色と、枠の中の文字色(currentColor を使う飾りもこの色になる)
  const frameStyle = computed(() => ({
    color: props.settings.color.text,
    ...(framed.value ? { backgroundColor: props.settings.color.background } : {}),
    '--seat-bg': framed.value ? props.settings.color.background : 'transparent',
  }))

  // 未登録・読み込み失敗のときは null のまま(配信画面は無表示。わんコメへ一度だけ通知する)
  const currentComponent = shallowRef<Component | null>(null)
  const loadError = shallowRef<{ key: string; id: string } | null>(null)

  watch(
    () => props.settings.component,
    async (id) => {
      currentComponent.value = null
      loadError.value = null

      const definition = getFlightSeatComponent(id)
      if (!definition) {
        loadError.value = { key: 'uiSettings.common.loadError.unregistered', id }
        if (!props.editorPreview) {
          notifyFlightSeatComponentIssue(
            id,
            `フライトシートの表示タイプ「${id}」は、このバージョンには含まれていません`
          )
        }
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[FlightSeat] Component load failed: ${id}`, error)
        loadError.value = { key: 'uiSettings.common.loadError.loadFailed', id }
        if (!props.editorPreview) {
          notifyFlightSeatComponentIssue(id, `フライトシートの表示タイプ「${id}」の読み込みに失敗しました`)
        }
      }
    },
    { immediate: true }
  )
</script>
