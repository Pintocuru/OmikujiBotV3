<!-- src/editor/assets/scenarios/WordParty/WordPartyIdPicker.vue -->
<template>
  <div class="space-y-2 rounded-lg border border-dashed border-warning/60 p-2">
    <div class="flex items-center gap-2">
      <label class="btn btn-outline btn-sm">
        config.js を開く
        <input type="file" accept=".js" class="hidden" @change="onPick" />
      </label>
      <span v-if="folderName" class="truncate text-xs text-gray-500">
        {{ folderName }}
      </span>
    </div>

    <p v-if="error" class="text-xs text-error">{{ error }}</p>

    <template v-if="items.length">
      <input v-model="search" type="search" class="input input-sm w-full" placeholder="名前・IDで検索" />

      <div class="text-xs text-gray-500">{{ filteredItems.length }} / {{ items.length }} 件</div>

      <ul v-if="filteredItems.length" class="max-h-64 divide-y divide-base-300 overflow-y-auto text-sm">
        <li v-for="item in filteredItems" :key="item.id" class="flex items-center gap-2 py-1">
          <div class="min-w-0 flex-1">
            <div class="truncate">{{ item.name ?? '(no name)' }}</div>
            <code class="text-xs text-gray-500">{{ item.id }}</code>
          </div>
          <button type="button" class="btn btn-ghost btn-xs" @click="copy(item.id)">
            {{ copiedId === item.id ? 'コピー済' : 'コピー' }}
          </button>
          <button type="button" class="btn btn-primary btn-xs" @click="emit('select', item.id)">セット</button>
        </li>
      </ul>

      <p v-else class="py-3 text-center text-xs text-gray-500">該当する項目がありません</p>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'

  type SetupItem = { id: string; name?: string }

  const STORAGE_KEY = 'omikujibot:word-party-setup-items'

  const emit = defineEmits<{ select: [id: string] }>()

  const items = ref<SetupItem[]>([])
  const folderName = ref('')
  const error = ref('')
  const copiedId = ref('')
  const search = ref('')

  const filteredItems = computed(() => {
    const query = search.value.trim().toLowerCase()
    if (!query) return items.value

    return items.value.filter((item) => [item.name, item.id].some((value) => value?.toLowerCase().includes(query)))
  })

  // ページ移動後も同じタブ内で再利用できるよう、解析結果を復元する
  onMounted(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (!saved) return

      const data: unknown = JSON.parse(saved)
      if (
        typeof data !== 'object' ||
        data === null ||
        !('items' in data) ||
        !Array.isArray(data.items) ||
        !data.items.every(
          (item): item is SetupItem =>
            typeof item === 'object' &&
            item !== null &&
            'id' in item &&
            typeof item.id === 'string' &&
            (!('name' in item) || typeof item.name === 'string')
        )
      ) {
        sessionStorage.removeItem(STORAGE_KEY)
        return
      }

      items.value = data.items
      folderName.value = 'folderName' in data && typeof data.folderName === 'string' ? data.folderName : ''
    } catch {
      // sessionStorage が利用できない場合は、通常どおりファイル選択で読み込む
    }
  })

  // config.js を実行し、setup([...]) の引数だけ取り出す
  // (開発者本人のローカルファイル前提。dev 専用)
  const parseSetup = (code: string): SetupItem[] => {
    let captured: SetupItem[] = []

    const chain = {
      setup: (list: SetupItem[]) => {
        captured = list
        return chain
      },
      start: () => chain,
    }

    new Function('window', code)({
      WordParty: { init: () => chain },
    })

    return captured
  }

  const onPick = async (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]

    error.value = ''
    items.value = []
    search.value = ''

    if (!file) return

    if (file.name !== 'config.js') {
      error.value = 'config.js を選択してください'
      input.value = ''
      return
    }

    folderName.value = file.name

    try {
      const parsedItems = parseSetup(await file.text()).filter((i) => i?.id)
      items.value = parsedItems

      if (!items.value.length) {
        error.value = 'setup が空でした'
      } else {
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ items: items.value, folderName: folderName.value }))
        } catch {
          // 保存できなくても、現在のページでは読み込んだデータを利用できる
        }
      }
    } catch (err) {
      error.value = `config.js の読み込みに失敗: ${(err as Error).message}`
    }

    input.value = ''
  }

  const copy = async (id: string) => {
    await navigator.clipboard.writeText(id)
    copiedId.value = id
    setTimeout(() => (copiedId.value = ''), 1200)
  }
</script>
