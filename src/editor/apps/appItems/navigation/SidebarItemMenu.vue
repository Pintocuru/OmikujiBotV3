<!-- src/editor/apps/appItems/navigation/SidebarItemMenu.vue -->
<template>
  <div class="dropdown dropdown-end" @click.stop>
    <button tabindex="0" class="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity">
      <MoreHorizontal class="w-3 h-3" />
    </button>

    <ul
      tabindex="0"
      class="dropdown-content menu z-50 w-32 rounded-md border border-base-300 bg-base-200 text-base-content shadow-lg p-1"
    >
      <!-- 有効/無効 -->
      <li>
        <button class="flex items-center gap-2 text-xs" @click="handleToggle">
          <component :is="item.isEnabled === false ? Eye : EyeOff" class="w-3 h-3" />
          {{ item.isEnabled === false ? '有効にする' : '無効にする' }}
        </button>
      </li>

      <!-- 複製 -->
      <li>
        <button class="flex items-center gap-2 text-xs" @click="handleDuplicate">
          <Copy class="w-3 h-3" />
          複製
        </button>
      </li>

      <!-- JSONコピー -->
      <li>
        <button class="flex items-center gap-2 text-xs" @click="handleCopyJson">
          <ClipboardCopy class="w-3 h-3" />
          JSONコピー
        </button>
      </li>

      <!-- JSON貼り付け -->
      <li>
        <button class="flex items-center gap-2 text-xs" @click="handlePasteJson">
          <ClipboardPaste class="w-3 h-3" />
          JSON貼り付け
        </button>
      </li>

      <li class="menu-title p-0"><hr class="border-base-300" /></li>

      <!-- 削除 -->
      <li>
        <button
          class="flex items-center gap-2 text-xs text-error hover:bg-error hover:text-error-content"
          @click="handleDelete"
        >
          <Trash2 class="w-3 h-3" />
          削除
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { BaseRecordType } from '@/types/core'
  import {
    eventCategory,
    EventCategoryType,
    AssetCategoryType,
    CategoryType,
    assetCategory,
    EventCategorySchemaMap,
    AssetCategorySchemaMap,
  } from '@/types/OmikujiData/'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { Eye, EyeOff, Copy, Trash2, MoreHorizontal, ClipboardCopy, ClipboardPaste } from 'lucide-vue-next'
  import { useGetEventData } from '@/editor/stores/useGetEventData'

  const props = defineProps<{
    item: BaseRecordType
    category: EventCategoryType | AssetCategoryType
  }>()

  const omikujiStore = useOmikujiStore()
  const navigationStore = useNavigationStore()

  // フォーカスを外してdropdownを閉じる
  const close = () => {
    ;(document.activeElement as HTMLElement)?.blur()
  }

  const { isEventCategory } = useGetEventData()

  const handleToggle = () => {
    if (isEventCategory(props.category)) {
      omikujiStore.updateEvent(props.category, props.item.key, {
        ...props.item,
        isEnabled: !Boolean(props.item.isEnabled),
      })
    } else {
      omikujiStore.updateAsset(props.category, props.item.key, {
        ...props.item,
        isEnabled: !Boolean(props.item.isEnabled),
      })
    }

    swalToast.success({ title: '有効・無効を更新しました' })
    close()
  }

  const handleDuplicate = () => {
    if (isEventCategory(props.category)) {
      omikujiStore.duplicateEvent(props.category, props.item.key)
    } else {
      omikujiStore.duplicateAsset(props.category, props.item.key)
    }

    swalToast.success({ title: '項目を複製しました' })
    close()
  }

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(props.item, null, 2))
      swalToast.success({ title: 'JSONをクリップボードにコピーしました' })
    } catch {
      swalToast.error({ title: 'コピーに失敗しました' })
    }
    close()
  }

  // 任意の値を CategoryType に絞り込む
  const toCategory = (value: unknown): CategoryType | undefined =>
    typeof value === 'string' && ([...eventCategory, ...assetCategory] as readonly string[]).includes(value)
      ? (value as CategoryType)
      : undefined

  const handlePasteJson = async () => {
    close()

    // 1. クリップボード読み取り
    let text: string
    try {
      text = await navigator.clipboard.readText()
    } catch {
      swalToast.error({ title: 'クリップボードの読み取りに失敗しました' })
      return
    }

    // 2. JSONパース（オブジェクト以外は弾く）
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      swalToast.error({ title: 'クリップボードの内容が正しいJSON形式ではありません' })
      return
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      swalToast.error({ title: 'クリップボードの内容が項目のJSONではありません' })
      return
    }

    // id / key / ruleType は貼り付け時に再生成・再決定するため除外
    const { id: _id, key: _key, ruleType, ...rest } = parsed as Record<string, unknown>

    // 3. カテゴリ互換性チェック
    const target = props.category
    const source = toCategory(ruleType) ?? target
    const isSame = source === target
    const isCrossEvent = !isSame && isEventCategory(source) && isEventCategory(target)

    if (!isSame && !isCrossEvent) {
      swalToast.error({
        title: 'カテゴリが異なるため貼り付けできません',
        text: `コピー元: ${source} → 貼り付け先: ${target}`,
      })
      return
    }

    if (isCrossEvent) {
      const result = await swalModal.confirmDelete({
        title: 'カテゴリが異なります',
        text: `「${source}」のデータを「${target}」として貼り付けます。\nトリガーなど一部の設定はリセットされますが、おみくじ設定は引き継がれます。よろしいですか？`,
        icon: 'warning',
        confirmButtonText: '貼り付け',
      })
      if (!result.isConfirmed) return
    }

    // 4. スキーマ検証 → 追加
    if (isEventCategory(target)) {
      const result = EventCategorySchemaMap[target].safeParse(rest)
      if (!result.success) {
        console.warn('[PasteJson] validation failed', result.error.issues)
        swalToast.error({ title: 'データの検証に失敗しました' })
        return
      }
      omikujiStore.addEvent(target, result.data)
    } else {
      const result = AssetCategorySchemaMap[target].safeParse(rest)
      if (!result.success) {
        console.warn('[PasteJson] validation failed', result.error.issues)
        swalToast.error({ title: 'データの検証に失敗しました' })
        return
      }
      omikujiStore.addAsset(target, result.data)
    }

    swalToast.success({
      title: isCrossEvent ? `「${source}」から変換して貼り付けました` : 'JSONを貼り付けました',
    })
  }

  const handleDelete = async () => {
    close()

    const name = props.item.name || '名前未設定'
    const result = await swalModal.confirmDelete({
      title: `「${name}」を削除しますか？`,
    })
    if (!result.isConfirmed) return

    navigationStore.selectNextItem()

    if (isEventCategory(props.category)) {
      omikujiStore.removeEvent(props.category, props.item.key)
    } else {
      omikujiStore.removeAsset(props.category, props.item.key)
    }

    swalToast.success({ title: `「${name}」を削除しました` })
  }
</script>
