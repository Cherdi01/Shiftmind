import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ThemeColors } from "../theme";
import { hapticLight } from "../utils/haptics";

const MONTH_NAMES = [
  "Januar","Februar","März","April","Mai","Juni",
  "Juli","August","September","Oktober","November","Dezember",
];

export function MonthPickerModal({
  visible,
  currentYear,
  currentMonth,
  t,
  onSelect,
  onClose,
}: {
  visible: boolean;
  currentYear: number;
  currentMonth: number;
  t: ThemeColors;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
}) {
  const today = new Date();
  // 6 Monate in der Vergangenheit bis 12 in der Zukunft
  const options: { year: number; month: number }[] = [];
  for (let offset = -6; offset <= 12; offset++) {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    options.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={{
          backgroundColor: t.bgCard, borderRadius: 24, padding: 8,
          width: 260, maxHeight: 400,
          borderWidth: 1, borderColor: t.border,
        }}>
          <Text style={{ color: t.textMuted, fontWeight: "800", fontSize: 13, textAlign: "center", paddingVertical: 12 }}>
            Monat wählen
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map(({ year, month }) => {
              const isSelected = year === currentYear && month === currentMonth;
              const isToday = year === today.getFullYear() && month === today.getMonth();
              return (
                <TouchableOpacity
                  key={`${year}-${month}`}
                  onPress={() => { hapticLight(); onSelect(year, month); onClose(); }}
                  style={{
                    paddingVertical: 13, paddingHorizontal: 20,
                    backgroundColor: isSelected ? t.accentMuted : "transparent",
                    borderRadius: 14, marginHorizontal: 4, marginBottom: 2,
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                  }}
                >
                  <Text style={{
                    color: isSelected ? t.accent : t.textPrimary,
                    fontWeight: isSelected ? "900" : "600",
                    fontSize: 15,
                  }}>
                    {MONTH_NAMES[month]} {year}
                  </Text>
                  {isToday && (
                    <View style={{ backgroundColor: t.accent, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ color: t.bgDeep, fontSize: 10, fontWeight: "900" }}>Heute</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
