<!-- src/manager/components/ManagerPackageList.vue -->
<!-- packages に保存されているジェネレーター用データの一覧。選ぶと開き、ごみ箱で削除できる(名前変更・複製はなし) -->
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
      <div
        v-for="pack in packages"
        :key="pack.name"
        class="group flex items-stretch rounded bg-base-100"
        :class="pack.displayName === currentId ? 'border border-primary' : ''"
      >
        <button
          class="btn btn-ghost h-auto min-h-0 flex-1 min-w-0 justify-start items-start flex-col gap-0.5 px-3 py-2 text-left font-normal"
          :disabled="devStore.isLoading || deletingName !== null"
          @click="emit('open', pack.displayName)"
        >
          <span class="flex items-center gap-1 w-full">
            <span class="text-sm font-bold truncate">{{ pack.displayName }}</span>
            <span v-if="pack.displayName === currentId" class="badge badge-primary badge-xs shrink-0">現在の ID</span>
          </span>
          <span class="text-xs opacity-60">{{ formatFileDate(pack.modified) }}</span>
        </button>

        <button
          class="btn btn-ghost btn-square btn-sm self-center mr-1 text-error opacity-40 group-hover:opacity-100"
          title="このパッケージを削除"
          :disabled="devStore.isLoading || deletingName !== null"
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
  import { Trash2 } from 'lucide-vue-next'
  import { FileItem } from '@/manager/types'
  import { generatorApi } from '@/manager/services/generatorApi'
  import { formatFileDate } from '@/manager/services/apiServiceUtils'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

  // displayName は拡張子を除いた名前 = meta.id
  const emit = defineEmits<{ open: [id: string] }>()

  const devStore = useManagerStore()
  const packages = ref<FileItem[]>([])
  const isLoadingList = ref(true)
  const deletingName = ref<string | null>(null)

  // omikujiData.js の meta.id (ジェネレーターが読むパッケージ)
  const currentId = window.omikujiData?.meta.id

  const fetchPackages = async () => {
    try {
      packages.value = await generatorApi.listPackages()
    } catch (error) {
      swalToast.error({ title: 'パッケージ一覧の取得に失敗しました', text: String(error) })
    } finally {
      isLoadingList.value = false
    }
  }

  const onDelete = async (pack: FileItem) => {
    const isCurrent = pack.displayName === currentId
    const result = await swalModal.confirmDelete({
      title: 'パッケージを削除しますか？',
      html: `
        <p>"${escapeHtml(pack.displayName)}" を削除します。この操作は取り消せません。</p>
        ${
          isCurrent
            ? '<p style="font-size: 0.85em; color: #b91c1c; margin-top: 8px;">現在の ID のデータです。削除すると、ジェネレーターはこの設定を読めなくなります。</p>'
            : ''
        }
      `,
    })
    if (!result.isConfirmed) return

    deletingName.value = pack.name
    try {
      await generatorApi.deletePackage(pack.name)
      packages.value = packages.value.filter((item) => item.name !== pack.name)
      swalToast.success({ title: `パッケージ "${pack.displayName}" を削除しました` })
    } catch (error) {
      swalToast.error({ title: '削除に失敗しました', text: String(error) })
    } finally {
      deletingName.value = null
    }
  }

  // meta.id は任意の文字列になり得るため、HTML に埋め込む前にエスケープする
  const escapeHtml = (text: string) =>
    text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

  onMounted(fetchPackages)
</script>
