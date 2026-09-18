<!-- src/editor/assets/box/OmikujiItemHeader.vue -->
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <!-- 名前 -->
    <SettingItem label="おみくじ名" description="識別しやすい名前を入力">
      <input
        type="text"
        :value="omikujiItem.name"
        @input="updateName(($event.target as HTMLInputElement).value)"
        placeholder="おみくじ名"
        class="input input-bordered input-sm w-full"
      />
    </SettingItem>

    <!-- クールダウン -->
    <SettingItem
      v-if="omikujiItem.kind === 'postFlow'"
      label="クールダウン"
      description="これ以降の実行を一定時間ブロックします（秒）"
    >
      <input
        type="number"
        :value="omikujiItem.cooldownSeconds ?? 0"
        @input="updateCooldown(($event.target as HTMLInputElement).value)"
        min="0"
        step="0.1"
        class="input input-bordered input-sm w-full"
      />
    </SettingItem>
  </div>

  <!-- 優先設定 -->
  <OmikujiItemPriority :omikujiItem="omikujiItem" @update="emit('update', $event)" />
</template>

<script setup lang="ts">
  import { OmikujiItemType } from '@/types/OmikujiData/'
  import OmikujiItemPriority from './OmikujiItemPriority.vue'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'

  const props = defineProps<{
    omikujiItem: OmikujiItemType
  }>()

  const emit = defineEmits<{
    update: [item: OmikujiItemType]
  }>()

  // 名前更新
  const updateName = (value: string) => {
    emit('update', {
      ...props.omikujiItem,
      name: value,
    })
  }

  // クールダウン更新
  const updateCooldown = (value: string) => {
    if (props.omikujiItem.kind !== 'postFlow') return

    const num = parseFloat(value)
    const safe = isNaN(num) || num < 0 ? 0 : num

    emit('update', {
      ...props.omikujiItem,
      cooldownSeconds: safe,
    })
  }
</script>
