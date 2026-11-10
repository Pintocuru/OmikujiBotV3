// src/common/LucideIcon/useLucideIcon.ts
import type { Component } from 'vue'
import * as L from 'lucide-vue-next'

// 追加手順: 該当カテゴリに1行足すだけ(import 側の編集は不要)。
// 分類は「使う場所」ではなく「意味」で決める。迷ったら末尾の「演出・装飾」へ。
export const lucideIconMap = {
  // ── イベント・通知 ──
  MessageSquare: L.MessageSquare,
  Timer: L.Timer,
  Clock: L.Clock,
  Hourglass: L.Hourglass,
  Activity: L.Activity,
  Zap: L.Zap,
  Bell: L.Bell,
  Megaphone: L.Megaphone,
  Gift: L.Gift,

  // ── 構造・レイアウト・ドキュメント ──
  Layers: L.Layers,
  LayoutGrid: L.LayoutGrid,
  Box: L.Box,
  Package: L.Package, // resolver の既定値(削除しない)
  Home: L.Home,
  ListChecks: L.ListChecks,
  FileText: L.FileText,
  FilePen: L.FilePen,
  Tv: L.Tv,

  // ── 人・ユーザー ──
  User: L.User,
  UserRound: L.UserRound,
  UserSquare: L.UserSquare,
  UserPlus: L.UserPlus,
  Users: L.Users,
  Crown: L.Crown,
  Bot: L.Bot,

  // ── 設定・調整 ──
  Settings: L.Settings,
  Sliders: L.Sliders,
  SlidersHorizontal: L.SlidersHorizontal,
  ToggleRight: L.ToggleRight,
  Cpu: L.Cpu,
  Palette: L.Palette,
  Type: L.Type,
  Image: L.Image,
  Languages: L.Languages,

  // ── 操作 ──
  Pencil: L.Pencil,
  Trash2: L.Trash2,
  Download: L.Download,
  Send: L.Send,
  Search: L.Search,
  Filter: L.Filter,
  Merge: L.Merge,
  Repeat: L.Repeat,
  Link: L.Link,

  // ── コード・識別子 ──
  Brackets: L.Brackets,
  Braces: L.Braces,
  Code2: L.Code2,
  Hash: L.Hash,
  Tag: L.Tag,
  Tags: L.Tags,
  Key: L.Key,
  Fingerprint: L.Fingerprint,

  // ── 状態・警告 ──
  Info: L.Info,
  TriangleAlert: L.TriangleAlert,
  Shield: L.Shield,
  Ban: L.Ban,

  // ── 演出・装飾(ゲーム・キャラ・遊び心) ──
  Trophy: L.Trophy,
  Gamepad2: L.Gamepad2,
  Swords: L.Swords,
  Sparkles: L.Sparkles,
  Smile: L.Smile,
  ThumbsUp: L.ThumbsUp,
  PartyPopper: L.PartyPopper,
  Volume2: L.Volume2,
  Rocket: L.Rocket,
  Apple: L.Apple,
  Bomb: L.Bomb,
  Rabbit: L.Rabbit,
  Flower2: L.Flower2,
  Clover: L.Clover,
  Cookie: L.Cookie,
  DraftingCompass: L.DraftingCompass,
} as const satisfies Record<string, Component>

// map から union 型を生成
export type LucideIconName = keyof typeof lucideIconMap

// map だけを参照する安全な resolver
export function resolveLucideIcon(iconName: LucideIconName | undefined): Component {
  return lucideIconMap[iconName ?? 'Package']
}
