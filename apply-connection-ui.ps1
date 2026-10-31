# ============================================================
# apply-connection-ui.ps1
# OmikujiBotV3 「接続表示UI」(events / mikuji / scenarios) 適用スクリプト
#
# 使い方:
#   1. リポジトリルート (OmikujiBotV3/) にこのファイルを置く
#   2. PowerShell で実行:  pwsh -ExecutionPolicy Bypass -File .\apply-connection-ui.ps1
#      (Windows PowerShell 5.1 でも動きますが、その場合この .ps1 を
#       「UTF-8 with BOM」で保存してください。pwsh 7 なら BOM 無し UTF-8 で OK)
#   3. 内容は8ファイルの「全文」をそのまま書き込みます
#      (BoxChoiceEditor / ContentArea / messageModules は上書きされるので、
#       先に git でブランチを切るか、変更をコミットしておいてください)
# ============================================================
$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$utf8 = [System.Text.UTF8Encoding]::new($false)

$files = [ordered]@{}

$files['src/editor/events/core/BoxChoiceEditor.vue'] = @'
<!-- src/editor/events/core/BoxChoiceEditor.vue -->
<!-- 誤って切り替わらないよう、プルダウンではなくダイアログで切り替える -->
<template>
  <SettingItem
    icon="Package"
    labelKey="eventCore.boxChoiceEditor.omikujiKey.label"
    descriptionKey="eventCore.boxChoiceEditor.omikujiKey.description"
  >
    <div class="w-full">
      <!-- 未接続のとき: 暗い背景で案内 -->
      <button
        v-if="!omikujiKey"
        class="btn w-full bg-neutral text-neutral-content border-dashed justify-start"
        @click="pickerOpen = true"
      >
        {{ t('connections.noBox') }}
      </button>

      <!-- 接続済みのとき -->
      <div v-else class="flex flex-wrap items-center gap-2">
        <button class="btn btn-sm btn-outline gap-1" @click="pickerOpen = true">
          <Package class="w-4 h-4 shrink-0" />
          <span class="max-w-[16rem] truncate">{{ box?.name || omikujiKey }}</span>
        </button>
        <span v-if="!box" class="text-xs text-warning">
          {{ t('connections.boxMissing', { key: omikujiKey }) }}
        </span>
        <a class="link link-hover text-xs" @click="goToBox">{{ t('connections.editLink') }}</a>
      </div>

      <MikujiPickerDialog
        v-model:open="pickerOpen"
        :selectedKey="omikujiKey || undefined"
        @select="omikujiKey = $event"
      />
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Package } from 'lucide-vue-next'
  import { BaseEventType } from '@/types/OmikujiData'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import MikujiPickerDialog from './MikujiPickerDialog.vue'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: BaseEventType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: BaseEventType]
  }>()

  const { getAsset } = useGetAssetData()
  const navigationStore = useNavigationStore()

  const pickerOpen = ref(false)

  const omikujiKey = computed({
    get: () => props.modelValue.omikujiKey,
    set: (value: string) => emit('update:modelValue', { ...props.modelValue, omikujiKey: value }),
  })

  const box = computed(() => (omikujiKey.value ? (getAsset('mikuji', omikujiKey.value) ?? null) : null))

  /** 名前・説明変更のため、該当するみくじ箱へ飛ぶ */
  const goToBox = () => {
    const key = omikujiKey.value
    if (!key) return
    navigationStore.selectCategory('mikuji')
    navigationStore.selectItem(key)
  }
</script>
'@

