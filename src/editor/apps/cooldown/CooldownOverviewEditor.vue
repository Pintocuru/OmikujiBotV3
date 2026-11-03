<!-- src/editor/apps/cooldown/CooldownOverviewEditor.vue -->
<!-- 全おみくじのクールダウン一覧。イベントをまたいで効くので、どのイベントから使われるかを併記し、値をその場で編集できる -->
<template>
  <NoParamsCard v-if="rows.length === 0" icon-name="Timer" :message="t('cooldownOverview.empty')" />

  <div v-else class="space-y-3">
    <p class="flex items-center gap-1 text-sm">
      {{ t('cooldownOverview.description') }}
      <CooldownHelpButton />
    </p>

    <div class="overflow-x-auto">
      <table class="table table-sm">
        <thead>
          <tr>
            <th>{{ t('cooldownOverview.columns.item') }}</th>
            <th>{{ t('cooldownOverview.columns.events') }}</th>
            <th>{{ t('cooldownOverview.columns.cooldown') }}</th>
            <th>
              <span class="tooltip tooltip-left" :data-tip="t('cooldownOverview.blockedByTooltip')">
                {{ t('cooldownOverview.columns.blockedBy') }}
              </span>
            </th>
            <th>
              <span class="tooltip tooltip-left" :data-tip="t('cooldownOverview.blocksTooltip')">
                {{ t('cooldownOverview.columns.blocks') }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.itemId" class="hover:bg-base-200" :class="{ 'opacity-50': !row.isActive }">
            <td class="align-top">
              <button type="button" class="link link-hover text-left" @click="goTo(row)">
                {{ row.itemName || t('omikujiItem.summary.unnamed') }}
              </button>
              <div class="text-xs opacity-60">{{ row.boxName }}</div>
            </td>
            <td class="align-top">
              <LinkGroup :items="eventLinks(row)" :limit="3" :loading="false" />
            </td>
            <td class="align-top">
              <label class="input input-sm input-bordered flex w-32 items-center gap-1">
                <input
                  type="number"
                  class="min-w-0 grow"
                  step="0.1"
                  :value="row.cooldownSeconds"
                  :title="t('omikujiItem.header.cooldown.inputTitle')"
                  @change="updateCooldown(row, ($event.target as HTMLInputElement).value)"
                />
                <span class="text-xs opacity-60">{{ t('omikujiItem.header.cooldown.unit') }}</span>
              </label>
            </td>
            <td class="align-top">
              <CooldownPeerList :peers="row.blockedBy" @go="goTo" />
            </td>
            <td class="align-top">
              <CooldownPeerList :peers="row.blocks" @go="goTo" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="text-xs opacity-60">{{ t('cooldownOverview.note') }}</p>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import LinkGroup from '@/editor/content/connections/LinkGroup.vue'
  import type { LinkItem } from '@/editor/content/connections/types'
  import CooldownHelpButton from '@/editor/assets/mikuji/cooldown/CooldownHelpButton.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useMikujiSelectionStore } from '@/editor/stores/useMikujiSelectionStore'
  import { useCategoryOpen } from '@/editor/sidebar/composables/useCategoryOpen'
  import CooldownPeerList from './CooldownPeerList.vue'
  import { useCooldownOverview, type CooldownOverviewRow, type CooldownPeer } from './useCooldownOverview'

  const { t } = useI18n()
  const { rows, updateCooldown } = useCooldownOverview()
  const navigation = useNavigationStore()
  const selection = useMikujiSelectionStore()
  const { revealCategory } = useCategoryOpen()

  // 無効なイベントには名前に印を付ける
  const eventLinks = (row: CooldownOverviewRow): LinkItem[] =>
    row.events.map(({ link, isEnabled }) =>
      isEnabled ? link : { ...link, name: `${link.name}${t('cooldownOverview.disabledSuffix')}` }
    )

  // そのおみくじ(おみくじ箱の中の1件)を選択した状態で、おみくじ箱の画面へ移動する
  const goTo = (target: CooldownPeer) => {
    navigation.selectCategory('mikuji')
    navigation.selectItem(target.boxKey)
    selection.selectedIdByBox[target.boxKey] = target.itemId
    revealCategory('mikuji')
  }
</script>
