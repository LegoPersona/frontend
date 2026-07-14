export const LEGO = {
  red: "#E3000B",
  yellow: "#FFD500",
  blue: "#006DB7",
  dark: "#1B1B1B",
} as const;

export const timeAgo = (iso: string): string => {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 3600) return `${Math.max(1, Math.floor(d / 60))}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
};