$files['src/editor/content/ContentArea.vue'] = @'
<!-- src/editor/content/ContentArea.vue -->
<template>
  <!-- カテゴリ帯 -->
  <div class="flex items-center justify-between px-4 py-3 bg-primary text-primary-content">
    <div class="flex items-center gap-2 text-lg font-bold">
      <component :is="currentIcon" class="w-6 h-6" />
      {{ t(`categories.${selectedCategory}.label`) }}
    </div>

    <div class="text-sm opacity-80">
      {{ t(`categories.${selectedCategory}.description`) }}
    </div>
  </div>

  <!-- データが0件のとき（Events / Assets）：新規作成を促す -->
  <NoParamsCard
    v-if="isEmpty"
    :key="selectedCategory"
    class="mt-4"
    :iconName="currentCategory.icon"
    :message="t('navigation.create.emptyMessage')"
    :sub="t('navigation.create.emptyHint')"
  />

  <template v-else>
    <!-- タブ（サブ項目）: 接続カテゴリ(events / mikuji / scenarios)は接続パネル付きヘッダーに置き換え -->
    <ConnectionHeader
      v-if="isConnectionCategory && tabs.length > 0"
      v-model:activeSection="activeSection"
      :tabs="tabs"
    />
    <ContentTabs v-else-if="tabs.length > 0" v-model:activeSection="activeSection" :tabs="tabs" />

    <component :is="currentEditor" />
  </template>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { CategoryType, eventCategory } from '@/types/OmikujiData'
  import { categoryMap } from '@/maps/OmikujiData'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import ContentTabs from './ContentTabs.vue'
  import ConnectionHeader from './ConnectionHeader.vue'
  import { useContentTabs } from './composables/useContentTabs'

  import CommentEventEditor from '@/editor/events/comment/CommentEditor.vue'
  import TimerEventEditor from '@/editor/events/timer/TimerEditor.vue'
  import ServiceEventEditor from '@/editor/events/service/ServiceEditor.vue'
  import ReactionEventEditor from '@/editor/events/reaction/ReactionEditor.vue'
  import PadEventEditor from '@/editor/events/pad/PadEditor.vue'

  import MikujiEditor from '@/editor/assets/mikuji/MikujiEditor.vue'
  import ScenariosEditor from '@/editor/assets/scenarios/ScenariosEditor.vue'
  import PlaceholderEditor from '@/editor/assets/placeholders/PlaceholderEditor.vue'
  import CharacterEditor from '@/editor/assets/characters/CharacterEditor.vue'

  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import UiEditor from '@/editor/ui/UiEditor.vue'
  import AppInfoEditor from '@/editor/apps/appInfo/AppInfoEditor.vue'
  import JsonMergeEditor from '@/editor/apps/JsonMerge/JsonMergeEditor.vue'
  import DataPacks from '@/editor/apps/dataPacks/DataPacks.vue'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const { t } = useI18n()
  const navigationStore = useNavigationStore()
  const { selectedCategory, isCurrentDataCategory, categoryArray } = storeToRefs(navigationStore)
  const { tabs, activeSection } = useContentTabs()

  // Events / Assets のカテゴリでデータが1件もない
  const isEmpty = computed(() => isCurrentDataCategory.value && (categoryArray.value?.length ?? 0) === 0)

  // events + mikuji + scenarios は接続表示付きヘッダーを使う
  const connectionCategories = [...eventCategory, 'mikuji', 'scenarios'] as const
  const isConnectionCategory = computed(() =>
    (connectionCategories as readonly string[]).includes(selectedCategory.value)
  )

  const currentCategory = computed(() => categoryMap[selectedCategory.value])
  const currentIcon = computed(() => resolveLucideIcon(currentCategory.value?.icon))

  // エディターマップ
  const editorMap: Record<CategoryType, Component> = {
    jsonMerge: JsonMergeEditor,

    // events
    comments: CommentEventEditor,
    timers: TimerEventEditor,
    services: ServiceEventEditor,
    reactions: ReactionEventEditor,
    pads: PadEventEditor,

    // assets
    mikuji: MikujiEditor,
    scenarios: ScenariosEditor,
    placeholders: PlaceholderEditor,
    characters: CharacterEditor,

    //
    ui: UiEditor,
    dataPacks: DataPacks,
    appInfo: AppInfoEditor,
  } as const
  const currentEditor = computed(() => editorMap[selectedCategory.value])
</script>
'@

$files['src/editor/content/ConnectionHeader.vue'] = @'
<!-- src/editor/content/ConnectionHeader.vue -->
<!-- ContentTabs の代替。接続パネル + セクションタブ(events / mikuji / scenarios 向け) -->
<template>
  <div class="sticky top-0 z-10 bg-base-100">
    <!-- 接続パネル -->
    <div class="px-1 pt-2 pb-1">
      <!-- イベント: イベント → みくじ箱 → シナリオ -->
      <div v-if="mode === 'event'" class="rounded-box border border-base-300 bg-base-200/60 p-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-sm font-bold max-w-[14rem] truncate">{{ itemName }}</span>
          <ArrowRight class="w-4 h-4 opacity-60 shrink-0" />

          <!-- 接続済み -->
          <template v-if="box">
            <button class="btn btn-sm btn-outline gap-1" @click="pickerOpen = true">
              <Package class="w-4 h-4 shrink-0" />
              <span class="max-w-[12rem] truncate">{{ box.name || box.key }}</span>
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
        <div v-if="!box" class="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-neutral text-neutral-content px-3 py-2">
          <span class="text-sm">{{ t('connections.noBoxHint') }}</span>
          <button class="btn btn-xs btn-primary" @click="pickerOpen = true">{{ t('connections.chooseBox') }}</button>
          <button class="btn btn-xs btn-outline btn-primary" @click="createAndConnect">
            {{ t('connections.createBox') }}
          </button>
        </div>
      </div>

      <!-- みくじ箱: 左=接続されたイベント / 右=接続されたシナリオ -->
      <div v-else-if="mode === 'mikuji'" class="rounded-box border border-base-300 bg-base-200/60 p-3 grid gap-3 md:grid-cols-2">
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
'@

