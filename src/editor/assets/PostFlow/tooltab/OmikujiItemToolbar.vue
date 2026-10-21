<!-- src/editor/assets/PostFlow/tooltab/OmikujiItemToolbar.vue -->
<template>
  <div class="form-control">
    <div class="flex justify-between items-center mb-1">
      <label class="label">
        <span class="label-text font-medium"> </span>
      </label>

      <div class="flex gap-2">
        <!-- delaySeconds調整コンポーネント -->
        <DelaySecondsAdjuster :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />

        <!-- テスト投稿ボタン -->
        <button
          @click="() => postTestOmikujiItem(modelValue)"
          class="btn btn-sm btn-info tooltip tooltip-top"
          :data-tip="t('postFlow.toolbar.testTip')"
          :disabled="modelValue.length === 0"
        >
          <Send :size="16" />
          {{ t('postFlow.toolbar.test') }}
        </button>

        <!-- JSONコピー -->
        <button
          @click="handleCopy"
          class="btn btn-sm btn-secondary tooltip tooltip-top"
          :data-tip="t('postFlow.toolbar.copyTip')"
          type="button"
          :disabled="clipboard.isCopying.value"
        >
          <ClipboardCopy :size="16" />
          {{ t('postFlow.toolbar.copy') }}
        </button>

        <!-- JSONペースト -->
        <button
          @click="handlePaste"
          class="btn btn-sm btn-secondary tooltip tooltip-top"
          :data-tip="t('postFlow.toolbar.pasteTip')"
          type="button"
          :disabled="clipboard.isPasting.value"
        >
          <ClipboardPaste :size="16" />
          {{ t('postFlow.toolbar.paste') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { PostFlowType, PostFlowArraySchema } from '@/types/OmikujiData'
  import DelaySecondsAdjuster from './DelaySecondsAdjuster.vue'
  import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { useTestPost } from '@/editor/helpers/useTestPost'
  import { Send, ClipboardCopy, ClipboardPaste } from 'lucide-vue-next'
  import { useJsonClipboard } from '@/editor/helpers/useJsonClipboard'

  // Props
  const { t } = useI18n()

  const props = defineProps<{
    modelValue: PostFlowType[]
  }>()

  // Emits
  const emit = defineEmits<{
    'update:modelValue': [value: PostFlowType[]]
  }>()

  const { postTestOmikujiItem } = useTestPost()

  // PostFlowType[] 用クリップボード
  const clipboard = useJsonClipboard<PostFlowType[]>({
    parse: (raw) => {
      const result = PostFlowArraySchema.safeParse(raw)
      return result.success ? result.data : null
    },
  })

  const handleCopy = async () => {
    await clipboard.copyJson(props.modelValue)
  }

  const handlePaste = async () => {
    const parsed = await clipboard.pasteJson()

    if (parsed === null) {
      swalToast.error({
        title: t('postFlow.toolbar.pasteFailed', { error: clipboard.lastError.value }),
      })
      return
    }

    const result = await swalModal.confirmTriple({
      title: t('postFlow.toolbar.pasteTitle'),
      text: t('postFlow.toolbar.pasteText'),
    })

    if (result.isConfirmed) {
      emit('update:modelValue', parsed)
      swalToast.success({ title: t('postFlow.toolbar.pasteOverwrite') })
    } else if (result.isDenied) {
      emit('update:modelValue', [...props.modelValue, ...parsed])
      swalToast.success({ title: t('postFlow.toolbar.pasteMerge') })
    }
  }
</script>
