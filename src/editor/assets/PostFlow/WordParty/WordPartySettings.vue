<!-- src/editor/assets/PostFlow/WordParty/WordPartySettings.vue -->
<template>
  <div class="space-y-2">
    <!-- WordParty ID -->
    <SettingItem label="🎉 WordParty" description="WordPartyのID">
      <input
        type="text"
        v-model="wordPartyIdValue"
        class="input input-bordered input-sm flex-1"
        placeholder="WordParty ID"
      />
    </SettingItem>

    <!-- Repeat -->
    <SettingItem label="🔁 繰り返し回数" description="WordPartyを実行する回数（最大20回）">
      <div class="flex items-center gap-2 flex-1">
        <select v-model="repeatMode" class="select select-bordered select-sm w-32">
          <option value="none">なし（1回）</option>
          <option value="fixed">固定値</option>
          <option value="viewer">視聴者数</option>
          <option value="upVote">高評価数</option>
        </select>

        <input
          v-if="repeatMode === 'fixed'"
          type="number"
          v-model.number="repeatNumber"
          class="input input-bordered input-sm w-24"
          min="1"
          max="20"
          placeholder="回数"
        />

        <span v-if="repeatMode === 'viewer' || repeatMode === 'upVote'" class="text-xs text-gray-500">
          (最大20回)
        </span>
      </div>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostFlowWordPartyType } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const props = defineProps<{
    action: PostFlowWordPartyType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostFlowWordPartyType]
  }>()

  // 共通のupdateAction関数
  const updateAction = (updates: Partial<PostFlowWordPartyType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  // WordParty ID用のcomputedプロパティ
  const wordPartyIdValue = computed({
    get: () => props.action.wordPartyId,
    set: (value) => updateAction({ wordPartyId: value }),
  })

  // Repeat モードの判定
  const repeatMode = computed({
    get: (): 'none' | 'fixed' | 'viewer' | 'upVote' => {
      const repeat = props.action.repeat
      if (repeat === undefined) return 'none'
      if (typeof repeat === 'number') return 'fixed'
      if (repeat === 'viewer') return 'viewer'
      if (repeat === 'upVote') return 'upVote'
      return 'none'
    },
    set: (mode: 'none' | 'fixed' | 'viewer' | 'upVote') => {
      const repeatValues = {
        none: undefined,
        fixed: 1,
        viewer: 'viewer' as const,
        upVote: 'upVote' as const,
      }
      updateAction({ repeat: repeatValues[mode] })
    },
  })

  // 固定値の数値
  const repeatNumber = computed({
    get: (): number => {
      const repeat = props.action.repeat
      return typeof repeat === 'number' ? repeat : 1
    },
    set: (value: number) => {
      const clampedValue = Math.min(Math.max(value, 1), 20)
      updateAction({ repeat: clampedValue })
    },
  })
</script>
