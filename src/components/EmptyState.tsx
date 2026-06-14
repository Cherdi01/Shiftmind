import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
};

export function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <View style={{ alignItems: "center", paddingVertical: 32, gap: 10 }}>
      <MaterialCommunityIcons name={icon} size={48} color="#1e293b" />
      <Text style={{ color: "#475569", fontSize: 16, fontWeight: "800", textAlign: "center" }}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={{ color: "#334155", fontSize: 14, textAlign: "center", lineHeight: 20 }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