$files['src/editor/content/composables/useOmikujiConnections.ts'] = @'
// src/editor/content/composables/useOmikujiConnections.ts
import { eventCategory, type EventCategoryType } from '@/types/OmikujiData/'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'

/** 接続表示に使う最小限の参照形 */
export type EventRef = { category: EventCategoryType; id: string; name: string }
export type AssetRef = { key: string; name: string }

/**
 * イベント ↔ みくじ箱 ↔ シナリオ の参照関係を計算する。
 * すべて OmikujiStore から読むため、編集結果は即座に反映される。
 */
export function useOmikujiConnections() {
  const { getEvents } = useGetEventData()
  const { getAssets, getAsset } = useGetAssetData()

  /** みくじ箱に接続されているイベント一覧(全イベント種別から逆引き) */
  const connectedEvents = (mikujiKey: string): EventRef[] =>
    eventCategory.flatMap((category) =>
      [...getEvents(category)]
        .filter((event) => event.omikujiKey === mikujiKey)
        .map((event) => ({ category, id: event.id, name: event.name || event.id }))
    )

  /** みくじ箱が参照しているシナリオ一覧(kind === 'steps' の stepKey) */
  const connectedScenarios = (mikujiKey: string): AssetRef[] => {
    const box = getAsset('mikuji', mikujiKey)
    const keys = new Set<string>()
    for (const item of box?.omikuji ?? []) {
      if (item.kind === 'steps' && item.stepKey) keys.add(item.stepKey)
    }
    return [...keys].map((key) => ({ key, name: getAsset('scenarios', key)?.name || key }))
  }

  /** シナリオの参照元(みくじ箱 / 他のシナリオ)。複数から参照される場合もある */
  const scenarioSources = (scenarioKey: string): { mikuji: AssetRef[]; scenarios: AssetRef[] } => {
    const mikuji: AssetRef[] = []
    for (const [key, box] of Object.entries(getAssets('mikuji'))) {
      if (box.omikuji?.some((item) => item.kind === 'steps' && item.stepKey === scenarioKey)) {
        mikuji.push({ key, name: box.name || key })
      }
    }

    const scenarios: AssetRef[] = []
    for (const [key, scenario] of Object.entries(getAssets('scenarios'))) {
      if (key === scenarioKey) continue
      const isCalled = scenario.steps?.some(
        (step) =>
          step.kind === 'scenarioCall' &&
          step.callKeys.some((value) => (typeof value === 'string' ? value === scenarioKey : value.content === scenarioKey))
      )
      if (isCalled) scenarios.push({ key, name: scenario.name || key })
    }

    return { mikuji, scenarios }
  }

  return { connectedEvents, connectedScenarios, scenarioSources }
}
'@

