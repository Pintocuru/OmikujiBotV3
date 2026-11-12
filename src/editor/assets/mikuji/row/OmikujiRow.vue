<!-- src/editor/assets/mikuji/row/OmikujiRow.vue -->
<!-- おみくじ 1 行分(おみくじ本体 → 実行内容 → クールダウン)と、そこから開く 3 つのダイアログ -->
<template>
  <!-- VueDraggable の要素は単一ルートである必要があるため、ダイアログも同じ div の中に置く -->
  <div>
    <!-- 列幅は MikujiSettings のヘッダーと同じ(変更時は両方を揃えること) -->
    <div class="grid grid-cols-[minmax(18rem,1fr)_1rem_16rem_7rem] items-center gap-2">
      <OmikujiRowSummary
        :item="item"
        :percentage="percentage"
        @select="emit('select')"
        @open="open"
        @update:weight="emit('update:weight', $event)"
        @duplicate="emit('duplicate')"
        @delete="emit('delete')"
      />

      <span class="text-center">→</span>

      <OmikujiRowRun :item="item" @open="open('run')" />

      <OmikujiRowCooldown :item="item" @update:item="emit('update:item', $event)" />
    </div>

    <!-- ダイアログ(開いているものだけ作る) -->
    <BaseDialog
      v-if="opened === 'base'"
      open
      icon="Pencil"
      :title="t('omikujiItem.dialogs.baseTitle')"
      size="xl"
      @update:open="close"
    >
      <BaseEditor
        :modelValue="baseModel"
        :category="null"
        :showEnabledToggle="false"
        :showTags="false"
        @update:modelValue="updateBase"
      />
    </BaseDialog>

    <BaseDialog
      v-if="opened === 'condition'"
      open
      icon="Filter"
      :title="t('omikujiItem.priority.sectionTitle')"
      size="3xl"
      @update:open="close"
    >
      <OmikujiItemPriority :omikujiItem="item" @update="emit('update:item', $event)" />
    </BaseDialog>

    <BaseDialog
      v-if="opened === 'run'"
      open
      icon="Zap"
      :title="t('omikujiItem.editor.kind.label')"
      size="3xl"
      @update:open="close"
    >
      <OmikujiItemEditor :omikujiItem="item" @update="emit('update:item', $event)" />
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { BaseRecordSchema, type BaseRecordType } from '@/types/core'
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import BaseEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import OmikujiItemEditor from '../item/OmikujiItemEditor.vue'
  import OmikujiItemPriority from '../item/OmikujiItemPriority.vue'
  import OmikujiRowSummary from './OmikujiRowSummary.vue'
  import OmikujiRowRun from './OmikujiRowRun.vue'
  import OmikujiRowCooldown from './OmikujiRowCooldown.vue'

  const { t } = useI18n()

  const props = defineProps<{
    item: OmikujiItemType
    /** 出現確率(%)。優先アイテムなど抽選外のときは null */
    percentage: string | null
  }>()

  const emit = defineEmits<{
    'update:weight': [weight: number]
    'update:item': [item: OmikujiItemType]
    select: []
    duplicate: []
    delete: []
  }>()

  // 開いているダイアログ(同時に開くのは 1 つだけ)
  const opened = ref<'base' | 'condition' | 'run' | null>(null)
  const open = (name: 'base' | 'condition' | 'run') => {
    opened.value = name
  }
  const close = () => {
    opened.value = null
  }

  // BaseEditor は BaseRecordType(order / isEnabled / tags など UI 用の項目つき)を要求する。
  // おみくじアイテムは BaseSchema ベースでそれらを持たないので、parse で既定値を補って渡す
  const baseModel = computed<BaseRecordType>(() => BaseRecordSchema.parse(props.item))

  // 編集するのは名前と説明だけ。UI 用の補完値はアイテムに書き戻さない
  const updateBase = (value: BaseRecordType) => {
    emit('update:item', { ...props.item, name: value.name, description: value.description })
  }
</script>
