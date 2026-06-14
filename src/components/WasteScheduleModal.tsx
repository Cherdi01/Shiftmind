import React, { useState } from "react";
import { BottomSheet } from './BottomSheet';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeColors } from "../theme";
import { WasteScheduleEntry, WasteType, WasteWeekday } from "../types";
import { WasteIcon } from "./WasteIcon";
import { hapticLight } from "../utils/haptics";

const WASTE_LABELS: Record<WasteType, string> = {
  GREEN: "Grüntonne", BIO: "Biotonne", BLACK: "Restmüll", GLASS: "Glas",
};
const WASTE_TYPES: WasteType[] = ["BLACK", "GREEN", "BIO", "GLASS"];
const WEEKDAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const FREQ_LABELS = { weekly: "Wöchentlich", biweekly: "Zweiwöchentlich (A/B)" };

export function WasteScheduleModal({
  visible, schedule, t, onAdd, onDelete, onClose,
}: {
  visible: boolean;
  schedule: WasteScheduleEntry[];
  t: ThemeColors;
  onAdd: (entry: Omit<WasteScheduleEntry, "id">) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [weekday, setWeekday] = useState<WasteWeekday>(3);
  const [type, setType] = useState<WasteType>("BLACK");
  const [alternateType, setAlternateType] = useState<WasteType>("GREEN");
  const [frequency, setFrequency] = useState<"weekly" | "biweekly">("weekly");

  function handleAdd() {
    hapticLight();
    const entry: Omit<WasteScheduleEntry, "id"> = {
      type, weekday, frequency,
      ...(frequency === "biweekly" && {
        alternateType,
        referenceDate: new Date().toISOString().split("T")[0],
      }),
    };
    onAdd(entry);
  }

  const row = { flexDirection: "row" as const, alignItems: "center" as const, backgroundColor: t.bgDeep, borderRadius: 14, padding: 10, marginBottom: 8, gap: 8 };
  const block = { backgroundColor: t.bgDeep, borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: t.border };
  const label = { color: t.accent, fontWeight: "800" as const, fontSize: 14, marginBottom: 8 };

  return (
    <BottomSheet visible={visible} t={t} onClose={onClose} maxHeight="92%">
      <View>
          <Text style={{ color: t.textPrimary, fontSize: 22, fontWeight: "900", marginBottom: 14 }}>Müllplan verwalten</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Neuer Eintrag */}
            <View style={block}>
              <Text style={label}>Neuer Abholtermin</Text>

              {/* Wochentag */}
              <Text style={{ color: t.textMuted, fontSize: 13, marginBottom: 6 }}>Wochentag</Text>
              <View style={{ flexDirection: "row", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                {WEEKDAY_LABELS.map((d, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => { hapticLight(); setWeekday(i as WasteWeekday); }}
                    style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: weekday === i ? t.accent : t.bgCard, borderWidth: 1, borderColor: weekday === i ? t.accent : t.border }}
                  >
                    <Text style={{ color: weekday === i ? t.bgDeep : t.textMuted, fontWeight: "800", fontSize: 13 }}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Häufigkeit */}
              <Text style={{ color: t.textMuted, fontSize: 13, marginBottom: 6 }}>Häufigkeit</Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                {(["weekly", "biweekly"] as const).map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => { hapticLight(); setFrequency(f); }}
                    style={{ flex: 1, padding: 10, borderRadius: 12, backgroundColor: frequency === f ? t.accentMuted : t.bgCard, borderWidth: 1, borderColor: frequency === f ? t.accent : t.border, alignItems: "center" }}
                  >
                    <Text style={{ color: frequency === f ? t.accent : t.textMuted, fontWeight: "800", fontSize: 12 }}>{FREQ_LABELS[f]}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Tonne(n) */}
              <Text style={{ color: t.textMuted, fontSize: 13, marginBottom: 6 }}>
                {frequency === "biweekly" ? "Tonne Woche A" : "Tonne"}
              </Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: frequency === "biweekly" ? 12 : 0 }}>
                {WASTE_TYPES.map((wt) => (
                  <TouchableOpacity
                    key={wt}
                    onPress={() => { hapticLight(); setType(wt); }}
                    style={{ flex: 1, alignItems: "center", padding: 8, borderRadius: 12, backgroundColor: type === wt ? t.accentMuted : t.bgCard, borderWidth: 1, borderColor: type === wt ? t.accent : t.border }}
                  >
                    <WasteIcon type={wt} size={18} />
                    <Text style={{ color: type === wt ? t.accent : t.textMuted, fontSize: 10, fontWeight: "800", marginTop: 4 }}>{WASTE_LABELS[wt]}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {frequency === "biweekly" && (
                <>
                  <Text style={{ color: t.textMuted, fontSize: 13, marginBottom: 6 }}>Tonne Woche B</Text>
                  <View style={{ flexDirection: "row", gap: 8, marginBottom: 0 }}>
                    {WASTE_TYPES.map((wt) => (
                      <TouchableOpacity
                        key={wt}
                        onPress={() => { hapticLight(); setAlternateType(wt); }}
                        style={{ flex: 1, alignItems: "center", padding: 8, borderRadius: 12, backgroundColor: alternateType === wt ? t.accentMuted : t.bgCard, borderWidth: 1, borderColor: alternateType === wt ? t.accent : t.border }}
                      >
                        <WasteIcon type={wt} size={18} />
                        <Text style={{ color: alternateType === wt ? t.accent : t.textMuted, fontSize: 10, fontWeight: "800", marginTop: 4 }}>{WASTE_LABELS[wt]}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <TouchableOpacity
                style={{ backgroundColor: t.accent, padding: 14, borderRadius: 16, alignItems: "center", marginTop: 14 }}
                onPress={handleAdd}
              >
                <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 15 }}>Abholtermin hinzufügen</Text>
              </TouchableOpacity>
            </View>

            {/* Bestehende Einträge */}
            {schedule.length > 0 && (
              <View style={block}>
                <Text style={label}>Aktuelle Termine</Text>
                {schedule.map((entry) => (
                  <View key={entry.id} style={row}>
                    <WasteIcon type={entry.type} size={18} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: t.textSecondary, fontWeight: "700", fontSize: 14 }}>
                        {WEEKDAY_LABELS[entry.weekday]}s · {WASTE_LABELS[entry.type]}
                        {entry.alternateType ? ` / ${WASTE_LABELS[entry.alternateType]}` : ""}
                      </Text>
                      <Text style={{ color: t.textMuted, fontSize: 12 }}>
                        {FREQ_LABELS[entry.frequency]}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => { hapticLight(); onDelete(entry.id); }}>
                      <MaterialCommunityIcons name="trash-can-outline" size={20} color={t.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <TouchableOpacity style={{ padding: 15, alignItems: "center" }} onPress={onClose}>
            <Text style={{ color: t.textMuted, fontWeight: "800" }}>Schließen</Text>
          </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
