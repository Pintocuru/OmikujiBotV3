<!-- src/editor/assets/PostFlow/tooltab/PostActionsTabs.vue -->
<template>
  <!-- タブヘッダー -->
  <div class="tabs tabs-box" role="tablist">
    <!-- PostActionタブ（内側にメニューの button を持つため、button ではなく div role="tab" にする） -->
    <div
      v-for="(action, index) in props.modelValue"
      :key="`action-${index}`"
      class="tab"
      :class="props.activeTab === index ? 'tab-active bg-info text-info-content' : ''"
      role="tab"
      tabindex="0"
      :aria-selected="props.activeTab === index"
      @click="emit('select-tab', index)"
      @keydown.enter.self.prevent="emit('select-tab', index)"
      @keydown.space.self.prevent="emit('select-tab', index)"
    >
      <!-- 左側：バッジと内容 -->
      <div class="flex items-center">
        <span class="badge badge-sm badge-primary mr-2">{{ index + 1 }}</span>
        <PostActionRow :action="action" />
      </div>

      <!-- 右側：メニュー -->
      <div @click.stop>
        <MenuDropdown @duplicate="emit('duplicate', index)" @delete="emit('remove', index)" />
      </div>
    </div>

    <!-- 追加ボタン -->
    <button type="button" class="tab tab-sm" @click="emit('add')">{{ t('postFlow.tabs.add') }}</button>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { PostFlowType } from '@/types/OmikujiData/'
  import PostActionRow from './PostActionRow.vue'
  import MenuDropdown from '@/editor/parts/MenuDropdown.vue'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: PostFlowType[]
    activeTab: number
  }>()

  const emit = defineEmits<{
    'select-tab': [index: number]
    add: []
    duplicate: [index: number]
    remove: [index: number]
  }>()
</script>
