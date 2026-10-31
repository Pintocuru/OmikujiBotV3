<!-- src/editor/assets/mikuji/item/OmikujiItemPriority.vue -->
<template>
  <!-- 追加発動条件の有効化 -->
  <SettingItem
    icon="Filter"
    labelKey="omikujiItem.priority.criteria.label"
    descriptionKey="omikujiItem.priority.criteria.description"
    :variant="hasCriteria ? 'secondary' : undefined"
  >
    <label class="label cursor-pointer gap-2">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        :checked="hasCriteria"
        @change="setCriteriaEnabled(($event.target as HTMLInputElement).checked)"
      />
      <span class="label-text">設定する</span>
    </label>
  </SettingItem>

  <!-- 優先度 -->
  <template v-if="hasCriteria">
    <SubSectionHeader
      icon="Filter"
      titleKey="omikujiItem.priority.sectionTitle"
      descriptionKey="omikujiItem.priority.sectionDescription"
    />

    <SettingItem
      icon="Crown"
      labelKey="omikujiItem.priority.priority.label"
      descriptionKey="omikujiItem.priority.priority.description"
    >
      <label class="label cursor-pointer gap-2">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          :checked="isPriority"
          @change="setPriority(($event.target as HTMLInputElement).checked)"
        />
        <span class="label-text">
          {{ isPriority ? '適用時、このおみくじが必ず適用されます' : '他のおみくじと同じ抽選を行います' }}
        </span>
      </label>
    </SettingItem>

    <!-- 発動条件 -->
    <OmikujiItemCriteria :omikujiItem="omikujiItem" @update="emit('update', $event)" />
  </template>
</template>

<script setup lang="ts">
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import OmikujiItemCriteria from './OmikujiItemCriteria.vue'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { useOmikujiLottery } from '../composables/useOmikujiLottery'

  const props = defineProps<{ omikujiItem: OmikujiItemType }>()
  const emit = defineEmits<{ update: [item: OmikujiItemType] }>()

  const { hasCriteria, isPriority, setCriteriaEnabled, setPriority } = useOmikujiLottery(
    () => props.omikujiItem,
    (i) => emit('update', i)
  )
</script>
