import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { WasteType } from "../types";
import { styles } from "./styles";

export function WasteIcon({ type, size = 14 }: { type: WasteType; size?: number }) {
  if (type === "GLASS") {
    return <MaterialCommunityIcons name="package-variant" size={size} color="#3b82f6" style={styles.wasteIcon} />;
  }

  const colorMap: Record<Exclude<WasteType, "GLASS">, string> = {
    GREEN: "#22c55e",
    BIO: "#8b5a2b",
    BLACK: "#111827",
  };

  return <MaterialCommunityIcons name="trash-can" size={size} color={colorMap[type]} style={styles.wasteIcon} />;
}
