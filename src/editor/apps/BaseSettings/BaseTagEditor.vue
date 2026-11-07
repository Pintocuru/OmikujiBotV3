<!-- src/editor/apps/BaseSettings/BaseTagEditor.vue -->
<template>
  <SettingItem icon="Tags" labelKey="baseSettings.tags.label" descriptionKey="baseSettings.tags.description">
    <div class="space-y-2">
      <!-- 設定済みのタグ -->
      <VueDraggable v-model="localTags" class="flex flex-wrap gap-2">
        <span v-for="(tag, index) in localTags" :key="tag" class="badge badge-sm badge-primary cursor-grab">
          {{ tag }}
          <span class="cursor-pointer ml-1" @click="removeTag(index)">✕</span>
        </span>
      </VueDraggable>

      <!-- タグ入力欄 -->
      <div class="flex gap-2">
        <input
          v-model="newTag"
          type="text"
          class="input input-bordered input-sm flex-1"
          :placeholder="t('baseSettings.tags.placeholder')"
          @keydown.enter="onEnter"
        />
        <button class="btn btn-sm btn-neutral" @click="addTag(newTag)">{{ t('baseSettings.tags.add') }}</button>
      </div>

      <!-- 既存タグの候補(クリックで追加) -->
      <template v-if="suggestions.length">
        <div class="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
          <button
            v-for="tag in suggestions"
            :key="tag"
            type="button"
            class="badge badge-sm badge-outline cursor-pointer hover:bg-accent hover:text-accent-content"
            @click="addTag(tag)"
          >
            + {{ tag }}
          </button>
        </div>
      </template>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { VueDraggable } from 'vue-draggable-plus'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { useTagSuggestions } from '@/editor/stores/useTagSuggestions'

  const props = defineProps<{ modelValue?: string[] }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
  const { t } = useI18n()

  const newTag = ref('')
  const localTags = ref<string[]>([...(props.modelValue ?? [])])

  // 候補: 他で使われているタグのうち、未追加かつ入力文字を含むもの
  const { allTags } = useTagSuggestions()
  const MAX_SUGGESTIONS = 30
  const suggestions = computed(() => {
    const q = newTag.value.trim().toLowerCase()
    return allTags.value
      .filter((t) => !localTags.value.includes(t))
      .filter((t) => !q || t.toLowerCase().includes(q))
      .slice(0, MAX_SUGGESTIONS)
  })

  // 親 → ローカル：内容が変わった時だけ同期
  watch(
    () => props.modelValue,
    (val) => {
      const incoming = val ?? []
      if (incoming.length === localTags.value.length && incoming.every((v, i) => v === localTags.value[i])) return
      localTags.value = [...incoming]
    }
  )

  // ローカル → 親：内容が変わった時だけ emit
  watch(localTags, (val) => {
    const current = props.modelValue ?? []
    if (val.length === current.length && val.every((v, i) => v === current[i])) return
    emit('update:modelValue', [...val])
  })

  const addTag = (raw: string) => {
    const value = raw.trim()
    if (!value) return
    // 重複は追加しない(:key="tag" の重複対策)
    if (!localTags.value.includes(value)) localTags.value = [...localTags.value, value]
    newTag.value = ''
  }

  // 日本語IMEの変換確定の Enter では追加しない
  const onEnter = (e: KeyboardEvent) => {
    if (e.isComposing) return
    addTag(newTag.value)
  }

  const removeTag = (index: number) => {
    localTags.value = localTags.value.filter((_, i) => i !== index)
  }
</script>
