// src/common/Dialog/dialogState.ts
// 確認・通知ダイアログを Promise で呼ぶ API と、表示待ちの一覧。表示する側は DialogHost.vue
// 既定の文言(OK・キャンセル等)は configureDialogLabels で外から注入する(i18n に依存しない。注入しないときは英語)
import { ref } from 'vue'

export type DialogTone = 'info' | 'success' | 'warning' | 'error' | 'question'
export type DialogButtonVariant = 'primary' | 'error' | 'warning' | 'neutral'

/** 本文。html は受け付けない(文字列・箇条書き・補足に分けて渡す) */
export type DialogBody = {
  text?: string
  items?: string[]
  note?: string
}

export type DialogLabels = {
  ok: string
  cancel: string
  confirm: string
  delete: string
  deleteTitle: string
  deleteText: string
}

const DEFAULT_LABELS: DialogLabels = {
  ok: 'OK',
  cancel: 'Cancel',
  confirm: 'OK',
  delete: 'Delete',
  deleteTitle: 'Delete this?',
  deleteText: 'This cannot be undone.',
}

let labelSource: () => Partial<DialogLabels> = () => ({})

/** 既定の文言を設定する。関数で渡すと、ダイアログを開くたびに呼ぶ(言語の切り替えに追従できる) */
export const configureDialogLabels = (source: Partial<DialogLabels> | (() => Partial<DialogLabels>)) => {
  labelSource = typeof source === 'function' ? source : () => source
}

const labels = (): DialogLabels => ({ ...DEFAULT_LABELS, ...labelSource() })

// ---- 表示待ちの一覧 ----
export type DialogChoice = { key: string; label: string; variant: DialogButtonVariant }

export type DialogInput = {
  defaultValue: string
  placeholder?: string
  validate?: (value: string) => string | null
}

export type DialogResult = { key: string | null; value?: string }

export type DialogRequest = {
  id: number
  tone: DialogTone
  title: string
  body: DialogBody
  choices: DialogChoice[]
  /** null ならキャンセルボタンなし(Esc・外側クリックで閉じたときは key: null) */
  cancelLabel: string | null
  /** true なら、最初のフォーカスをキャンセルに置く(削除など取り消せない操作) */
  focusCancel: boolean
  input?: DialogInput
  resolve: (result: DialogResult) => void
}

export const dialogRequests = ref<DialogRequest[]>([])

let nextId = 1

const open = (request: Omit<DialogRequest, 'id' | 'resolve'>): Promise<DialogResult> =>
  new Promise((resolve) => {
    dialogRequests.value = [...dialogRequests.value, { ...request, id: nextId++, resolve }]
  })

export const removeDialogRequest = (id: number) => {
  dialogRequests.value = dialogRequests.value.filter((request) => request.id !== id)
}

// ---- 公開 API ----
type WithBody = DialogBody & { title: string }

export type AlertOptions = WithBody & {
  tone?: Exclude<DialogTone, 'question'>
  okLabel?: string
}

export type ConfirmOptions = WithBody & {
  tone?: DialogTone
  confirmLabel?: string
  cancelLabel?: string
  /** 取り消せない操作のとき true(確定ボタンが赤くなり、最初のフォーカスがキャンセルに置かれる) */
  danger?: boolean
}

export type ConfirmDeleteOptions = Partial<WithBody> & {
  confirmLabel?: string
  cancelLabel?: string
}

export type ChooseOptions = WithBody & {
  tone?: DialogTone
  choices: { key: string; label: string; variant?: DialogButtonVariant }[]
  cancelLabel?: string
}

export type PromptOptions = {
  title: string
  text?: string
  tone?: DialogTone
  defaultValue?: string
  placeholder?: string
  confirmLabel?: string
  cancelLabel?: string
  /** エラー文言を返すと確定できない。問題なければ null */
  validate?: (value: string) => string | null
}

const bodyOf = ({ text, items, note }: DialogBody): DialogBody => ({ text, items, note })

export const dialog = {
  /** 知らせるだけ(OK 1 つ) */
  async alert(options: AlertOptions): Promise<void> {
    await open({
      tone: options.tone ?? 'info',
      title: options.title,
      body: bodyOf(options),
      choices: [{ key: 'ok', label: options.okLabel ?? labels().ok, variant: 'primary' }],
      cancelLabel: null,
      focusCancel: false,
    })
  },

  /** 実行してよいかの確認。確定なら true */
  async confirm(options: ConfirmOptions): Promise<boolean> {
    const result = await open({
      tone: options.tone ?? 'question',
      title: options.title,
      body: bodyOf(options),
      choices: [
        {
          key: 'confirm',
          label: options.confirmLabel ?? labels().confirm,
          variant: options.danger ? 'error' : 'primary',
        },
      ],
      cancelLabel: options.cancelLabel ?? labels().cancel,
      focusCancel: options.danger ?? false,
    })
    return result.key === 'confirm'
  },

  /** 削除の確認。確定なら true */
  async confirmDelete(options: ConfirmDeleteOptions = {}): Promise<boolean> {
    const { text, items, note } = options
    const hasBody = Boolean(text || items?.length || note)
    const l = labels()
    const result = await open({
      tone: 'warning',
      title: options.title ?? l.deleteTitle,
      body: hasBody ? bodyOf({ text, items, note }) : { text: l.deleteText },
      choices: [{ key: 'confirm', label: options.confirmLabel ?? l.delete, variant: 'error' }],
      cancelLabel: options.cancelLabel ?? l.cancel,
      focusCancel: true,
    })
    return result.key === 'confirm'
  },

  /** 3 つ以上の選択肢から選ぶ。選んだ choices の key を返す(キャンセル・Esc は null) */
  async choose(options: ChooseOptions): Promise<string | null> {
    const result = await open({
      tone: options.tone ?? 'question',
      title: options.title,
      body: bodyOf(options),
      choices: options.choices.map((choice) => ({ ...choice, variant: choice.variant ?? 'neutral' })),
      cancelLabel: options.cancelLabel ?? labels().cancel,
      focusCancel: false,
    })
    return result.key
  },

  /** 文字列の入力。確定した値を返す(キャンセル・Esc は null。前後の空白はそのまま) */
  async prompt(options: PromptOptions): Promise<string | null> {
    const result = await open({
      tone: options.tone ?? 'question',
      title: options.title,
      body: { text: options.text },
      choices: [{ key: 'confirm', label: options.confirmLabel ?? labels().confirm, variant: 'primary' }],
      cancelLabel: options.cancelLabel ?? labels().cancel,
      focusCancel: false,
      input: { defaultValue: options.defaultValue ?? '', placeholder: options.placeholder, validate: options.validate },
    })
    return result.key === 'confirm' ? (result.value ?? '') : null
  },
}
