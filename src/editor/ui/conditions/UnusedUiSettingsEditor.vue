<!-- src/editor/ui/conditions/UnusedUiSettingsEditor.vue -->
<template>
  <div class="flex flex-col gap-3">
    <SettingItem icon="Trash2" labelKey="uiSettings.unused.label" descriptionKey="uiSettings.unused.description">
      <p v-if="unusedKinds.length === 0" class="text-xs opacity-70 p-2">{{ t('uiSettings.unused.empty') }}</p>

      <div v-else class="flex flex-col gap-2">
        <div v-for="kind in unusedKinds" :key="kind" class="flex items-center justify-between gap-2">
          <span class="badge badge-outline">{{ kindLabel(kind) }}</span>
          <button class="btn btn-xs btn-error btn-outline" @click="removeOne(kind)">
            {{ t('uiSettings.unused.delete') }}
          </button>
        </div>
        <button class="btn btn-sm btn-error self-start" @click="removeAll">
          {{ t('uiSettings.unused.deleteAll') }}
        </button>
      </div>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import type { UiKind } from '@/types/OmikujiData'
  import { uiLayoutMap } from '@/maps/OmikujiData'
  import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'

  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const kindLabel = (kind: UiKind) => t(`mapText.uiKind.${kind}.label`)

  // 設定が入っていて、現在のレイアウトが使わない UI
  const unusedKinds = computed(() => {
    const used = uiLayoutMap[data.value.ui.layout].kinds
    const settings = data.value.ui.settings
    return (Object.keys(settings) as UiKind[]).filter((kind) => settings[kind] !== undefined && !used.includes(kind))
  })

  const removeOne = async (kind: UiKind) => {
    const { isConfirmed } = await swalModal.confirmDelete({
      title: t('uiSettings.unused.deleteOneConfirm', { label: kindLabel(kind) }),
    })
    if (!isConfirmed) return
    omikujiStore.removeItemSetting(kind)
  }

  const removeAll = async () => {
    const { isConfirmed } = await swalModal.confirmDelete({
      title: t(
        unusedKinds.value.length === 1
          ? 'uiSettings.unused.deleteAllConfirm.one'
          : 'uiSettings.unused.deleteAllConfirm.other',
        { count: unusedKinds.value.length }
      ),
    })
    if (!isConfirmed) return
    // 削除中に computed が変わるためコピーして回す
    for (const kind of [...unusedKinds.value]) omikujiStore.removeItemSetting(kind)
    swalToast.success({ title: t('uiSettings.unused.deleteSuccess') })
  }
</script>
