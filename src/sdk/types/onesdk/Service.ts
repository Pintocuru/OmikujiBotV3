//
import z from "zod";

// @onecomme.com/onesdk/types/Service
export const serviceTypeMap = {
  platforms: "配信プラットフォーム",
  youtube: "YouTube",
  twicas: "ツイキャス",
  twitch: "Twitch",
  niconama: "ニコニコ生放送",
  showroom: "SHOWROOM",
  bilibili: "bilibili",
  mirrativ: "Mirrativ",
  mixch: "ミクチャ",
  twitter: "X(Twitter)",
  doneru: "Doneru",
  tiktok: "TikTok",
  streamlabs: "Streamlabs",
  kick: "Kick",
  vtips: "VTips",
  external: "外部サービス",
  system: "システム内部",
} as const;

// そこから型と配列を生成
export type EnabledServiceType = keyof typeof serviceTypeMap;
export type ServiceType = Exclude<EnabledServiceType, "platforms">;

// 配列は Map のキーから抽出
export const enabledService = Object.keys(
  serviceTypeMap,
) as readonly EnabledServiceType[];
export const serviceTypeValues = enabledService.filter(
  (key): key is ServiceType => key !== "platforms",
);

// Zodスキーマ
export const EnabledServiceConditionSchema = z
  .enum(enabledService)
  .default("platforms")
  .catch("platforms");
