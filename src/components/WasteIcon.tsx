import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { WasteType } from "../types";

const COLOR_MAP: Record<WasteType, string> = {
  GREEN: "#22c55e",
  BIO:   "#a16207",  // dunkleres Braun – besser sichtbar
  BLACK: "#94a3b8",  // hellgrau statt schwarz – im Darkmode erkennbar
  GLASS: "#3b82f6",
};

const ICON_MAP: Record<WasteType, string> = {
  GREEN: "trash-can",
  BIO:   "trash-can",
  BLACK: "trash-can",
  GLASS: "package-variant",
};

export function WasteIcon({ type, size = 14 }: { type: WasteType; size?: number }) {
  return (
    <MaterialCommunityIcons
      name={ICON_MAP[type] as any}
      size={size}
      color={COLOR_MAP[type]}
      style={{ marginHorizontal: 1 }}
    />
  );
}
