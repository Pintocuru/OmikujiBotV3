<!-- src/manager/components/ManagerPackageList.vue -->
<!-- packages に保存されているジェネレーター用データの一覧。選ぶと開く(閲覧と読み込みのみ) -->
<template>
  <div class="card bg-base-200 p-2 space-y-2">
    <div v-if="isLoadingList" class="text-xs opacity-70 text-center py-4">
      <span class="loading loading-spinner loading-xs mr-2"></span>
      パッケージ一覧を読み込み中...
    </div>

    <div v-else-if="packages.length === 0" class="text-xs opacity-70 text-center py-4">
      保存済みのパッケージはありません
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
      <button
        v-for="pack in packages"
        :key="pack.name"
        class="btn btn-ghost h-auto min-h-0 justify-start items-start flex-col gap-0.5 px-3 py-2 text-left font-normal bg-base-100"
        :class="pack.displayName === currentId ? 'border border-primary' : ''"
        :disabled="devStore.isLoading"
        @click="emit('open', pack.displayName)"
      >
        <span class="flex items-center gap-1 w-full">
          <span class="text-sm font-bold truncate">{{ pack.displayName }}</span>
          <span v-if="pack.displayName === currentId" class="badge badge-primary badge-xs shrink-0">現在の ID</span>
        </span>
        <span class="text-xs opacity-60">{{ formatFileDate(pack.modified) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { FileItem } from '@/manager/types'
  import { generatorApi } from '@/manager/services/generatorApi'
  import { formatFileDate } from '@/manager/services/apiServiceUtils'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

  // displayName は拡張子を除いた名前 = meta.id
  const emit = defineEmits<{ open: [id: string] }>()

  const devStore = useManagerStore()
  const packages = ref<FileItem[]>([])
  const isLoadingList = ref(true)

  // omikujiData.js の meta.id (ジェネレーターが読むパッケージ)
  const currentId = window.omikujiData?.meta.id

  onMounted(async () => {
    try {
      packages.value = await generatorApi.listPackages()
    } catch (error) {
      swalToast.error({ title: 'パッケージ一覧の取得に失敗しました', text: String(error) })
    } finally {
      isLoadingList.value = false
    }
  })
</script>
