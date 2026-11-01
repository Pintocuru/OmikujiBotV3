<!-- src/editor/assets/mikuji/weight/WeightItemDialogs.vue -->
<!-- 名前・説明 / 追加条件 / 実行内容 の 3 つのダイアログ(開いているものだけ作る) -->
<template>
  <BaseDialog
    v-if="opened === 'base'"
    :open="true"
    icon="Pencil"
    title="名前・説明"
    size="xl"
    @update:open="emit('close')"
  >
    <div class="space-y-2">
      <BaseEditor
        :modelValue="baseModel"
        :category="null"
        :showEnabledToggle="false"
        :showTags="false"
        @update:modelValue="updateBase"
      />
    </div>
  </BaseDialog>

  <BaseDialog
    v-if="opened === 'condition'"
    :open="true"
    icon="Filter"
    title="追加条件"
    size="3xl"
    @update:open="emit('close')"
  >
    <div class="space-y-2">
      <OmikujiItemPriority :omikujiItem="item" @update="emit('update:item', $event)" />
    </div>
  </BaseDialog>

  <BaseDialog v-if="opened === 'run'" :open="true" icon="Zap" title="実行内容" size="3xl" @update:open="emit('close')">
    <div class="space-y-2">
      <OmikujiItemEditor :omikujiItem="item" @update="emit('update:item', $event)" />
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BaseRecordSchema, type BaseRecordType } from '@/types/core'
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import type { WeightDialogName } from '../composables/useWeightItemDialog'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import BaseEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import OmikujiItemEditor from '../item/OmikujiItemEditor.vue'
  import OmikujiItemPriority from '../item/OmikujiItemPriority.vue'

  const props = defineProps<{
    item: OmikujiItemType
    opened: WeightDialogName | null
  }>()

  const emit = defineEmits<{
    close: []
    'update:item': [item: OmikujiItemType]
  }>()

  // BaseEditor は BaseRecordType(order / isEnabled / tags など UI 用の項目つき)を要求する。
  // おみくじアイテムは BaseSchema ベースでそれらを持たないので、parse で既定値を補って渡す
  const baseModel = computed<BaseRecordType>(() => BaseRecordSchema.parse(props.item))

  // 編集するのは名前と説明だけ。UI 用の補完値はアイテムに書き戻さない
  const updateBase = (value: BaseRecordType) => {
    emit('update:item', { ...props.item, name: value.name, description: value.description })
  }
</script>
