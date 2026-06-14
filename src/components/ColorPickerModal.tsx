import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { ThemeColors } from "../theme";
import { hapticLight } from "../utils/haptics";

const PRESET_COLORS = [
  // Blues
  "#38bdf8","#0ea5e9","#3b82f6","#6366f1",
  // Purples
  "#a78bfa","#8b5cf6","#ec4899","#f43f5e",
  // Greens
  "#34d399","#10b981","#22c55e","#84cc16",
  // Yellows / Oranges
  "#fbbf24","#f59e0b","#f97316","#ef4444",
  // Neutrals
  "#94a3b8","#64748b","#475569","#e2e8f0",
];

export function ColorPickerModal({
  visible,
  currentColor,
  t,
  onSelect,
  onClose,
}: {
  visible: boolean;
  currentColor: string;
  t: ThemeColors;
  onSelect: (color: string) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(currentColor);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "center", alignItems: "center" }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={{ backgroundColor: t.bgCard, borderRadius: 24, padding: 20, width: 300, borderWidth: 1, borderColor: t.border }}
          // Verhindert Schließen bei Tap auf den Modal-Inhalt
        >
          <Text style={{ color: t.textPrimary, fontWeight: "900", fontSize: 18, marginBottom: 16 }}>
            Farbe wählen
          </Text>

          {/* Vorschau */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16, backgroundColor: t.bgDeep, borderRadius: 14, padding: 12 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: selected }} />
            <Text style={{ color: t.textMuted, fontSize: 14 }}>{selected}</Text>
          </View>

          {/* Farbpalette */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
            {PRESET_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => { hapticLight(); setSelected(color); }}
                style={{
                  width: 40, height: 40, borderRadius: 20,
                  backgroundColor: color,
                  borderWidth: selected === color ? 3 : 1,
                  borderColor: selected === color ? t.textPrimary : "transparent",
                }}
              />
            ))}
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={{ backgroundColor: t.accent, padding: 14, borderRadius: 16, alignItems: "center", marginBottom: 8 }}
            onPress={() => { hapticLight(); onSelect(selected); onClose(); }}
          >
            <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 15 }}>Übernehmen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 12, alignItems: "center" }}
            onPress={onClose}
          >
            <Text style={{ color: t.textMuted, fontWeight: "800" }}>Abbrechen</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
