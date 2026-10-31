<!-- src/editor/apps/appInfo/meta/PackageBasicInfo.vue -->
<template>
  <!-- このデータのid -->
  <SettingItem icon="Hash" label="id" descriptionKey="packageMeta.basic.id.description">
    <div class="flex items-center gap-3">
      <span class="font-mono text-sm text-base-content/60">{{ meta.id }}</span>
      <button class="btn btn-xs btn-ghost gap-1" @click="handleRegenerateId">
        <RefreshCw :size="12" />
        再生成
      </button>
    </div>
  </SettingItem>

  <!-- その他のメタ情報 -->
  <template v-for="field in metaFields" :key="field.key">
    <!-- タグは特別表示 -->
    <SettingItem
      v-if="field.key === 'tags'"
      layout="vertical"
      :icon="field.icon"
      :labelKey="field.labelKey"
      :descriptionKey="field.descriptionKey"
    >
      <div class="flex items-center gap-2 flex-wrap">
        <span v-for="(tag, index) in meta.tags" :key="index" class="badge badge-outline text-xs">
          {{ tag }}
        </span>
      </div>
    </SettingItem>

    <!-- 通常フィールド -->
    <SettingItem v-else :icon="field.icon" :labelKey="field.labelKey" :descriptionKey="field.descriptionKey">
      <div class="flex items-center gap-3">
        <span :class="['text-sm text-base-content/60', field.mono && 'font-mono']">
          {{ meta[field.key] }}
        </span>
      </div>
    </SettingItem>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RefreshCw } from 'lucide-vue-next'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { storeToRefs } from 'pinia'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { generateId } from '@/types/core'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // メタ情報の参照
  const meta = computed(() => data.value.meta)

  // id 以外のフィールド定義
  const metaFields = [
    {
      key: 'name',
      icon: 'Package',
      labelKey: 'packageMeta.basic.name.label',
      descriptionKey: 'packageMeta.basic.name.description',
      mono: false,
    },
    {
      key: 'description',
      icon: 'FileText',
      labelKey: 'packageMeta.basic.description.label',
      descriptionKey: 'packageMeta.basic.description.description',
      mono: false,
    },
    {
      key: 'version',
      icon: 'Tag',
      labelKey: 'packageMeta.basic.version.label',
      descriptionKey: 'packageMeta.basic.version.description',
      mono: true,
    },
    {
      key: 'author',
      icon: 'User',
      labelKey: 'packageMeta.basic.author.label',
      descriptionKey: 'packageMeta.basic.author.description',
      mono: false,
    },
    {
      key: 'tags',
      icon: 'Tags',
      labelKey: 'packageMeta.basic.tags.label',
      descriptionKey: 'packageMeta.basic.tags.description',
      mono: false,
    },
  ] as const

  // id 再生成ハンドラ
  const handleRegenerateId = async () => {
    const result = await swalModal.warning({
      title: 'IDを変更しますか？',
      text: '変更すると、このパッケージのIDが新しく生成されます。',
      showCancelButton: true,
      confirmButtonText: '変更する',
      cancelButtonText: 'キャンセル',
    })

    if (!result.isConfirmed) return

    data.value.meta.id = generateId()
    omikujiStore.hasChanged = true
  }
</script>
