import React from "react";
import { Text, View } from "react-native";
import { calcShiftDuration, formatDuration } from "../utils/time";

export function ShiftDurationBadge({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) {
  const hours = calcShiftDuration(startTime, endTime);
  if (!hours) return null;
  return (
    <View
      style={{
        backgroundColor: "#0f172a",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: "#1e293b",
        alignSelf: "flex-start",
        marginTop: 6,
      }}
    >
      <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700" }}>
        ⏱ {formatDuration(hours)}
      </Text>
    </View>
  );
}
