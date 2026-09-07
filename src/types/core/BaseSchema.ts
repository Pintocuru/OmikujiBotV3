// shared/types/core/BaseSchema.ts
import { z } from "zod";
import { DaisyUIColorSchema } from "./DaisyUiTheme";
import { nanoid } from "nanoid";

/**
 * 基本のスキーマ
 */
export const generateId = () => nanoid();
export const idSchema = z.string().default(generateId).catch(generateId);
const dataSchema = z
  .string()
  .default(() => new Date().toISOString())
  .catch(() => new Date().toISOString());

export const BaseSchema = z.object({
  // 識別子
  id: idSchema, // ID
  key: idSchema, // 外部参照用キー
  // 基本情報
  name: z.string().default("").catch(""), // 名前
  description: z.string().default("").catch(""), // 説明
  // UI制御
  createdAt: dataSchema,
  updatedAt: dataSchema,
});
export type BaseTypes = z.infer<typeof BaseSchema>;

/**
 * UI付きのBase
 */
export const BaseRecordSchema = BaseSchema.extend({
  order: z.number().min(0).default(0).catch(0), // UI表示時の並び順
  isEnabled: z.boolean().default(true).catch(true), // 有効か(undefinedなら有効)
  tagColor: DaisyUIColorSchema.optional(), // 新タグカラー
  tags: z.array(z.string()).default([]).catch([]), // タグ
});
export type BaseRecordType = z.infer<typeof BaseRecordSchema>;
