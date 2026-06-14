import { AppTheme } from "../types";

export type ThemeColors = {
  bg:           string;
  bgCard:       string;
  bgDeep:       string;
  bgInput:      string;
  border:       string;
  borderStrong: string;
  accent:       string;
  accentMuted:  string;
  textPrimary:  string;
  textSecondary:string;
  textMuted:    string;
  tabBar:       string;
  danger:       string;
  success:      string;
};

const dark: ThemeColors = {
  bg:           "#050b14",
  bgCard:       "#0f172a",
  bgDeep:       "#020617",
  bgInput:      "#020617",
  border:       "#1e293b",
  borderStrong: "#334155",
  accent:       "#38bdf8",
  accentMuted:  "#172554",
  textPrimary:  "#f8fafc",
  textSecondary:"#e2e8f0",
  textMuted:    "#94a3b8",
  tabBar:       "#07111f",
  danger:       "#ef4444",
  success:      "#22c55e",
};

const midnight: ThemeColors = {
  bg:           "#000000",
  bgCard:       "#0a0a14",
  bgDeep:       "#000000",
  bgInput:      "#0a0a14",
  border:       "#1a1a2e",
  borderStrong: "#2a2a4a",
  accent:       "#818cf8",
  accentMuted:  "#1e1b4b",
  textPrimary:  "#f1f5f9",
  textSecondary:"#cbd5e1",
  textMuted:    "#64748b",
  tabBar:       "#050508",
  danger:       "#f87171",
  success:      "#34d399",
};

const light: ThemeColors = {
  bg:           "#f1f5f9",
  bgCard:       "#ffffff",
  bgDeep:       "#f8fafc",
  bgInput:      "#f8fafc",
  border:       "#e2e8f0",
  borderStrong: "#cbd5e1",
  accent:       "#0284c7",
  accentMuted:  "#e0f2fe",
  textPrimary:  "#0f172a",
  textSecondary:"#1e293b",
  textMuted:    "#64748b",
  tabBar:       "#ffffff",
  danger:       "#dc2626",
  success:      "#16a34a",
};

export const THEMES: Record<AppTheme, ThemeColors> = { dark, midnight, light };

export function getTheme(theme: AppTheme): ThemeColors {
  return THEMES[theme] ?? dark;
}
