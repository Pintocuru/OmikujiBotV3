<!-- src/editor/parts/MessageTextDialog/InlinePlaceholderDialog.vue -->
<!--
  簡易プレースホルダー入力ダイアログ
  << '候補1', '候補2', '候補3' >> 形式のテキストを生成して挿入する
-->
<template>
  <BaseDialog v-model:open="isOpen" :title="t('scenarioStep.inlinePh.title')" icon="Braces" size="xl">
    <div class="flex flex-col gap-3">
      <!-- 説明 -->
      <div class="alert alert-info text-xs py-2">
        <Info :size="14" />
        <span>
          {{ t('scenarioStep.inlinePh.descPre') }}<code class="font-mono">&lt;&lt; '候補A', '候補B' &gt;&gt;</code
          >{{ t('scenarioStep.inlinePh.descMid') }} <code class="font-mono">&lt;&lt;user&gt;&gt;</code
          >{{ t('scenarioStep.inlinePh.descPost') }}
        </span>
      </div>

      <!-- 候補リスト -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold">{{ t('scenarioStep.inlinePh.candidates') }}</span>
          <button class="btn btn-sm btn-secondary gap-2" @click="addItem">
            <Plus class="w-4 h-4" />
            {{ t('scenarioStep.common.add') }}
          </button>
        </div>

        <div class="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
          <div v-for="(item, idx) in items" :key="idx" class="flex items-center gap-2 group">
            <span class="text-xs text-base-content/40 w-5 text-right shrink-0">{{ idx + 1 }}</span>
            <input
              v-model="items[idx]"
              type="text"
              class="input input-bordered input-sm flex-1 font-mono text-sm"
              :placeholder="t('scenarioStep.inlinePh.candidatePlaceholder', { n: idx + 1, ph: '<<user>>' })"
              :autofocus="idx === 0"
              @keydown.enter="idx === items.length - 1 ? addItem() : undefined"
            />
            <button
              class="btn btn-sm btn-ghost btn-circle opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              :aria-label="t('scenarioStep.common.remove')"
              :disabled="items.length <= 1"
              @click="removeItem(idx)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <template #actions>
      <button class="btn btn-sm btn-ghost" @click="close">{{ t('scenarioStep.common.cancel') }}</button>
      <button class="btn btn-sm btn-primary gap-2" :disabled="!canInsert" @click="insert">
        <CornerDownLeft class="w-4 h-4" />
        {{ t('scenarioStep.common.insert') }}
      </button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, computed } from 'vue'
  import { Plus, Trash2, CornerDownLeft, Info } from 'lucide-vue-next'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'

  const { t } = useI18n()

  const emit = defineEmits<{ insert: [text: string] }>()

  const isOpen = ref(false)
  const items = ref<string[]>(['', ''])

  const open = () => {
    items.value = ['', '']
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const addItem = () => {
    items.value.push('')
  }

  const removeItem = (idx: number) => {
    if (items.value.length > 1) items.value.splice(idx, 1)
  }

  // 有効な候補（空文字除外）
  const validItems = computed(() => items.value.filter((s) => s.trim() !== ''))

  const canInsert = computed(() => validItems.value.length >= 1)

  // プレビュー: << '...', '...' >> 形式
  const preview = computed(() => {
    if (!canInsert.value) return ''
    if (validItems.value.length === 1) {
      // 候補が1つなら通常テキストとして返す
      return validItems.value[0]
    }
    const joined = validItems.value.map((s) => `'${s.replace(/'/g, "\\'")}'`).join(',\n  ')
    return `<<\n  ${joined}\n>>`
  })

  const insert = () => {
    if (!canInsert.value) return
    emit('insert', preview.value)
    close()
  }

  // 親から open() を呼べるよう公開
  defineExpose({ open })
</script>
