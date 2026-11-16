<!-- src/ui/user/FlightSeat/editor/FlightSeatPreview.vue -->
<template>
  <HudPreview>
    <div class="overflow-hidden" :class="[fontFamily]">
      <FlightSeatSelector
        editorPreview
        :key="flightSeat.component"
        :settings="flightSeat"
        :seats="seats"
        :statKey="flightSeat.statKey"
        :totalSeats="totalSeats"
        :customLayout="parsedCustomLayout"
      />
    </div>

    <!-- 右下に表示するHUD（スケーリングされない） -->
    <template #hud>
      <div class="space-x-2">
        <div class="badge badge-sm badge-primary">
          {{ $t('uiSettings.flightSeat.preview.totalSeats', { n: totalSeats }) }}
        </div>
        <button class="btn btn-xs btn-primary" @click="addPreviewUser">
          {{ $t('uiSettings.flightSeat.preview.addUser') }}
        </button>
        <button class="btn btn-xs btn-warning" @click="resetSeats">
          {{ $t('uiSettings.flightSeat.preview.reset') }}
        </button>
      </div>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import { generateDummyUserStats } from '@/common/MockUser/MockGenerators'
  import type { UserStatsRecord } from '@/types/api'
  import type { FlightSeatType } from '@/types/ui'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import FlightSeatSelector from '../FlightSeatSelector.vue'
  import { useSeatManager } from '../composables/useSeatManager'
  import { useFlightSeatLayout } from '../composables/useFlightSeatLayout'

  const props = defineProps<{
    flightSeat: FlightSeatType
  }>()

  const omikujiStore = useOmikujiStore()
  const fontFamily = computed(() => useFontFamily(omikujiStore.data.ui.fontFamily ?? 'default'))

  const flightSeatRef = computed(() => props.flightSeat)
  const { totalSeats, parsedCustomLayout } = useFlightSeatLayout(flightSeatRef)

  // プレビュー用のダミーユーザー(userId ごとに作ったものを覚えておく)
  const dummyUsers = new Map<string, UserStatsRecord>()

  const resolveDummyUser = (userId: string) => {
    if (!dummyUsers.has(userId)) {
      dummyUsers.set(userId, { ...generateDummyUserStats(1)[0], userId })
    }
    return dummyUsers.get(userId)
  }

  const { seats, registerUser, resetSeats: resetSeatManager } = useSeatManager(totalSeats, resolveDummyUser)

  let previewUserCounter = 0

  // ダミーユーザーを 1 人着席させる
  const addPreviewUser = () => {
    previewUserCounter++
    const userId = `preview-user-${previewUserCounter}`
    registerUser(resolveDummyUser(userId)!)
  }

  const resetSeats = () => {
    dummyUsers.clear()
    previewUserCounter = 0
    resetSeatManager()
  }
</script>
