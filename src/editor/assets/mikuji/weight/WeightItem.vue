<!-- src/editor/assets/mikuji/weight/WeightItem.vue -->
<template>
  <div class="flex flex-wrap items-center gap-2">
    <!-- おみくじ本体(クリックで選択) -->
    <div
      class="flex flex-1 min-w-72 items-center gap-2 text-sm p-2 rounded shadow-sm hover:shadow-md transition-all cursor-pointer"
      :class="isSelected ? 'bg-primary text-primary-content' : 'bg-base-100'"
      @click="$emit('select')"
    >
      <!-- ドラッグハンドル -->
      <div class="legend-drag-handle cursor-move shrink-0">
        <GripVertical class="w-4 h-4 text-base-content/40 hover:text-base-content/80" />
      </div>

      <!-- 情報 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1">
          <span class="truncate">{{ item.name || 'アイテム' }}</span>
          <!-- 名前・説明の編集 -->
          <button
            class="btn btn-ghost btn-xs btn-square shrink-0"
            title="名前・説明を編集"
            @click.stop="openDialog('base')"
          >
            <Pencil class="w-3.5 h-3.5" />
          </button>
        </div>
        <div v-if="item.description" class="text-xs opacity-70 truncate">{{ item.description }}</div>

        <div class="mt-1 flex flex-wrap items-center gap-1">
          <span class="text-xs">{{ percentage }}%</span>

          <!-- 追加条件 -->
          <button class="btn btn-ghost btn-xs gap-1" @click.stop="openDialog('condition')">
            <Filter class="w-3 h-3" />
            追加条件
          </button>
          <span v-if="item.lottery.isPriority" class="badge badge-sm badge-primary">優先</span>
          <span v-else-if="item.lottery.criteria" class="badge badge-xs badge-secondary">条件</span>
        </div>
      </div>

      <!-- Weight編集 -->
      <div class="text-base shrink-0" :class="{ 'text-base-content': isSelected }">
        <input
          v-if="!item.lottery.isPriority"
          type="number"
          :value="item.lottery.weight"
          @input="handleWeightUpdate"
          @click.stop
          min="0"
          step="1"
          class="input input-xs input-bordered w-16"
        />
      </div>

      <!-- メニュー -->
      <div class="shrink-0" @click.stop>
        <MenuDropdown @duplicate="$emit('duplicate')" @delete="$emit('delete')" />
      </div>
    </div>

    <span class="shrink-0">→</span>

    <!-- 実行内容(シナリオ / 制御) -->
    <div class="flex">
      <button class="btn btn-sm btn-outline w-44 shrink-0 justify-start gap-1" @click="openDialog('run')">
        <Ban v-if="item.kind === 'control'" class="w-4 h-4 shrink-0" />
        <Zap v-else class="w-4 h-4 shrink-0" />
        <span class="truncate" :class="runState.cls">{{ runState.label }}</span>
      </button>
      <!-- シナリオ編集画面へ飛ぶボタン -->
      <button class="btn btn-xs btn-ghost gap-1" @click="goToScenario">
        <ExternalLink class="w-3.5 h-3.5" />
        {{ t('omikujiItem.scenario.edit') }}
      </button>
    </div>

    <!-- クールダウン(steps のみ) -->
    <label
      v-if="item.kind === 'steps'"
      class="input input-sm input-bordered flex w-28 shrink-0 items-center gap-1"
      title="クールダウン(秒)"
    >
      <Timer class="w-3.5 h-3.5 shrink-0 opacity-60" />
      <input
        type="number"
        class="min-w-0 grow"
        :value="item.cooldownSeconds ?? 0"
        min="0"
        step="0.1"
        @change="updateCooldown"
      />
      <span class="text-xs opacity-60">秒</span>
    </label>
    <div v-else class="w-28 shrink-0 text-center opacity-40">-</div>

    <!-- ダイアログ(開いたときだけ作る) -->
    <BaseDialog
      v-if="openedDialog === 'base'"
      :open="true"
      icon="Pencil"
      title="名前・説明"
      size="xl"
      @update:open="closeDialog"
    >
      <div class="space-y-2">
        <!-- 型 '{ id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; lottery: { isPriority: true; weight: number; criteria: { conditions: $InferEnumOutput<{ username: "username"; ... 5 more ...; expression: "expression"; }>[]; ... 6 more ...; expression: string; }; } | { ...; }; kind: ...' を型 '{ id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; order: number; isEnabled: boolean; tagColor: $InferEnumOutput<{ error: "error"; success: "success"; primary: "primary"; ... 4 more ...; warning: "warning"; }>; tags: string[]; }' に割り当てることはできません。
  型 '{ id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; lottery: { isPriority: true; weight: number; criteria: { conditions: $InferEnumOutput<{ username: "username"; access: "access"; ... 4 more ...; expression: "expression"; }>[]; ... 6 more ...; expression: string; }; } ...' には 型 '{ id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; order: number; isEnabled: boolean; tagColor: $InferEnumOutput<{ error: "error"; success: "success"; primary: "primary"; ... 4 more ...; warning: "warning"; }>; tags: string[]; }' からの次のプロパティがありません: order, isEnabled, tagColor, tagsts-plugin(2322)
