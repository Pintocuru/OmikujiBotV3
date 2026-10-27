<!-- src/editor/assets/PostFlow/items/PostActionItem.vue -->
<template>
  <!-- グリッドレイアウト: 左1/3がプレビュー、右2/3が設定 -->
  <div class="grid grid-cols-3 gap-4">
    <!-- 左側: プレビューエリア -->
    <div class="col-span-1 min-h-xs">
      <PostActionPreview :action="action" />
    </div>

    <!-- 右側: 設定エリア -->
    <div class="col-span-2 space-y-2">
      <!-- ActionType -->
      <SettingItem
        layout="vertical"
        icon="Rocket"
        :label="t('postFlow.actionItem.typeLabel')"
        :description="t('postFlow.actionItem.typeDesc')"
      >
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(_, type) in postFlowKindMap"
            :key="type"
            class="badge badge-sm cursor-pointer"
            :class="action.kind === type ? 'badge-primary' : 'badge-outline'"
            @click="updateActionType(type)"
          >
            {{ t(`mapText.postFlowKind.${type}.label`) }}
          </span>
        </div>
      </SettingItem>

      <!-- 遅延秒数（全タイプ共通） -->
      <SettingItem
        layout="vertical"
        icon="Clock"
        :label="t('postFlow.actionItem.delayLabel')"
        :description="t('postFlow.actionItem.delayDesc')"
      >
        <input
          type="number"
          v-model.number="delaySeconds"
          :min="basicDelaySeconds * -1"
          step="0.1"
          class="input input-bordered input-sm w-32"
          placeholder="0"
        />
      </SettingItem>

      <!-- 動的コンポーネント表示 -->
      <component
        v-if="currentComponent"
        :is="currentComponent"
        v-bind="componentProps"
        @update:action="handleActionUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, ref } from 'vue'
  import {
    PostFlowType,
    PostFlowKind,
    PostFlowVariableSchema,
    PostFlowGameSchema,
    PostFlowBotSchema,
    PostFlowCallSchema,
    PostFlowMessageSchema,
    PostFlowSoundSchema,
    PostFlowWordPartySchema,
  } from '@/types/OmikujiData'
  import MessageSettings from '../Message/MessageSettings.vue'
  import SoundSettings from '../Sounds/SoundSettings.vue'
  import WordPartySettings from '../WordParty/WordPartySettings.vue'
  import VariableSettings from '../variable/VariableSettings.vue'
  import ActionSetSettings from '../actions/ActionSetSettings.vue'
  import PostActionPreview from '../preview/PostActionPreview.vue'
  import GameScriptSettings from '../gameScript/GameScriptSettings.vue'
  import BotSettings from '../Bot/BotSettings.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { postFlowKindMap } from '@/maps/OmikujiData'

  // Props
  const { t } = useI18n()

  const props = defineProps<{
    action: PostFlowType
    currentKey?: string // 編集中のアクションセットのキー(flowCall の循環参照チェック用)
  }>()

  // Emits
  const emit = defineEmits<{
    'update:action': [value: PostFlowType]
  }>()

  const omikujiStore = useOmikujiStore()
  const basicDelaySeconds = computed(() => omikujiStore.data.settings.generator.basicDelaySeconds ?? 1)

  // 現在表示すべきコンポーネントの決定
  const currentComponent = computed(() => {
    const componentMap: Record<PostFlowKind, any> = {
      message: MessageSettings,
      sound: SoundSettings,
      wordParty: WordPartySettings,
      variable: VariableSettings,
      gameScript: GameScriptSettings,
      bot: BotSettings,
      flowCall: ActionSetSettings,
    }

    return componentMap[props.action.kind]
  })

  // 動的コンポーネントへ渡す props（currentKey は flowCall だけが受け取る）
  const componentProps = computed(() =>
    props.action.kind === 'flowCall'
      ? { action: props.action as any, currentKey: props.currentKey }
      : { action: props.action as any }
  )

  // 遅延秒数のcomputed
  const delaySeconds = computed({
    get: () => props.action.delaySeconds,
    set: (value) => emit('update:action', { ...props.action, delaySeconds: value }),
  })

  // actionType 別の生データキャッシュ
  const rawActionCache = ref<Partial<Record<PostFlowKind, PostFlowType>>>({})

  // アクションタイプの更新
  const createDefaultAction = (kind: PostFlowKind, delaySeconds: number): PostFlowType => {
    switch (kind) {
      case 'message':
        return {
          kind,
          delaySeconds,
          uiKey: 'commentBubble',
          slots: {},
          characterKey: null,
          iconKey: 'default',
          sound: '',
          soundPath: '',
          message: '',
        } satisfies Extract<PostFlowType, { kind: 'message' }>

      case 'sound':
        return {
          kind,
          delaySeconds,
          sound: '',
          soundPath: '',
        } satisfies Extract<PostFlowType, { kind: 'sound' }>

      case 'wordParty':
        return {
          kind,
          delaySeconds,
          wordPartyId: '',
          repeat: 1,
        } satisfies Extract<PostFlowType, { kind: 'wordParty' }>

      case 'variable':
        return {
          kind,
          delaySeconds,
          message: '',
        } satisfies Extract<PostFlowType, { kind: 'variable' }>

      case 'gameScript':
        return {
          kind,
          delaySeconds,
          scriptId: '',
          characterKey: '',
          queryString: '',
        } satisfies Extract<PostFlowType, { kind: 'gameScript' }>

      case 'bot':
        return {
          kind,
          delaySeconds,
          botName: '',
          message: '',
        } satisfies Extract<PostFlowType, { kind: 'bot' }>

      case 'flowCall':
        return {
          kind,
          delaySeconds,
          callKeys: [],
        } satisfies Extract<PostFlowType, { kind: 'flowCall' }>
    }
  }

  const updateActionType = (newType: PostFlowKind) => {
    const current = props.action

    if (current.kind === newType) return

    // 現在のアクションをキャッシュ
    rawActionCache.value[current.kind] = { ...current }

    // 切り替え先のキャッシュを復元。なければ初期値を生成
    const restored = rawActionCache.value[newType] ?? createDefaultAction(newType, current.delaySeconds)

    // 種類ごとのスキーマで解析する
    const actionData = {
      ...restored,
      kind: newType,
      delaySeconds: current.delaySeconds,
    }

    let newAction: PostFlowType

    switch (newType) {
      case 'message':
        newAction = PostFlowMessageSchema.parse(actionData)
        break
      case 'sound':
        newAction = PostFlowSoundSchema.parse(actionData)
        break
      case 'wordParty':
        newAction = PostFlowWordPartySchema.parse(actionData)
        break
      case 'variable':
        newAction = PostFlowVariableSchema.parse(actionData)
        break
      case 'gameScript':
        newAction = PostFlowGameSchema.parse(actionData)
        break
      case 'bot':
        newAction = PostFlowBotSchema.parse(actionData)
        break
      case 'flowCall':
        newAction = PostFlowCallSchema.parse(actionData)
        break
    }

    emit('update:action', newAction)
  }

  // アクション更新のハンドラー
  const handleActionUpdate = (updatedAction: PostFlowType) => {
    emit('update:action', updatedAction)
  }
</script>