$files['src/editor/events/core/MikujiPickerDialog.vue'] = @'
<!-- src/editor/events/core/MikujiPickerDialog.vue -->
<!-- 誤操作防止のため、プルダウンではなくダイアログでみくじ箱を切り替える -->
<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle" @close="handleDialogClose">
    <div class="modal-box max-w-2xl">
      <div class="flex items-center justify-between pb-2">
        <h3 class="text-lg font-bold">{{ t('connections.picker.title') }}</h3>
        <button class="btn btn-sm btn-circle btn-ghost" @click="close">
          <X :size="16" />
        </button>
      </div>

      <div class="max-h-[55vh] overflow-y-auto space-y-2 py-2">
        <div v-if="boxList.length === 0" class="rounded-lg bg-neutral text-neutral-content p-4 text-sm">
          {{ t('connections.picker.empty') }}
        </div>

        <div
          v-for="box in boxList"
          :key="box.key"
          class="rounded-lg border p-3"
          :class="box.key === selectedKey ? 'border-primary bg-primary/5' : 'border-base-300'"
        >
          <div class="flex items-center gap-2">
            <Package class="w-4 h-4 shrink-0" />
            <span class="font-bold truncate">{{ box.name || box.key }}</span>
          </div>
          <div class="text-xs opacity-60 mt-1 break-all">key: {{ box.key }}</div>
          <div class="text-sm mt-1">{{ box.description || t('connections.picker.noDescription') }}</div>
          <div class="text-xs opacity-60 mt-1">
            {{ t('connections.picker.eventsCount', { count: connectedEvents(box.key).length }) }} /
            {{ t('connections.picker.scenariosCount', { count: connectedScenarios(box.key).length }) }}
          </div>
          <div class="flex gap-2 mt-2">
            <button class="btn btn-xs btn-primary" @click="handleSelect(box.key)">
              {{ t('connections.picker.select') }}
            </button>
            <button class="btn btn-xs btn-ghost" @click="goToBox(box.key)">
              {{ t('connections.picker.edit') }}
            </button>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <button v-if="selectedKey" class="btn btn-sm btn-ghost" @click="handleSelect('')">
          {{ t('connections.picker.unlink') }}
        </button>
        <button class="btn btn-sm btn-primary" @click="createAndSelect">
          {{ t('connections.picker.create') }}
        </button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop"><button @click="close">close</button></form>
  </dialog>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Package, X } from 'lucide-vue-next'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useOmikujiConnections } from '@/editor/content/composables/useOmikujiConnections'

  const { t } = useI18n()

  const props = defineProps<{
    open: boolean
    selectedKey?: string
  }>()

  const emit = defineEmits<{
    select: [key: string]
    'update:open': [open: boolean]
  }>()

  const { addAsset } = useOmikujiStore()
  const { getAssets } = useGetAssetData()
  const navigationStore = useNavigationStore()
  const { connectedEvents, connectedScenarios } = useOmikujiConnections()

  const dialogRef = ref<HTMLDialogElement | null>(null)

  const boxList = computed(() =>
    Object.values(getAssets('mikuji')).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  )

  watch(
    () => props.open,
    (open) => {
      if (open) dialogRef.value?.showModal()
      else dialogRef.value?.close()
    }
  )

  const close = () => emit('update:open', false)
  const handleDialogClose = () => close()

  const handleSelect = (key: string) => {
    emit('select', key)
    close()
  }

  /** 新しいみくじ箱を作成して、すぐ接続する */
  const createAndSelect = () => {
    const key = addAsset('mikuji')
    emit('select', key)
    close()
  }

  /** 名前・説明変更のため、該当するみくじ箱へ飛ぶ */
  const goToBox = (key: string) => {
    close()
    navigationStore.selectCategory('mikuji')
    navigationStore.selectItem(key)
  }
</script>
'@

