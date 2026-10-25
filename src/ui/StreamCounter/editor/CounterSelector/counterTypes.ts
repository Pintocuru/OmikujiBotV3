// src/ui/StreamCounter/editor/CounterSelector/counterTypes.ts
export interface CounterItem {
  id: string
  type: 'default' | 'event' | 'variable'
  target: string
  label?: string
}
