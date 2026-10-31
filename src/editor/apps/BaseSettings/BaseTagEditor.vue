<!-- src/editor/apps/BaseSettings/BaseTagEditor.vue -->
<template>
  <SettingItem icon="Tags" labelKey="baseSettings.tags.label" descriptionKey="baseSettings.tags.description">
    <VueDraggable v-model="localTags" class="flex flex-wrap gap-2 mb-2 min-h-8">
      <span v-for="(tag, index) in localTags" :key="tag" class="badge badge-sm badge-primary cursor-grab">
        {{ tag }}
        <span class="cursor-pointer ml-1" @click="removeTag(index)">✕</span>
      </span>
    </VueDraggable>

    <div class="flex gap-2">
      <input
        v-model="newTag"
        type="text"
        class="input input-bordered input-sm flex-1"
        placeholder="タグを追加"
        @keydown.enter="onEnter"
      />
      <button class="btn btn-sm btn-primary" @click="addTag(newTag)">追加</button>
    </div>

    <!-- 既存タグの候補(クリックで追加) -->
    <div v-if="suggestions.length" class="mt-2">
      <div class="text-xs text-base-content/60 mb-1">候補(クリックで追加)</div>
      <div class="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
        <button
          v-for="tag in suggestions"
          :key="tag"
          type="button"
          class="badge badge-sm badge-outline cursor-pointer hover:badge-primary"
          @click="addTag(tag)"
        >
          + {{ tag }}
        </button>
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { VueDraggable } from 'vue-draggable-plus'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { useTagSuggestions } from '@/editor/stores/useTagSuggestions'

  const props = defineProps<{ modelValue?: string[] }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

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
