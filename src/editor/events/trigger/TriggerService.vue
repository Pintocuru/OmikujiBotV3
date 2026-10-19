<!-- src/editor/events/trigger/TriggerService.vue -->
<template>
  <SettingItem icon="Globe" :label="t('triggerService.label')" :description="t('triggerService.description')">
    <div class="space-y-3">
      <!-- 主要な選択肢 -->
      <div class="flex flex-wrap gap-2">
        <label
          v-for="option in primaryOptions"
          :key="option.value"
          class="flex items-center gap-2 hover:bg-base-300 p-2 rounded cursor-pointer text-sm"
        >
          <input
            type="checkbox"
            class="checkbox checkbox-sm"
            :checked="(modelValue ?? []).includes(option.value)"
            @change="toggleOption(option.value)"
          />
          <span>{{ option.label }}</span>
        </label>
      </div>

      <!-- 詳細オプション -->
      <div class="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="checkbox" />
        <div class="collapse-title text-sm font-medium">{{ t('triggerService.detailTitle') }}</div>
        <div class="collapse-content">
          <div class="flex flex-wrap gap-2 pt-2">
            <label
              v-for="option in detailOptions"
              :key="option.value"
              class="flex items-center gap-2 hover:bg-base-300 p-2 rounded cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="(modelValue ?? []).includes(option.value)"
                @change="toggleOption(option.value)"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
          <div class="mt-3 p-3 bg-info/10 rounded text-xs text-info-content">
            <p class="font-medium mb-1">{{ t('triggerService.hintTitle') }}</p>
            <ul class="list-disc list-inside space-y-1">
              <li><strong>{{ t('triggerService.platforms') }}:</strong> {{ t('triggerService.hintPlatforms') }}</li>
              <li><strong>{{ t('triggerService.external') }}:</strong> {{ t('triggerService.hintExternal') }}</li>
              <li><strong>{{ t('triggerService.individual') }}:</strong> {{ t('triggerService.hintIndividual') }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 選択状況の表示 -->
      <div v-if="(modelValue ?? []).length > 0" class="text-xs text-base-content/70">
        {{ t('triggerService.selected', { labels: selectedLabels.join(', ') }) }}
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { EnabledServiceType } from '@/types/engine'

  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { serviceTypeMap } from '@/sdk/types/onesdk/Service'

  const { t } = useI18n()
  const props = defineProps<{
    modelValue?: EnabledServiceType[]
  }>()

  const emit = defineEmits(['update:modelValue'])

  // 主要な選択肢（platforms と external）
  const primaryOptions = computed(() => [
    { value: 'platforms' as EnabledServiceType, label: t('triggerService.platforms') },
    { value: 'external' as EnabledServiceType, label: t('triggerService.external') },
  ])

  // 詳細選択肢（個別の配信サイト）
  const detailOptions = Object.entries(serviceTypeMap)
    .filter(([value]) => !['platforms', 'external'].includes(value))
    .map(([value, label]) => ({
      value: value as EnabledServiceType,
      label,
    }))

  // 選択中のラベル一覧
  const selectedLabels = computed(() => {
    const current = props.modelValue ?? []
    return current.map((value) => serviceTypeMap[value])
  })

  // オプションの切り替え
  const toggleOption = (value: EnabledServiceType) => {
    const current = props.modelValue ?? []
    const index = current.indexOf(value)
    const newValue = index > -1 ? current.filter((_, i) => i !== index) : [...current, value]

    emit('update:modelValue', newValue)
  }
</script>