$files['src/editor/assets/scenarios/ScenarioConnectDialog.vue'] = @'
<!-- src/editor/assets/scenarios/ScenarioConnectDialog.vue -->
<!-- 参照元のないシナリオを、みくじ箱に追加して接続を作るダイアログ -->
<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle" @close="handleDialogClose">
    <div class="modal-box max-w-xl">
      <div class="flex items-center justify-between pb-2">
        <h3 class="text-lg font-bold">{{ t('connections.connectDialog.title') }}</h3>
        <button class="btn btn-sm btn-circle btn-ghost" @click="close">
          <X :size="16" />
        </button>
      </div>
      <p class="text-sm opacity-70">{{ t('connections.connectDialog.hint') }}</p>

      <div class="max-h-[55vh] overflow-y-auto space-y-2 py-2">
        <div v-if="boxList.length === 0" class="rounded-lg bg-neutral text-neutral-content p-4 text-sm">
          {{ t('connections.connectDialog.empty') }}
        </div>

        <div v-for="box in boxList" :key="box.key" class="rounded-lg border border-base-300 p-3">
          <div class="font-bold truncate">{{ box.name || box.key }}</div>
          <div class="text-xs opacity-60 mt-1 break-all">key: {{ box.key }}</div>
          <button class="btn btn-xs btn-primary mt-2" @click="connect(box)">
            {{ t('connections.connectDialog.connect') }}
          </button>
        </div>
      </div>

      <div class="modal-action">
        <button class="btn btn-sm btn-ghost" @click="close">{{ t('connections.connectDialog.cancel') }}</button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop"><button @click="close">close</button></form>
  </dialog>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { X } from 'lucide-vue-next'
  import { OmikujiItemSchema, type MikujiBoxType } from '@/types/OmikujiData/'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'

  const { t } = useI18n()

  const props = defineProps<{
    open: boolean
    scenarioKey: string
  }>()

  const emit = defineEmits<{
    'update:open': [open: boolean]
    connected: [mikujiKey: string]
  }>()

  const { updateAsset } = useOmikujiStore()
  const { getAssets } = useGetAssetData()

  const dialogRef = ref<HTMLDialogElement | null>(null)

  const boxList = computed(() =>
    Object.values(getAssets('mikuji')).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  )

  watch(
    () => props.open,
    (open) => {
      if (open) dialogRef.value?.showModal()
      else dialogRef.value?.close()
    }
  )

  const close = () => emit('update:open', false)
  const handleDialogClose = () => close()

  /** 選択した箱の末尾に、このシナリオを実行するおみくじアイテムを追加する */
  const connect = (box: MikujiBoxType) => {
    if (!props.scenarioKey) return
    const item = OmikujiItemSchema.parse({ kind: 'steps', stepKey: props.scenarioKey })
    updateAsset('mikuji', box.key, { ...box, omikuji: [...(box.omikuji ?? []), item] })
    emit('connected', box.key)
    close()
  }
</script>
'@

$files['src/i18n/editor/content/ConnectionMessages.ts'] = @'
// src/i18n/editor/content/ConnectionMessages.ts
export const connectionMessages = {
  ja: {
    connections: {
      noBox: '接続がありません…',
      boxMissing: '「{key}」は存在しません',
      noBoxHint: 'みくじ箱を選択するか、新しく作成してください。',
      chooseBox: 'みくじ箱を選ぶ',
      createBox: '新しいみくじ箱を作成する',
      editLink: '編集に移動',
      linkedEvents: '接続されたイベント',
      linkedScenarios: '接続されたシナリオ',
      noEvents: '接続されたイベントはありません…',
      noScenarios: '接続されたシナリオはありません…',
      sources: '参照元',
      noSources: 'どこからも参照されてないようです…',
      connectOmikuji: 'おみくじと接続する',
      picker: {
        title: 'みくじ箱を選択',
        empty: 'みくじ箱がありません…',
        noDescription: '説明はありません',
        select: '選択',
        unlink: '接続を解除',
        create: '新しいみくじ箱を作成する',
        edit: '編集へ',
        eventsCount: 'イベント {count}件',
        scenariosCount: 'シナリオ {count}件',
      },
      connectDialog: {
        title: 'おみくじ箱に追加',
        hint: '選択した箱に、このシナリオがおみくじアイテムとして追加されます。',
        connect: '追加する',
        empty: '追加できるみくじ箱がありません…',
        cancel: '閉じる',
      },
    },
  },
  en: {
    connections: {
      noBox: 'No connection…',
      boxMissing: '"{key}" does not exist',
      noBoxHint: 'Pick an omikuji box or create a new one.',
      chooseBox: 'Choose a box',
      createBox: 'Create a new omikuji box',
      editLink: 'Open editor',
      linkedEvents: 'Connected events',
      linkedScenarios: 'Connected scenarios',
      noEvents: 'No connected events…',
      noScenarios: 'No connected scenarios…',
      sources: 'Referenced by',
      noSources: 'Nothing references this scenario…',
      connectOmikuji: 'Connect to a box',
      picker: {
        title: 'Select an omikuji box',
        empty: 'No omikuji boxes yet…',
        noDescription: 'No description',
        select: 'Select',
        unlink: 'Disconnect',
        create: 'Create a new omikuji box',
        edit: 'Edit',
        eventsCount: '{count} event(s)',
        scenariosCount: '{count} scenario(s)',
      },
      connectDialog: {
        title: 'Add to an omikuji box',
        hint: 'This scenario will be appended as an omikuji item of the selected box.',
        connect: 'Add',
        empty: 'No omikuji boxes to add…',
        cancel: 'Close',
      },
    },
  },
} as const
'@

