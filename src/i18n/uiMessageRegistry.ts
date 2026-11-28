// src/i18n/uiMessageRegistry.ts
export type UiMessageModules = Record<string, Record<string, unknown>>

const registeredUiMessages: UiMessageModules = {}

export const registerUiMessages = (messages: UiMessageModules) => Object.assign(registeredUiMessages, messages)
export const getRegisteredUiMessages = (): UiMessageModules => registeredUiMessages
