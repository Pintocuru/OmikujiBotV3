<!-- src/editor/assets/mikuji/cooldown/CooldownOverviewDialog.vue -->
<!-- 全おみくじのクールダウン一覧(読み取り専用)。値の変更は各おみくじで行い、ここからはそのおみくじへ移動できる -->
<template>
  <BaseDialog
    :open="open"
    :title="t('omikujiItem.cooldownOverview.title')"
    size="3xl"
    @update:open="emit('update:open', $event)"
  >
    <div class="space-y-3">
      <p class="flex items-center gap-1 text-sm">
        {{ t('omikujiItem.cooldownOverview.description') }}
        <CooldownHelpButton />
      </p>

      <p v-if="withCooldown.length === 0" class="text-sm opacity-70">
        {{ t('omikujiItem.cooldownOverview.empty') }}
      </p>

      <div v-else class="overflow-x-auto">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>{{ t('omikujiItem.cooldownOverview.columns.item') }}</th>
              <th>{{ t('omikujiItem.cooldownOverview.columns.box') }}</th>
              <th class="text-right">{{ t('omikujiItem.cooldownOverview.columns.cooldown') }}</th>
              <th class="text-right">
                <span class="tooltip tooltip-left" :data-tip="t('omikujiItem.cooldownOverview.blockedByTooltip')">
                  {{ t('omikujiItem.cooldownOverview.columns.blockedBy') }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in withCooldown" :key="row.itemId" class="hover:bg-base-200">
              <td>
                <button type="button" class="link link-hover text-left" @click="goTo(row)">
                  {{ row.itemName || t('omikujiItem.summary.unnamed') }}
                </button>
              </td>
              <td>{{ row.boxName }}</td>
              <td class="text-right font-mono">{{ row.cooldownSeconds }}{{ t('omikujiItem.header.cooldown.unit') }}</td>
              <td class="text-right">
                <span class="badge" :class="row.blockedByCount > 0 ? 'badge-warning' : 'badge-ghost'">
                  {{ row.blockedByCount }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-xs opacity-60">{{ t('omikujiItem.cooldownOverview.zeroNote', { count: zeroCount }) }}</p>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useMikujiSelectionStore } from '@/editor/stores/useMikujiSelectionStore'
  import CooldownHelpButton from './CooldownHelpButton.vue'
  import { useCooldownOverview, type CooldownOverviewRow } from './useCooldownOverview'

  const { t } = useI18n()

  defineProps<{ open: boolean }>()
  const emit = defineEmits<{ 'update:open': [open: boolean] }>()

  const { withCooldown, zeroCount } = useCooldownOverview()
  const navigation = useNavigationStore()
  const selection = useMikujiSelectionStore()

  // そのおみくじ(おみくじ箱の中の1件)を選択した状態で、おみくじ箱の画面へ移動する
  const goTo = (row: CooldownOverviewRow) => {
    navigation.selectCategory('mikuji')
    navigation.selectItem(row.boxKey)
    selection.selectedIdByBox[row.boxKey] = row.itemId
    emit('update:open', false)
  }
</script>