$files['src/i18n/editor/messageModules.ts'] = @'
// src/i18n/editor/messageModules.ts
// i18n に取り込む翻訳ファイルの一覧。
// import.meta.glob (Vite 専用) の代わりに明示的に import している (Vite / webpack の両方で動かすため)。
// src/i18n/editor 配下に翻訳ファイルを追加したら、ここにも1行追加すること。
// (ナビゲーション用の Map など、翻訳ではないファイルは src/editor/maps に置き、ここには載せない)

import * as m_OmikujiDataMaps from './OmikujiDataMaps'
import * as m_apps_AppInfoEditor from './apps/AppInfoEditor'
import * as m_apps_AppItemsCharacters from './apps/AppItemsCharacters'
import * as m_apps_BaseSettingsEditor from './apps/BaseSettingsEditor'
import * as m_apps_PackageMetaMessages from './apps/PackageMetaMessages'
import * as m_assets_OmikujiItemMessages from './assets/OmikujiItemMessages'
import * as m_assets_PlaceholderMessages from './assets/PlaceholderMessages'
import * as m_assets_ScenarioStep from './assets/ScenarioStep'
import * as m_category_CategorySectionMessagesMap from './category/CategorySectionMessagesMap'
import * as m_category_NavigationSidebarMessagesMap from './category/NavigationSidebarMessagesMap'
import * as m_content_ConnectionMessages from './content/ConnectionMessages'
import * as m_events_CommentEditor from './events/CommentEditor'
import * as m_events_CommentTriggerEditor from './events/CommentTriggerEditor'
import * as m_events_EventCore from './events/EventCore'
import * as m_events_EventTriggers from './events/EventTriggers'
import * as m_events_PadEditor from './events/PadEditor'
import * as m_events_ReactionEditor from './events/ReactionEditor'
import * as m_events_TriggerAccess from './events/TriggerAccess'
import * as m_events_TriggerComment from './events/TriggerComment'
import * as m_events_TriggerExpression from './events/TriggerExpression'
import * as m_events_TriggerGift from './events/TriggerGift'
import * as m_events_TriggerUsername from './events/TriggerUsername'
import * as m_helpers_keyEditorMessages from './helpers/keyEditorMessages'
import * as m_shell_ShellMessages from './shell/ShellMessages'
import * as m_ui_UiSettingsMessages from './ui/UiSettingsMessages'

export const messageModules: Record<string, Record<string, unknown>> = {
  'OmikujiDataMaps': m_OmikujiDataMaps,
  'apps/AppInfoEditor': m_apps_AppInfoEditor,
  'apps/AppItemsCharacters': m_apps_AppItemsCharacters,
  'apps/BaseSettingsEditor': m_apps_BaseSettingsEditor,
  'apps/PackageMetaMessages': m_apps_PackageMetaMessages,
  'assets/OmikujiItemMessages': m_assets_OmikujiItemMessages,
  'assets/PlaceholderMessages': m_assets_PlaceholderMessages,
  'assets/ScenarioStep': m_assets_ScenarioStep,
  'category/CategorySectionMessagesMap': m_category_CategorySectionMessagesMap,
  'category/NavigationSidebarMessagesMap': m_category_NavigationSidebarMessagesMap,
  'content/ConnectionMessages': m_content_ConnectionMessages,
  'events/CommentEditor': m_events_CommentEditor,
  'events/CommentTriggerEditor': m_events_CommentTriggerEditor,
  'events/EventCore': m_events_EventCore,
  'events/EventTriggers': m_events_EventTriggers,
  'events/PadEditor': m_events_PadEditor,
  'events/ReactionEditor': m_events_ReactionEditor,
  'events/TriggerAccess': m_events_TriggerAccess,
  'events/TriggerComment': m_events_TriggerComment,
  'events/TriggerExpression': m_events_TriggerExpression,
  'events/TriggerGift': m_events_TriggerGift,
  'events/TriggerUsername': m_events_TriggerUsername,
  'helpers/keyEditorMessages': m_helpers_keyEditorMessages,
  'shell/ShellMessages': m_shell_ShellMessages,
  'ui/UiSettingsMessages': m_ui_UiSettingsMessages,
}
'@

foreach ($entry in $files.GetEnumerator()) {
  # この .ps1 が CRLF 化していても、出力は必ず LF に正規化する
  $content = $entry.Value -replace "`r`n", "`n"
  $dest = Join-Path $root $entry.Key
  $dir = Split-Path $dest -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($dest, $content, $utf8)
  Write-Host ("OK  " + $entry.Key)
}
Write-Host ''
Write-Host 'done. (8 files written)'