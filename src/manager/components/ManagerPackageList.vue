<!-- src/manager/components/ManagerPackageList.vue -->
<!-- packages に保存されているジェネレーター用データの一覧。選ぶと開き、ごみ箱で削除できる(名前変更・複製はなし) -->
<template>
  <div class="card bg-base-200 p-2 space-y-2">
    <div v-if="isLoadingList" class="text-xs opacity-70 text-center py-4">
      <span class="loading loading-spinner loading-xs mr-2"></span>
      {{ t('manager.packages.loading') }}
    </div>

    <div v-else-if="packages.length === 0" class="text-xs opacity-70 text-center py-4">
      {{ t('manager.packages.empty') }}
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
      <div
        v-for="pack in packages"
        :key="pack.name"
        class="group flex items-stretch rounded bg-base-100"
        :class="pack.displayName === currentId ? 'border border-primary' : ''"
      >
        <button
          class="btn btn-ghost h-auto min-h-0 flex-1 min-w-0 justify-start items-start flex-col gap-0.5 px-3 py-2 text-left font-normal"
          :disabled="managerStore.isLoading || deletingName !== null"
          @click="emit('open', pack.displayName)"
        >
          <span class="flex items-center gap-1 w-full">
            <span class="text-sm font-bold truncate">{{ pack.displayName }}</span>
            <span v-if="pack.displayName === currentId" class="badge badge-primary badge-xs shrink-0">{{ t('manager.packages.current') }}</span>
          </span>
          <span class="text-xs opacity-60">{{ formatFileDate(pack.modified) }}</span>
        </button>

        <button
          class="btn btn-ghost btn-square btn-sm self-center mr-1 text-error opacity-40 group-hover:opacity-100"
           :title="t('manager.packages.deleteTip')"
          :disabled="managerStore.isLoading || deletingName !== null"
          @click="onDelete(pack)"
        >
          <span v-if="deletingName === pack.name" class="loading loading-spinner loading-xs"></span>
          <Trash2 v-else class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Trash2 } from 'lucide-vue-next'
  import { FileItem } from '@/manager/types'
  import { generatorApi } from '@/manager/services/generatorApi'
  import { formatFileDate } from '@/manager/services/apiServiceUtils'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { escapeHtml } from '@/common/escapeHtml'

  // displayName は拡張子を除いた名前 = meta.id
  const emit = defineEmits<{ open: [id: string] }>()

  const { t } = useI18n()
  const managerStore = useManagerStore()
  const packages = ref<FileItem[]>([])
  const isLoadingList = ref(true)
  const deletingName = ref<string | null>(null)

  // omikujiData.js の meta.id (ジェネレーターが読むパッケージ)
  const currentId = window.omikujiData?.meta.id

  const fetchPackages = async () => {
    try {
      packages.value = await generatorApi.listPackages()
    } catch (error) {
      swalToast.error({ title: t('manager.packages.listFailed'), text: String(error) })
    } finally {
      isLoadingList.value = false
    }
  }

  const onDelete = async (pack: FileItem) => {
    const isCurrent = pack.displayName === currentId
    const result = await swalModal.confirmDelete({
      title: t('manager.packages.deleteConfirm'),
      html: `
        <p>${t('manager.packages.deleteBody', { name: escapeHtml(pack.displayName) })}</p>
        ${
          isCurrent
            ? '<p style="font-size: 0.85em; color: #b91c1c; margin-top: 8px;">${t('manager.packages.deleteCurrentWarning')}</p>'
            : ''
        }
      `,
    })
    if (!result.isConfirmed) return

    deletingName.value = pack.name
    try {
      await generatorApi.deletePackage(pack.name)
      packages.value = packages.value.filter((item) => item.name !== pack.name)
      swalToast.success({ title: `${t('manager.packages.deleted', { name: pack.displayName })}` })
    } catch (error) {
      swalToast.error({ title: t('manager.packages.deleteFailed'), text: String(error) })
    } finally {
      deletingName.value = null
    }
  }

  onMounted(fetchPackages)
</script>
