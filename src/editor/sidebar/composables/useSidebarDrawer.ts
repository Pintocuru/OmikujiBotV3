// src/editor/sidebar/composables/useSidebarDrawer.ts
import { ref } from 'vue'

// サイドバー(ドロワー)の開閉。上部バーのボタンとサイドバー本体で共有するため、モジュール内で1つだけ持つ
const isOpen = ref(false)

export const useSidebarDrawer = () => {
  const open = () => (isOpen.value = true)
  const close = () => (isOpen.value = false)
  const toggle = () => (isOpen.value = !isOpen.value)

  return { isOpen, open, close, toggle }
}
