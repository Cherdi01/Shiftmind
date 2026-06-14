import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EmptyState } from "../components/EmptyState";
import { WasteIcon } from "../components/WasteIcon";
import { ThemeColors } from "../theme";
import { AssignedShift, DayTask, ShiftTemplate, WasteType } from "../types";
import { calcShiftDuration, calcWeeklyHours, formatDuration } from "../utils/time";

const CATEGORY_ICONS: Record<string, any> = {
  early:    "weather-sunset-up",
  late:     "weather-sunset-down",
  night:    "weather-night",
  day:      "white-balance-sunny",
  training: "school-outline",
  free:     "beach",
  custom:   "briefcase-outline",
};
const WASTE_LABELS: Record<WasteType, string> = {
  GREEN: "Grüntonne", BIO: "Biotonne", BLACK: "Restmüll", GLASS: "Glas",
};

export function HomeScreen({ assigned, templates, tasks, wasteMap, t }: {
  assigned: AssignedShift[];
  templates: ShiftTemplate[];
  tasks: DayTask[];
  wasteMap: Record<number, WasteType[]>;
  t: ThemeColors;
}) {
  const today = new Date().getDate();

  const upcomingShifts = useMemo(
    () => [...assigned].filter((s) => s.day >= today).sort((a, b) => a.day - b.day),
    [assigned, today]
  );

  const next = upcomingShifts[0];
  const nextTemplate = templates.find((tmpl) => tmpl.code === next?.code);
  const daysUntil = next ? next.day - today : null;
  const daysUntilLabel =
    daysUntil === 0 ? "Heute" : daysUntil === 1 ? "Morgen" :
    daysUntil != null ? `In ${daysUntil} Tagen` : null;

  const monthlyHours = useMemo(() => {
    const shifts = assigned.map((a) => templates.find((t) => t.code === a.code)).filter(Boolean) as ShiftTemplate[];
    return calcWeeklyHours(shifts);
  }, [assigned, templates]);

  const shiftStats = useMemo(() => {
    const counts: Record<string, number> = {};
    assigned.forEach((a) => {
      const tmpl = templates.find((t) => t.code === a.code);
      if (!tmpl || tmpl.category === "free") return;
      counts[tmpl.category] = (counts[tmpl.category] ?? 0) + 1;
    });
    return counts;
  }, [assigned, templates]);

  const openTasks = tasks.filter((task) => !task.done && task.day >= today).slice(0, 5);
  const todayWaste = wasteMap[today] ?? [];
  const preview = upcomingShifts.slice(1, 5);

  const card = { backgroundColor: t.bgCard, borderRadius: 22, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: t.border };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>

      {/* Nächster Dienst */}
      <View style={card}>
        <Text style={{ color: t.accent, fontWeight: "800", fontSize: 16, marginBottom: 10 }}>Nächster Dienst</Text>
        {next ? (
          <>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 }}>
              {nextTemplate && <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: nextTemplate.color }} />}
              <Text style={{ color: t.textPrimary, fontSize: 24, fontWeight: "900" }}>{next.code}</Text>
              {daysUntilLabel && (
                <View style={{ backgroundColor: t.accentMuted, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 }}>
                  <Text style={{ color: t.accent, fontSize: 12, fontWeight: "800" }}>{daysUntilLabel}</Text>
                </View>
              )}
            </View>
            {nextTemplate && (
              <>
                <Text style={{ color: t.textMuted, fontSize: 14 }}>
                  {nextTemplate.name} · Tag {next.day} · {nextTemplate.startTime} – {nextTemplate.endTime}
                </Text>
                {calcShiftDuration(nextTemplate.startTime, nextTemplate.endTime) != null && (
                  <View style={{ backgroundColor: t.bgDeep, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", borderWidth: 1, borderColor: t.border, marginTop: 6 }}>
                    <Text style={{ color: t.textMuted, fontSize: 12, fontWeight: "700" }}>
                      ⏱ {formatDuration(calcShiftDuration(nextTemplate.startTime, nextTemplate.endTime)!)}
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        ) : (
          <EmptyState icon="calendar-check" title="Kein weiterer Dienst" subtitle="Diesen Monat sind keine Dienste mehr eingetragen." />
        )}
      </View>

      {/* Müll heute */}
      {todayWaste.length > 0 && (
        <View style={card}>
          <Text style={{ color: t.accent, fontWeight: "800", fontSize: 16, marginBottom: 10 }}>⚠️ Heute: Müllabfuhr</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {todayWaste.map((w, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <WasteIcon type={w} size={20} />
                <Text style={{ color: t.textSecondary, fontSize: 15 }}>{WASTE_LABELS[w]}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Monatsstunden */}
      {monthlyHours > 0 && (
        <View style={card}>
          <Text style={{ color: t.accent, fontWeight: "800", fontSize: 16, marginBottom: 10 }}>Monat im Überblick</Text>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
            <Text style={{ color: t.textPrimary, fontSize: 26, fontWeight: "900" }}>{formatDuration(monthlyHours)}</Text>
            <Text style={{ color: t.textMuted, fontSize: 14 }}>gesamt</Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {Object.entries(shiftStats).map(([cat, count]) => (
              <View key={cat} style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: t.bgDeep, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: t.border }}>
                <MaterialCommunityIcons name={CATEGORY_ICONS[cat]} size={14} color={t.textMuted} />
                <Text style={{ color: t.textMuted, fontSize: 12, fontWeight: "700" }}>{count}× {cat}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Kommende Dienste */}
      {preview.length > 0 && (
        <View style={card}>
          <Text style={{ color: t.accent, fontWeight: "800", fontSize: 16, marginBottom: 10 }}>Kommende Dienste</Text>
          {preview.map((shift) => {
            const tmpl = templates.find((t) => t.code === shift.code);
            const dur = tmpl ? calcShiftDuration(tmpl.startTime, tmpl.endTime) : null;
            return (
              <View key={shift.day} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: t.bgDeep }}>
                <MaterialCommunityIcons name={CATEGORY_ICONS[tmpl?.category ?? "custom"]} size={18} color={tmpl?.color ?? t.textMuted} />
                <Text style={{ color: t.textMuted, fontSize: 13, width: 52, fontWeight: "700" }}>Tag {shift.day}</Text>
                <View style={{ minWidth: 36, paddingVertical: 3, paddingHorizontal: 4, borderRadius: 9, alignItems: "center", backgroundColor: tmpl?.color ?? "#ef4444" }}>
                  <Text style={{ color: "#020617", fontSize: 10, fontWeight: "900" }}>{shift.code}</Text>
                </View>
                <Text style={{ color: t.textMuted, flex: 1, fontSize: 13 }}>{tmpl ? `${tmpl.startTime}–${tmpl.endTime}` : ""}</Text>
                {dur && <Text style={{ color: t.borderStrong, fontSize: 12, fontWeight: "700" }}>{formatDuration(dur)}</Text>}
              </View>
            );
          })}
        </View>
      )}

      {/* Offene Aufgaben */}
      <View style={card}>
        <Text style={{ color: t.accent, fontWeight: "800", fontSize: 16, marginBottom: 10 }}>Offene Aufgaben</Text>
        {openTasks.length === 0 ? (
          <EmptyState icon="check-circle-outline" title="Alles erledigt 🎉" subtitle="Keine offenen Aufgaben mehr." />
        ) : (
          openTasks.map((task) => (
            <View key={task.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
              <Text style={{ color: t.accent, fontSize: 20, marginRight: 10 }}>○</Text>
              <Text style={{ color: t.textSecondary, fontSize: 15 }}>Tag {task.day}: {task.text}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
