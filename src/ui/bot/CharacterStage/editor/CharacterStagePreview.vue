<!-- src/ui/CharacterStage/editor/CharacterStagePreview.vue -->
<template>
  <HudPreview maxHeightClass="h-72" :defaultScale="0.5">
    <div class="relative w-full h-full overflow-hidden">
      <!-- 位置レンジ(基準点が、この範囲に出る) -->
      <div class="absolute border border-dashed border-white/70 bg-white/10 pointer-events-none" :style="rangeStyle" />

      <CharacterStageLayer :items="items" :muted="false" @remove="remove" />

      <div
        v-if="!canPreview"
        class="absolute inset-0 flex items-center justify-center text-sm italic text-white/80 pointer-events-none"
      >
        {{ $t('uiSettings.characterStage.preview.noImageCharacter') }}
      </div>
    </div>

    <template #hud>
      <div class="flex items-center gap-1">
        <button class="btn btn-xs btn-ghost" :disabled="!canPreview" @click="spawn">
          {{ $t('uiSettings.characterStage.preview.spawn') }}
        </button>
        <button class="btn btn-xs btn-ghost" :disabled="items.length === 0" @click="hideAll">
          {{ $t('uiSettings.characterStage.preview.hideAll') }}
        </button>
      </div>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import type { BotMessageSlotsType } from '@/types/generator'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'
  import CharacterStageLayer from '../CharacterStageLayer.vue'
  import { buildStageItem } from '../buildStageItem'
  import { resolveStageSlots, STAGE_DEFAULTS } from '../resolveStageSlots'
  import type { StageItem } from '../types'

  // slots / characterKey / iconKey は ScenarioStep の message から渡る。空の slot は既定値(STAGE_DEFAULTS)になる
  const props = defineProps<{
    slots?: BotMessageSlotsType
    characterKey?: string
    iconKey?: string
    message?: string // 使わない(UI プレビュー共通の props)
  }>()

  // 重ねて出せる上限(「無期限」設定でも積み上がりすぎないように)
  const MAX_ITEMS = 5
  // Leave アニメーションが終わらなかった場合の保険(モーションの秒数に、この余裕を足した時間で取り除く)
  const FORCE_REMOVE_MARGIN = 1000
  // 設定を触り終えてから出し直すまでの待ち(スライダー操作中に連続で出さない)
  const RESPAWN_DELAY = 300

  const { characterArray, resolveEmotion, iconSrc, getCharacter, hasImage } = useCharacterLookup()

  // プレビューに使えるのは画像のあるキャラクターだけ
  const characters = computed(() => characterArray.value.filter((c) => hasImage(c.key)))
  const canPreview = computed(() => characters.value.length > 0)

  // 選択はプレビュー内だけの状態(保存しない)。初期値は step のキャラ。未選択・消えたキーなら先頭
  const selectedKey = ref(props.characterKey ?? '')
  watch(
    () => props.characterKey,
    (key) => (selectedKey.value = key ?? '')
  )
  const activeKey = computed(() =>
    characters.value.some((c) => c.key === selectedKey.value) ? selectedKey.value : (characters.value[0]?.key ?? '')
  )

  const items = ref<StageItem[]>([])
  const hideTimers = new Map<string, number>()
  const forceTimers = new Map<string, number>()
  let counter = 0
  let respawnTimer: number | undefined

  const clearTimers = (id: string) => {
    const hide = hideTimers.get(id)
    if (hide) clearTimeout(hide)
    hideTimers.delete(id)
    const force = forceTimers.get(id)
    if (force) clearTimeout(force)
    forceTimers.delete(id)
  }

  const remove = (id: string) => {
    clearTimers(id)
    items.value = items.value.filter((i) => i.id !== id)
  }

  // visible を false にして Leave アニメーションを始める(取り除くのは after-leave)
  const hide = (id: string) => {
    const item = items.value.find((i) => i.id === id)
    if (!item || !item.display.visible) return
    const timer = hideTimers.get(id)
    if (timer) clearTimeout(timer)
    hideTimers.delete(id)
    item.display.visible = false
    forceTimers.set(
      id,
      setTimeout(() => remove(id), item.motionDuration * 1000 + FORCE_REMOVE_MARGIN) as unknown as number
    )
  }

  const hideAll = () => items.value.filter((i) => i.display.visible).forEach((i) => hide(i.id))

  // 本番と同じ手順(resolveStageSlots → buildStageItem)で 1 枚出す
  const spawn = () => {
    const key = activeKey.value
    if (!key) return

    const emotion = resolveEmotion(key, props.iconKey || 'default')
    const layers = iconSrc(key, emotion)
    if (layers.length === 0) return

    const visible = items.value.filter((i) => i.display.visible)
    visible.slice(0, Math.max(0, visible.length - (MAX_ITEMS - 1))).forEach((i) => hide(i.id))

    const spec = resolveStageSlots(props.slots)
    const item = buildStageItem({
      id: `preview-${++counter}`,
      layers,
      animation: getCharacter(key)?.image[emotion]?.animation,
      spec,
      characterSize: STAGE_DEFAULTS.characterSize,
      z: counter,
    })
    if (spec.seconds > 0) {
      hideTimers.set(item.id, setTimeout(() => hide(item.id), spec.seconds * 1000) as unknown as number)
    }
    items.value.push(item)
  }

  // 設定やキャラを変えたら、いったん消して出し直す(変更がすぐ見える)
  const respawn = () => {
    if (respawnTimer) clearTimeout(respawnTimer)
    respawnTimer = setTimeout(() => {
      items.value.forEach((i) => clearTimers(i.id))
      items.value = []
      spawn()
    }, RESPAWN_DELAY) as unknown as number
  }

  watch(() => [props.slots, props.iconKey], respawn, { deep: true })
  watch(activeKey, respawn)
  onMounted(spawn)

  onUnmounted(() => {
    if (respawnTimer) clearTimeout(respawnTimer)
    items.value.forEach((i) => clearTimers(i.id))
  })

  // 位置レンジの目印(この投稿の slots から決まる、基準点が動く範囲)
  const rangeStyle = computed(() => {
    const { xMin, xMax, yMin, yMax } = resolveStageSlots(props.slots)
    return {
      left: `${xMin}%`,
      width: `${xMax - xMin}%`,
      top: `${yMin}%`,
      height: `${yMax - yMin}%`,
      minWidth: '2px',
      minHeight: '2px',
    }
  })
</script>
