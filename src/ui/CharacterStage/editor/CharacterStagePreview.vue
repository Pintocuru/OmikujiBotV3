<!-- src/ui/CharacterStage/editor/CharacterStagePreview.vue -->
<template>
  <HudPreview maxHeightClass="h-72" :defaultScale="0.5">
    <!-- 画面に見立てた枠(本番は画面全体。位置は % なので、枠が違っても相対的な位置は同じ) -->
    <div class="relative w-full h-full overflow-hidden">
      <!-- 既定の位置レンジ(キャラの中心 X / 下辺 Y が、この範囲に出る) -->
      <div class="absolute border border-dashed border-white/70 bg-white/10 pointer-events-none" :style="rangeStyle" />

      <CharacterStageLayer :items="items" @remove="remove" />

      <div
        v-if="!canPreview"
        class="absolute inset-0 flex items-center justify-center text-sm italic text-white/80 pointer-events-none"
      >
        画像のあるキャラクターがありません
      </div>
    </div>

    <template #hudLeft>
      <select
        v-if="canPreview"
        v-model="selectedKey"
        class="select select-xs select-bordered max-w-40"
        title="プレビューに使うキャラクター(保存されません)"
      >
        <option v-for="c in characters" :key="c.key" :value="c.key">{{ c.name || c.displayName || c.key }}</option>
      </select>
    </template>

    <template #hud>
      <div class="flex items-center gap-1">
        <button class="btn btn-xs btn-ghost" :disabled="!canPreview" @click="spawn">🎲 登場</button>
        <button class="btn btn-xs btn-ghost" :disabled="items.length === 0" @click="hideAll">消す</button>
      </div>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import { CharacterStageSchema, type CharacterStageType } from '@/types/ui'
  import type { BotMessageSlotsType } from '@/types/generator'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'
  import CharacterStageLayer from '../CharacterStageLayer.vue'
  import { buildStageItem } from '../buildStageItem'
  import { resolveStageSlots } from '../resolveStageSlots'
  import type { StageItem } from '../types'

  // settings を渡さなければ、保存済みの UI 設定を使う(ScenarioStep のプレビュー用)
  // slots / characterKey / iconKey は ScenarioStep の message から渡る。本番と同じく slots が UI 設定より優先される
  const props = defineProps<{
    settings?: CharacterStageType
    slots?: BotMessageSlotsType
    characterKey?: string
    iconKey?: string
    message?: string // 使わない(UI プレビュー共通の props)
  }>()

  const { data } = storeToRefs(useOmikujiStore())
  const settings = computed(
    () => props.settings ?? CharacterStageSchema.parse(data.value.ui.settings.characterStage ?? {})
  )

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

  // 本番と同じ手順(resolveStageSlots → buildStageItem)で 1 枚出す。slots が空の項目は UI 設定の既定値
  const spawn = () => {
    const key = activeKey.value
    if (!key) return

    const emotion = resolveEmotion(key, props.iconKey || 'default')
    const layers = iconSrc(key, emotion)
    if (layers.length === 0) return

    const visible = items.value.filter((i) => i.display.visible)
    visible.slice(0, Math.max(0, visible.length - (MAX_ITEMS - 1))).forEach((i) => hide(i.id))

    const spec = resolveStageSlots(props.slots, settings.value)
    const item = buildStageItem({
      id: `preview-${++counter}`,
      layers,
      animation: getCharacter(key)?.image[emotion]?.animation,
      spec,
      characterSize: settings.value.characterSize,
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

  watch(() => [settings.value, props.slots, props.iconKey], respawn, { deep: true })
  watch(activeKey, respawn)
  onMounted(spawn)

  onUnmounted(() => {
    if (respawnTimer) clearTimeout(respawnTimer)
    items.value.forEach((i) => clearTimers(i.id))
  })

  // 位置レンジの目印。Y は下辺基準なので、枠の下辺が Y の位置になる
  const rangeStyle = computed(() => {
    const { xMin, xMax, yMin, yMax } = settings.value
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
