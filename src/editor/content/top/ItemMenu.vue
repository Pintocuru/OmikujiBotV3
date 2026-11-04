<!-- src/editor/content/top/ItemMenu.vue -->
<!-- TOPページのアイテム右端のハンバーガーメニュー。編集・複製・削除を emit する(実処理は親側) -->
<template>
  <div class="dropdown dropdown-end shrink-0" @click.stop>
    <button tabindex="0" class="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity">
      <Menu class="w-4 h-4" />
    </button>

    <ul
      tabindex="0"
      class="dropdown-content menu z-50 w-32 rounded-md border border-base-300 bg-base-200 text-base-content shadow-lg p-1"
    >
      <!-- 編集(ItemEditDialog を親で開く) -->
      <li>
        <button class="flex items-center gap-2 text-xs" @click="emit('edit')">
          <Pencil class="w-3 h-3" />
          {{ t('connections.switcher.edit') }}
        </button>
      </li>

      <!-- 複製 -->
      <li>
        <button class="flex items-center gap-2 text-xs" @click="emit('duplicate')">
          <Copy class="w-3 h-3" />
          {{ t('navigation.menu.duplicate') }}
        </button>
      </li>

      <li class="menu-title p-0"><hr class="border-base-300" /></li>

      <!-- 削除 -->
      <li>
        <button
          class="flex items-center gap-2 text-xs text-error hover:bg-error hover:text-error-content"
          @click="emit('remove')"
        >
          <Trash2 class="w-3 h-3" />
          {{ t('navigation.menu.delete') }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { Menu, Pencil, Copy, Trash2 } from 'lucide-vue-next'

  const { t } = useI18n()

  const emit = defineEmits<{
    edit: []
    duplicate: []
    remove: []
  }>()
</script>
