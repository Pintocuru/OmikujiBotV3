<!-- src/editor/events/trigger/TriggerService.vue -->
<template>
  <SettingItem label="サービス・配信サイト" description="特定の配信サイトからのコメントのみに絞り込めます">
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
        <div class="collapse-title text-sm font-medium">詳細設定 - 個別配信サイト選択</div>
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
            <p class="font-medium mb-1">📌 設定のヒント:</p>
            <ul class="list-disc list-inside space-y-1">
              <li><strong>配信プラットフォーム:</strong> YouTube、Twitchなどの一般的な配信サイトからのコメント</li>
              <li><strong>外部サービス:</strong> OneComme独自のテスト機能や外部連携からのコメント</li>
              <li><strong>個別選択:</strong> 特定の配信サイトのみに限定したい場合に使用</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 選択状況の表示 -->
      <div v-if="(modelValue ?? []).length > 0" class="text-xs text-base-content/70">
        選択中: {{ selectedLabels.join(', ') }}
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { serviceTypeMap, type EnabledServiceType } from '../../../shared/types/Threshold/ServiceCondition'

  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'

  const props = defineProps<{
    modelValue?: EnabledServiceType[]
  }>()

  const emit = defineEmits(['update:modelValue'])

  // 主要な選択肢（platforms と external）
  const primaryOptions = [
    { value: 'platforms' as EnabledServiceType, label: '配信プラットフォーム' },
    { value: 'external' as EnabledServiceType, label: '外部サービス' },
  ]

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
