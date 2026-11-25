// src/ui/counter/CookieCounter/editor/CounterSelector/counterTypes.ts
export interface CounterItem {
  id: string
  type: 'default' | 'event' | 'variable'
  target: string
  label?: string
}
