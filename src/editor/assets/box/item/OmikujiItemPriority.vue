<!-- src/editor/assets/box/OmikujiItemPriority.vue -->
<template>
  <!-- 追加発動条件の有効化 -->
  <SettingItem
    label="追加発動条件を設定する"
    description="条件を満たした場合の優先度を設定できます"
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
    <SubSectionHeader icon="Filter" title="追加条件" description="このおみくじが適用される追加の条件を設定します" />

    <SettingItem label="優先度" description="追加条件達成時、優先で選ばれます">
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
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import { useOmikujiLottery } from '../composables/useOmikujiLottery'

  const props = defineProps<{ omikujiItem: OmikujiItemType }>()
  const emit = defineEmits<{ update: [item: OmikujiItemType] }>()

  const { hasCriteria, isPriority, setCriteriaEnabled, setPriority } = useOmikujiLottery(
    () => props.omikujiItem,
    (i) => emit('update', i)
  )
</script>
