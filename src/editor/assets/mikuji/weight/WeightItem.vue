<!-- src/editor/assets/mikuji/weight/WeightItem.vue -->
<template>
  <div
    class="flex items-center gap-2 text-xs bg-base-100 p-2 rounded shadow-sm hover:shadow-md transition-all cursor-pointer"
    :class="{ 'bg-primary text-primary-content': isSelected }"
    @click="$emit('select')"
  >
    <!-- ドラッグハンドル -->
    <div class="legend-drag-handle cursor-move shrink-0">
      <GripVertical class="w-4 h-4 text-base-content/40 hover:text-base-content/80" />
    </div>

    <!-- 色インジケーター -->
    <div class="w-4 h-4 rounded shrink-0" :style="{ backgroundColor: color }"></div>

    <!-- 情報 -->
    <div class="flex-1 min-w-0">
      <div class="truncate font-medium">
        {{ item.name || `アイテム` }}
      </div>
      {{ percentage }}%

      <!-- 実行するシナリオ(未接続・参照切れは警告色) -->
      <div v-if="item.kind === 'steps'" class="truncate text-[0.7rem]" :class="scenarioClass">
        {{ scenarioLabel }}
      </div>
      <div v-else class="truncate text-[0.7rem] opacity-60">{{ t('omikujiItem.scenario.controlShort') }}</div>

      <div class="text-base">
        <span v-if="item.lottery.isPriority" class="badge badge-xs badge-primary"> 優先 </span>
        <span v-if="!item.lottery.isPriority && item.lottery.criteria" class="badge badge-xs badge-secondary ml-1">
          条件
        </span>
      </div>
    </div>

    <!-- Weight編集 -->
    <div class="text-base" :class="{ 'text-base-content': isSelected }">
      <input
        v-if="!item.lottery.isPriority"
        type="number"
        :value="item.lottery.weight"
        @input="handleWeightUpdate"
        @click.stop
        min="0"
        step="1"
        class="input input-xs input-bordered w-16 shrink-0"
      />
    </div>

    <!-- メニュー -->
    <div class="ml-auto">
      <MenuDropdown @duplicate="$emit('duplicate')" @delete="$emit('delete')" @click.stop />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { OmikujiItemType } from '@/types/OmikujiData/'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import MenuDropdown from '@/editor/parts/MenuDropdown.vue'
  import { GripVertical } from 'lucide-vue-next'

  const props = defineProps<{
    item: OmikujiItemType
    color: string
    percentage: string
    isSelected: boolean
  }>()

  const { t } = useI18n()
  const { getAsset } = useGetAssetData()

  // 実行するシナリオの表示(未接続・参照切れは警告色)
  const scenarioState = computed(() => {
    if (props.item.kind !== 'steps') return { label: '', cls: '' }
    const key = props.item.stepKey
    if (!key) return { label: t('omikujiItem.scenario.noneShort'), cls: 'text-error font-bold' }
    const scenario = getAsset('scenarios', key)
    if (!scenario) return { label: t('omikujiItem.scenario.missingShort'), cls: 'text-error font-bold' }
    return { label: scenario.name || key, cls: 'opacity-70' }
  })
  const scenarioLabel = computed(() => scenarioState.value.label)
  const scenarioClass = computed(() => scenarioState.value.cls)

  const emit = defineEmits<{
    'update:weight': [weight: number]
    select: []
    duplicate: []
    delete: []
  }>()

  const handleWeightUpdate = (event: Event) => {
    const value = parseInt((event.target as HTMLInputElement).value)
    if (!isNaN(value) && value >= 0) {
      emit('update:weight', value)
    }
  }
</script>
