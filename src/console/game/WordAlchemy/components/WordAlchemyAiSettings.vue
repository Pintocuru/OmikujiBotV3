<!-- src/console/game/WordAlchemy/components/WordAlchemyAiSettings.vue -->
<!-- AI の接続先の設定。メインとサブの 2 つ。キーは伏せ字の入力欄で、保存が成功したあとは画面に戻ってこない (末尾 4 文字のヒントだけ) -->
<template>
  <div class="absolute inset-0 z-30 flex flex-col gap-3 overflow-y-auto bg-base-300/95 p-4 text-base-content">
    <div class="flex items-center gap-3">
      <h2 class="text-lg font-bold">{{ messages.title }}</h2>
      <button class="btn btn-ghost btn-square btn-sm ml-auto" :aria-label="messages.close" @click="emit('close')">
        <X :size="18" />
      </button>
    </div>
    <ul class="list-inside list-disc text-xs opacity-70">
      <li>{{ messages.noteFallback }}</li>
      <li>{{ messages.noteMock }}</li>
      <li>{{ messages.noteKey }}</li>
    </ul>

    <section v-for="slot in AI_SLOT_KEYS" :key="slot" class="rounded-lg bg-base-100/60 p-3">
      <label class="flex items-center gap-2 font-bold">
        <input v-model="forms[slot].enabled" type="checkbox" class="toggle toggle-sm" />
        {{ messages.slot[slot] }}
      </label>
      <div v-if="forms[slot].enabled" class="mt-2 grid grid-cols-[6.5rem_1fr] items-center gap-x-2 gap-y-2 text-sm">
        <span>{{ messages.provider }}</span>
        <select
          v-model="forms[slot].provider"
          class="select select-bordered select-sm"
          @change="onProviderChange(slot)"
        >
          <option v-for="key in AI_PROVIDERS" :key="key" :value="key">{{ messages.providers[key] }}</option>
        </select>
        <span>{{ messages.baseUrl }}</span>
        <input v-model="forms[slot].baseUrl" type="text" class="input input-bordered input-sm" spellcheck="false" />
        <span>{{ messages.model }}</span>
        <input v-model="forms[slot].model" type="text" class="input input-bordered input-sm" spellcheck="false" />
        <span>{{ messages.apiKey }}</span>
        <input
          v-model="forms[slot].apiKey"
          type="password"
          autocomplete="off"
          class="input input-bordered input-sm"
          :placeholder="savedHint(slot)"
        />
      </div>
    </section>

    <div class="flex items-center gap-3">
      <button class="btn btn-primary btn-sm" :disabled="busy" @click="onSave">{{ messages.save }}</button>
      <span v-if="problem || error" class="text-xs text-error">{{ problem || error }}</span>
      <span v-else-if="saved" class="text-xs text-success">{{ messages.saved }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { X } from '@lucide/vue'
  import { reactive, ref, watch } from 'vue'
  import {
    AI_SLOT_KEYS,
    type AiProviderType,
    type AiSlotKeyType,
    type LoadAiSettingsResponseType,
    type SaveAiSettingsRequestType,
  } from '@/types/api'
  import { wordAlchemyMessages } from '../maps/WordAlchemyMessageMap'

  const props = defineProps<{ settings: LoadAiSettingsResponseType | null; busy: boolean; error: string }>()
  const emit = defineEmits<{ close: []; save: [request: SaveAiSettingsRequestType] }>()

  const messages = wordAlchemyMessages.ai
  const AI_PROVIDERS: AiProviderType[] = ['openai', 'anthropic']
  /** プロバイダごとの、baseURL の初期値 */
  const DEFAULT_BASE_URL: Record<AiProviderType, string> = {
    openai: 'https://api.openai.com/v1',
    anthropic: 'https://api.anthropic.com',
  }

  type Form = { enabled: boolean; provider: AiProviderType; baseUrl: string; model: string; apiKey: string }
  const toForm = (slot: AiSlotKeyType): Form => {
    const saved = props.settings?.[slot]
    return saved
      ? { enabled: true, provider: saved.provider, baseUrl: saved.baseUrl, model: saved.model, apiKey: '' }
      : { enabled: false, provider: 'openai', baseUrl: DEFAULT_BASE_URL.openai, model: '', apiKey: '' }
  }
  const forms = reactive<Record<AiSlotKeyType, Form>>({ main: toForm('main'), sub: toForm('sub') })

  /** プロバイダを変えたとき、baseURL が初期値のままなら、新しいプロバイダの初期値にする */
  const onProviderChange = (slot: AiSlotKeyType) => {
    const form = forms[slot]
    const isDefault = Object.values(DEFAULT_BASE_URL).includes(form.baseUrl) || form.baseUrl === ''
    if (isDefault) form.baseUrl = DEFAULT_BASE_URL[form.provider]
  }

  const savedHint = (slot: AiSlotKeyType) => {
    const saved = props.settings?.[slot]
    return saved ? messages.keySaved(saved.keyHint) : messages.keyNew
  }

  const problem = ref('')
  const saved = ref(false)
  /** 保存の結果待ち。成功が分かるまで、入力欄のキーは消さない */
  let saving = false

  const onSave = () => {
    problem.value = ''
    saved.value = false
    const request: SaveAiSettingsRequestType = { main: null, sub: null }
    for (const slot of AI_SLOT_KEYS) {
      const form = forms[slot]
      if (!form.enabled) continue
      if (!form.baseUrl.trim() || !form.model.trim()) {
        problem.value = messages.needFields(messages.slot[slot])
        return
      }
      if (!form.apiKey.trim() && !props.settings?.[slot]) {
        problem.value = messages.needKey(messages.slot[slot])
        return
      }
      request[slot] = {
        provider: form.provider,
        baseUrl: form.baseUrl.trim(),
        model: form.model.trim(),
        apiKey: form.apiKey.trim(),
      }
    }
    emit('save', request)
    saving = true
  }

  // 保存の結果は、親 (useAiSettings) の設定が書き換わった (成功) か、エラー文言が出た (失敗) ことで受ける
  watch(
    () => props.settings,
    () => {
      if (!saving || props.busy || props.error) return
      saving = false
      // 保存に成功したら、入力欄のキーを消す (画面に残さない)
      for (const slot of AI_SLOT_KEYS) forms[slot].apiKey = ''
      saved.value = true
    }
  )
  watch(
    () => props.error,
    () => {
      if (saving && props.error) saving = false
    }
  )
</script>
