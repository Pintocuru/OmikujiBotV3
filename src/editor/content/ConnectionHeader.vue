<!-- src/editor/content/ConnectionHeader.vue -->
<!-- ContentTabs の代替。接続パネル + セクションタブ(events / mikuji / scenarios 向け) -->
<template>
  <div class="sticky top-0 z-10 bg-base-100">
    <!-- 接続パネル -->
    <div class="px-1 pt-2 pb-1">
      <!-- イベント: イベント → みくじ箱 → シナリオ -->
      <div v-if="mode === 'event'" class="rounded-box border border-base-300 bg-base-200/60 p-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-sm font-bold max-w-56 truncate">{{ itemName }}</span>
          <ArrowRight class="w-4 h-4 opacity-60 shrink-0" />

          <!-- 接続済み -->
          <template v-if="box">
            <button class="btn btn-sm btn-outline gap-1" @click="pickerOpen = true">
              <Package class="w-4 h-4 shrink-0" />
              <span class="max-w-48 truncate">{{ box.name || box.key }}</span>
            </button>
            <a class="link link-hover text-xs" @click="goToBox(box.key)">{{ t('connections.editLink') }}</a>
            <template v-if="scenarios.length > 0">
              <ArrowRight class="w-4 h-4 opacity-60 shrink-0" />
              <button
                v-for="scenario in scenarios"
                :key="scenario.key"
                class="btn btn-xs btn-ghost border border-base-300"
                @click="goToScenario(scenario.key)"
              >
                {{ scenario.name }}
              </button>
            </template>
          </template>

          <!-- 未接続 / 参照切れ -->
          <button
            v-else
            class="btn btn-sm gap-1"
            :class="omikujiKey ? 'btn-warning' : 'btn-ghost border border-base-300'"
            @click="pickerOpen = true"
          >
            {{ omikujiKey ? t('connections.boxMissing', { key: omikujiKey }) : t('connections.noBox') }}
          </button>
        </div>

        <!-- 未接続のときの案内(暗い背景) -->
        <div
          v-if="!box"
          class="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-neutral text-neutral-content px-3 py-2"
        >
          <span class="text-sm">{{ t('connections.noBoxHint') }}</span>
          <button class="btn btn-xs btn-primary" @click="pickerOpen = true">{{ t('connections.chooseBox') }}</button>
          <button class="btn btn-xs btn-outline btn-primary" @click="createAndConnect">
            {{ t('connections.createBox') }}
          </button>
        </div>
      </div>

      <!-- みくじ箱: 左=接続されたイベント / 右=接続されたシナリオ -->
      <div
        v-else-if="mode === 'mikuji'"
        class="rounded-box border border-base-300 bg-base-200/60 p-3 grid gap-3 md:grid-cols-2"
      >
        <div>
          <div class="text-xs font-bold opacity-70 mb-1">{{ t('connections.linkedEvents') }}</div>
          <div v-if="linkedEvents.length === 0" class="rounded-lg bg-neutral text-neutral-content p-2 text-sm">
            {{ t('connections.noEvents') }}
          </div>
          <div v-else class="flex flex-wrap gap-1">
            <button
              v-for="event in linkedEvents"
              :key="event.category + event.id"
              class="btn btn-xs btn-outline gap-1"
              @click="goToEvent(event)"
            >
              <span class="badge badge-secondary badge-xs">{{ t(`categories.${event.category}.label`) }}</span>
              {{ event.name }}
            </button>
          </div>
        </div>
        <div>
          <div class="text-xs font-bold opacity-70 mb-1">{{ t('connections.linkedScenarios') }}</div>
          <div v-if="linkedScenarios.length === 0" class="rounded-lg bg-neutral text-neutral-content p-2 text-sm">
            {{ t('connections.noScenarios') }}
          </div>
          <div v-else class="flex flex-wrap gap-1">
            <button
              v-for="scenario in linkedScenarios"
              :key="scenario.key"
              class="btn btn-xs btn-outline"
              @click="goToScenario(scenario.key)"
            >
              {{ scenario.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- シナリオ: 参照元一覧(複数の可能性あり) -->
      <div v-else-if="mode === 'scenario'" class="rounded-box border border-base-300 bg-base-200/60 p-3">
        <div class="text-xs font-bold opacity-70 mb-1">{{ t('connections.sources') }}</div>
        <div v-if="hasSources" class="flex flex-wrap gap-1">
          <button
            v-for="source in sourceMikuji"
            :key="source.key"
            class="btn btn-xs btn-outline gap-1"
            @click="goToBox(source.key)"
          >
            <Package class="w-3.5 h-3.5" />
            {{ source.name }}
          </button>
          <button
            v-for="source in sourceScenarios"
            :key="source.key"
            class="btn btn-xs btn-outline"
            @click="goToScenario(source.key)"
          >
            {{ source.name }}
          </button>
        </div>
        <!-- どこからも参照されていないとき(暗い背景) -->
        <div v-else class="flex flex-wrap items-center gap-2 rounded-lg bg-neutral text-neutral-content px-3 py-2">
          <span class="text-sm">{{ t('connections.noSources') }}</span>
          <button class="btn btn-xs btn-primary" @click="connectOpen = true">
            {{ t('connections.connectOmikuji') }}
          </button>
        </div>

        <ScenarioConnectDialog v-model:open="connectOpen" :scenarioKey="selectedItemKey ?? ''" />
      </div>
    </div>

    <!-- セクションタブ(ContentTabs と同じ役割) -->
    <div role="tablist" class="tabs tabs-border tabs-lg flex-wrap">
      <button
        v-for="tab in tabs"
        :key="tab.section"
        role="tab"
        class="tab gap-2"
        :class="{ 'tab-active font-bold': tab.section === activeSection }"
        @click="activeSection = tab.section"
      >
        <component :is="resolveLucideIcon(tab.icon)" class="w-5 h-5 shrink-0" />
        {{ t(tab.labelKey) }}
      </button>
    </div>

    <!-- イベント用のみくじ箱切り替えダイアログ -->
    <MikujiPickerDialog
      v-if="mode === 'event'"
      v-model:open="pickerOpen"
      :selectedKey="omikujiKey || undefined"
      @select="onSelectBox"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { ArrowRight, Package } from 'lucide-vue-next'
  import { type EventCategoryType } from '@/types/OmikujiData/'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import { ContentTab } from '@/editor/types/apps'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useOmikujiConnections, type EventRef } from './composables/useOmikujiConnections'
  import MikujiPickerDialog from '@/editor/events/core/MikujiPickerDialog.vue'
  import ScenarioConnectDialog from '@/editor/assets/scenarios/ScenarioConnectDialog.vue'

  defineProps<{ tabs: ContentTab[] }>()

  // 選択中のタブ(SectionCard の sectionKey と同じ値)
  const activeSection = defineModel<string | null>('activeSection', { required: true })

  const { t } = useI18n()
  const navigationStore = useNavigationStore()
  const { selectedCategory, selectedItemKey } = storeToRefs(navigationStore)
  const { getEvent } = useGetEventData()
  const { getAsset } = useGetAssetData()
  const { updateEvent, addAsset } = useOmikujiStore()
  const { connectedEvents, connectedScenarios, scenarioSources } = useOmikujiConnections()

  const mode = computed<'event' | 'mikuji' | 'scenario' | null>(() => {
    const category = selectedCategory.value
    if (navigationStore.isEventCategory(category)) return 'event'
    if (category === 'mikuji') return 'mikuji'
    if (category === 'scenarios') return 'scenario'
    return null
  })

  /** イベント種別のときの選択中イベント */
  const currentEvent = computed(() => {
    if (mode.value !== 'event' || !selectedItemKey.value) return null
    return getEvent(selectedCategory.value as EventCategoryType, selectedItemKey.value) ?? null
  })

  const itemName = computed(() => currentEvent.value?.name || selectedItemKey.value || '')
  const omikujiKey = computed(() => currentEvent.value?.omikujiKey ?? '')
  const box = computed(() => (omikujiKey.value ? (getAsset('mikuji', omikujiKey.value) ?? null) : null))
  const scenarios = computed(() => (box.value ? connectedScenarios(box.value.key) : []))

  const pickerOpen = ref(false)
  const connectOpen = ref(false)

  /** みくじ箱種別のときの接続一覧 */
  const linkedEvents = computed(() =>
    mode.value === 'mikuji' && selectedItemKey.value ? connectedEvents(selectedItemKey.value) : []
  )
  const linkedScenarios = computed(() =>
    mode.value === 'mikuji' && selectedItemKey.value ? connectedScenarios(selectedItemKey.value) : []
  )

  /** シナリオ種別のときの参照元一覧 */
  const sources = computed(() =>
    mode.value === 'scenario' && selectedItemKey.value
      ? scenarioSources(selectedItemKey.value)
      : { mikuji: [], scenarios: [] }
  )
  const sourceMikuji = computed(() => sources.value.mikuji)
  const sourceScenarios = computed(() => sources.value.scenarios)
  const hasSources = computed(() => sourceMikuji.value.length > 0 || sourceScenarios.value.length > 0)

  /** イベントのみくじ箱をダイアログの選択結果で切り替える */
  const onSelectBox = (key: string) => {
    const event = currentEvent.value
    if (!event || mode.value !== 'event') return
    updateEvent(selectedCategory.value as EventCategoryType, event.id, { ...event, omikujiKey: key })
  }

  /** 新しいみくじ箱を作成して、すぐ接続する */
  const createAndConnect = () => {
    const key = addAsset('mikuji')
    onSelectBox(key)
  }

  /** 各アイテムへの移動 */
  const goToBox = (key: string) => {
    navigationStore.selectCategory('mikuji')
    navigationStore.selectItem(key)
  }
  const goToScenario = (key: string) => {
    navigationStore.selectCategory('scenarios')
    navigationStore.selectItem(key)
  }
  const goToEvent = (eventRef: EventRef) => {
    navigationStore.selectCategory(eventRef.category)
    navigationStore.selectItem(eventRef.id)
  }
</script>
