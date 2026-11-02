<!-- src/editor/assets/mikuji/item/OmikujiItemHeader.vue -->
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <!-- 運勢の種類 -->
    <SettingItem
      icon="Clover"
      layout="vertical"
      labelKey="omikujiItem.header.name.label"
      descriptionKey="omikujiItem.header.name.description"
    >
      <input
        type="text"
        :value="omikujiItem.name"
        @input="updateName(($event.target as HTMLInputElement).value)"
        :placeholder="t('omikujiItem.header.name.label')"
        class="input input-bordered input-sm w-full"
      />
    </SettingItem>

    <!-- クールダウン -->
    <SettingItem
      icon="Timer"
      v-if="omikujiItem.kind === 'steps'"
      layout="vertical"
      labelKey="omikujiItem.header.cooldown.label"
      descriptionKey="omikujiItem.header.cooldown.description"
    >
      <template #label-extra>
        <CooldownHelpButton />
      </template>
      <div class="flex items-center gap-1">
        <input
          type="number"
          :value="omikujiItem.cooldownSeconds ?? 0"
          @input="updateCooldown(($event.target as HTMLInputElement).value)"
          step="0.1"
          class="input input-bordered input-sm w-full"
        />
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-square"
          :title="t('omikujiItem.cooldownOverview.open')"
          :aria-label="t('omikujiItem.cooldownOverview.open')"
          @click="showCooldownOverview = true"
        >
          <ListChecks class="w-4 h-4" />
        </button>
      </div>
    </SettingItem>
  </div>

  <!-- 優先設定 -->
  <OmikujiItemPriority :omikujiItem="omikujiItem" @update="emit('update', $event)" />

  <!-- 全おみくじのクールダウン一覧 -->
  <CooldownOverviewDialog v-model:open="showCooldownOverview" />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ListChecks } from 'lucide-vue-next'
  import { OmikujiItemType } from '@/types/OmikujiData/'
  import OmikujiItemPriority from './OmikujiItemPriority.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import CooldownHelpButton from '../cooldown/CooldownHelpButton.vue'
  import CooldownOverviewDialog from '../cooldown/CooldownOverviewDialog.vue'

  const { t } = useI18n()

  const showCooldownOverview = ref(false)

  const props = defineProps<{
    omikujiItem: OmikujiItemType
  }>()

  const emit = defineEmits<{
    update: [item: OmikujiItemType]
  }>()

  // 名前更新
  const updateName = (value: string) => {
    emit('update', {
      ...props.omikujiItem,
      name: value,
    })
  }

  // クールダウン更新
  const updateCooldown = (value: string) => {
    if (props.omikujiItem.kind !== 'steps') return

    const num = parseFloat(value)
    const safe = isNaN(num) ? 0 : num

    emit('update', {
      ...props.omikujiItem,
      cooldownSeconds: safe,
    })
  }
</script>
