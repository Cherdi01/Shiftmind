import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { hapticLight } from "../utils/haptics";

export function TabButton({
  label, icon, active, onPress, badge,
}: {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  active: boolean;
  onPress: () => void;
  badge?: number;
}) {
  return (
    <TouchableOpacity
      style={{ flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 16, backgroundColor: active ? "rgba(56,189,248,0.08)" : "transparent" }}
      onPress={() => { hapticLight(); onPress(); }}
      activeOpacity={0.7}
    >
      <View>
        <MaterialCommunityIcons name={icon} size={21} color={active ? "#38bdf8" : "#64748b"} />
        {badge != null && badge > 0 && (
          <View style={{ position: "absolute", top: -4, right: -8, backgroundColor: "#ef4444", borderRadius: 8, paddingHorizontal: 4, paddingVertical: 1, minWidth: 16, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontSize: 9, fontWeight: "900" }}>{badge > 9 ? "9+" : badge}</Text>
          </View>
        )}
      </View>
      <Text style={{ color: active ? "#38bdf8" : "#64748b", fontSize: 11, marginTop: 3, fontWeight: active ? "800" : "400" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
