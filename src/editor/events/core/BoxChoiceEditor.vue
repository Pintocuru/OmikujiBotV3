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
        <span v-if="!box" class="text-xs text-warning">{{ t('connections.boxMissing', { key: omikujiKey }) }}</span>
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
