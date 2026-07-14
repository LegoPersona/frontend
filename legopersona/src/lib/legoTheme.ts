import type { HairColor, SkinTone } from "@/types/persona";

export const LEGO = {
  red: "#E3000B",
  yellow: "#FFD500",
  blue: "#006DB7",
  dark: "#1B1B1B",
} as const;

export const HAIR_HEX: Record<HairColor, string | null> = {
  black: "#1B1B1B",
  brown: "#7B4A21",
  blonde: "#F2C744",
  red: "#C0392B",
  gray: "#9AA0A6",
  white: "#F4F4F4",
  bald: null,
};

export const SKIN_HEX: Record<SkinTone, string> = {
  light: "#FBE3B3",
  medium: "#E8A85C",
  dark: "#9C5B23",
};

export const HAIR_OPTIONS: HairColor[] = [
  "black", "brown", "blonde", "red", "gray", "white", "bald",
];

export const SKIN_OPTIONS: SkinTone[] = ["light", "medium", "dark"];

export const timeAgo = (iso: string): string => {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 3600) return `${Math.max(1, Math.floor(d / 60))}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
};