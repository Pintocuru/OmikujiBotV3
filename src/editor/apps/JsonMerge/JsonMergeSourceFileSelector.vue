<!-- src/editor/apps/JsonMerge/JsonMergeSourceFileSelector.vue -->
<template>
  <div class="space-y-3">
    <!-- マージ元ファイル -->
    <SettingItem icon="FileText" :label="t('jsonMerge.source.label')">
      <select
        :value="currentMergeItem.sourceFile"
        @change="handleSourceFileChange"
        class="select select-bordered w-full"
      >
        <option disabled value="">{{ t('jsonMerge.source.chooseFile') }}</option>
        <option v-for="file in jsonFiles" :key="file" :value="file">
          {{ file }}
        </option>
      </select>

      <!-- エラーメッセージ -->
      <p v-if="!currentMergeItem.sourceFile" class="text-red-500 mt-2">
        {{ t('jsonMerge.source.missingFile') }}
      </p>
    </SettingItem>

    <!-- キーサフィックス -->
    <SettingItem
      icon="Tag"
      :label="t('jsonMerge.source.suffixLabel')"
      :description="t('jsonMerge.source.suffixDescription')"
    >
      <input
        type="text"
        :value="currentMergeItem.keySuffix"
        @input="handleKeySuffixChange"
        class="input input-bordered w-full"
        :placeholder="t('jsonMerge.source.suffixPlaceholder')"
      />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { configApi } from '@/manager/services/configApi'

  const props = defineProps<{
    mergeIndex: number
  }>()

  const store = useOmikujiStore()
  const { data } = storeToRefs(store)
  const { t } = useI18n()

  const jsonFiles = ref<string[]>([])

  // 現在のマージアイテムを取得
  const currentMergeItem = computed(() => {
    return data.value.jsonMerge?.[props.mergeIndex] ?? { sourceFile: '', keySuffix: '' }
  })

  // JSONファイルリストを取得
  onMounted(async () => {
    try {
      const files = await configApi.getFileList()
      jsonFiles.value = files.map((f) => f.name)
    } catch (err) {
      console.error('JSONファイル取得エラー:', err)
    }
  })

  // ソースファイル変更時の処理
  const handleSourceFileChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    updateMergeItem({ sourceFile: target.value })
  }

  // キーサフィックス変更時の処理
  const handleKeySuffixChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    updateMergeItem({ keySuffix: target.value })
  }

  // マージアイテムを更新
  const updateMergeItem = (updates: Partial<typeof currentMergeItem.value>) => {
    if (!data.value.jsonMerge) return

    const newMerge = [...data.value.jsonMerge]
    newMerge[props.mergeIndex] = {
      ...newMerge[props.mergeIndex],
      ...updates,
    }

    store.updateJsonMerge(newMerge)
  }
</script>