BaseEditor.vue(59, 7): 予期された型は、型 '{ readonly modelValue: { id: string; key: string; name: string; description: string; createdAt: string; updatedAt: string; order: number; isEnabled: boolean; tagColor: $InferEnumOutput<{ error: "error"; success: "success"; ... 5 more ...; warning: "warning"; }>; tags: string[]; }; readonly category: DataCategoryType...' に対してここで宣言されたプロパティ 'modelValue' から取得されています
(property) modelValue: {
    id: string;
    key: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    order: number;
    isEnabled: boolean;
    tagColor: $InferEnumOutput<{
        error: "error";
        primary: "primary";
        secondary: "secondary";
        ... 4 more ...;
        warning: "warning";
    }>;
    tags: string[];
} -->
        <BaseEditor :modelValue="item" :category="null" :showEnabledToggle="false" @update:modelValue="updateBase" />
      </div>
    </BaseDialog>

    <BaseDialog
      v-if="openedDialog === 'condition'"
      :open="true"
      icon="Filter"
      title="追加条件"
      size="3xl"
      @update:open="closeDialog"
    >
      <div class="space-y-2">
        <OmikujiItemPriority :omikujiItem="item" @update="$emit('update:item', $event)" />
      </div>
    </BaseDialog>

    <BaseDialog
      v-if="openedDialog === 'run'"
      :open="true"
      icon="Zap"
      title="実行内容"
      size="3xl"
      @update:open="closeDialog"
    >
      <div class="space-y-2">
        <OmikujiItemEditor :omikujiItem="item" @update="$emit('update:item', $event)" />
      </div>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Ban, Filter, GripVertical, Pencil, Timer, Zap, ExternalLink } from 'lucide-vue-next'
  import type { BaseRecordType } from '@/types/core'
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import MenuDropdown from '@/editor/parts/MenuDropdown.vue'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import BaseEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import OmikujiItemEditor from '../item/OmikujiItemEditor.vue'
  import OmikujiItemPriority from '../item/OmikujiItemPriority.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'

  const props = defineProps<{
    item: OmikujiItemType
    color: string
    percentage: string
    isSelected: boolean
  }>()

  const emit = defineEmits<{
    'update:weight': [weight: number]
    'update:item': [item: OmikujiItemType]
    select: []
    duplicate: []
    delete: []
  }>()

  const { t } = useI18n()
  const { getAsset } = useGetAssetData()
  const navigationStore = useNavigationStore()

  // 開いているダイアログ(同時に開くのは 1 つだけ)
  type DialogName = 'base' | 'condition' | 'run'
  const openedDialog = ref<DialogName | null>(null)
  const openDialog = (name: DialogName) => {
    emit('select') // 編集中の行を選択状態にする
    openedDialog.value = name
  }
  const closeDialog = () => {
    openedDialog.value = null
  }

  // 実行内容の表示(steps: シナリオ名 / control: command)。未接続・参照切れは警告色
  const runState = computed(() => {
    const item = props.item
    if (item.kind === 'control') {
      return { label: t(`mapText.omikujiControlCommand.${item.command}.label`), cls: '' }
    }
    if (!item.stepKey) return { label: t('omikujiItem.scenario.noneShort'), cls: 'text-error font-bold' }
    const scenario = getAsset('scenarios', item.stepKey)
    if (!scenario) return { label: t('omikujiItem.scenario.missingShort'), cls: 'text-error font-bold' }
    return { label: scenario.name || item.stepKey, cls: 'opacity-70' }
  })

  const handleWeightUpdate = (event: Event) => {
    const value = parseInt((event.target as HTMLInputElement).value)
    if (!isNaN(value) && value >= 0) {
      emit('update:weight', value)
    }
  }

  // BaseEditor は BaseRecordType 全体を返すので、元のアイテムに重ねて返す
  const updateBase = (value: BaseRecordType) => {
    emit('update:item', { ...props.item, ...value } as OmikujiItemType)
  }

  const updateCooldown = (event: Event) => {
    if (props.item.kind !== 'steps') return
    const num = parseFloat((event.target as HTMLInputElement).value)
    emit('update:item', { ...props.item, cooldownSeconds: isNaN(num) || num < 0 ? 0 : num })
  }

  /** シナリオの中身を編集しに行く */
  const goToScenario = () => {
    navigationStore.selectCategory('scenarios')
    navigationStore.selectItem(stepKey.value)
  }
</script>
