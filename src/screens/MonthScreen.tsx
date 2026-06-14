import React, { useMemo, useRef, useState } from "react";
import {
  PanResponder, ScrollView, Text, TouchableOpacity, View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MonthPickerModal } from "../components/MonthPickerModal";
import { WasteIcon } from "../components/WasteIcon";
import { EmptyState } from "../components/EmptyState";
import { ThemeColors } from "../theme";
import { CalendarEvent, DayTask, FeatureFlags, ShiftTemplate, WasteType } from "../types";
import { hapticLight } from "../utils/haptics";
import { getHolidayMapForMonth, getStateCode } from "../services/holidayService";
import { getSchoolHolidayMap } from "../services/schoolHolidayService";

const MONTH_NAMES = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const WEEKDAY_LABELS = ["Mo","Di","Mi","Do","Fr","Sa","So"];
const LEGEND = [
  { color: "#38bdf8", label: "Frühdienst" },
  { color: "#f59e0b", label: "Spätdienst" },
  { color: "#a78bfa", label: "Nachtdienst" },
  { color: "#34d399", label: "Tagdienst" },
  { color: "#fb7185", label: "Fortbildung" },
  { color: "#64748b", label: "Frei" },
];

export function MonthScreen({
  assignedMap, templateMap, tasks, wasteMap, events, stateCode, features, t,
  onDayPress, onImportPress, onNewTemplatePress, onWastePress,
}: {
  assignedMap: Record<number, string>;
  templateMap: Record<string, ShiftTemplate>;
  tasks: DayTask[];
  wasteMap: Record<number, WasteType[]>;
  events: CalendarEvent[];
  stateCode: string;
  features: FeatureFlags;
  t: ThemeColors;
  onDayPress: (day: number) => void;
  onImportPress: () => void;
  onNewTemplatePress: () => void;
  onWastePress: () => void;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [showPicker, setShowPicker] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const swipeStartX = useRef(0);

  const { daysInMonth, leadingBlanks, prevMonthDays } = useMemo(() => {
    const dim = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return {
      daysInMonth: dim,
      leadingBlanks: firstDay === 0 ? 6 : firstDay - 1,
      prevMonthDays: new Date(year, month, 0).getDate(),
    };
  }, [year, month]);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const todayDay = today.getFullYear() === year && today.getMonth() === month ? today.getDate() : null;
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const holidayMap = useMemo(
    () => features.holidaysEnabled ? getHolidayMapForMonth(year, month, stateCode) : {},
    [year, month, stateCode, features.holidaysEnabled]
  );
  const schoolHolidayMap = useMemo(
    () => features.schoolHolidaysEnabled ? getSchoolHolidayMap(year, month, stateCode) : {},
    [year, month, stateCode, features.schoolHolidaysEnabled]
  );
  const eventCountMap = useMemo(() => {
    if (!features.eventsEnabled) return {};
    const map: Record<number, number> = {};
    events.forEach((e) => {
      if (e.recurring ? e.month === month : true) map[e.day] = (map[e.day] ?? 0) + 1;
    });
    return map;
  }, [events, month, features.eventsEnabled]);

  const shiftCount = days.filter((d) => {
    const code = assignedMap[d];
    const tmpl = code ? templateMap[code.toUpperCase()] : undefined;
    return tmpl && tmpl.category !== "free";
  }).length;

  function prevMonth() { hapticLight(); month === 0 ? (setMonth(11), setYear(y => y-1)) : setMonth(m => m-1); }
  function nextMonth() { hapticLight(); month === 11 ? (setMonth(0), setYear(y => y+1)) : setMonth(m => m+1); }

  const trailingCount = (() => {
    const total = leadingBlanks + daysInMonth;
    return total % 7 === 0 ? 0 : 7 - (total % 7);
  })();

  // Swipe-Erkennung
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 20 && Math.abs(gs.dy) < 40,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -50) nextMonth();
        else if (gs.dx > 50) prevMonth();
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Navigation */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <TouchableOpacity style={{ backgroundColor: t.bgCard, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: t.border }} onPress={prevMonth}>
            <Text style={{ color: t.textPrimary, fontSize: 20, fontWeight: "900" }}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { hapticLight(); setShowPicker(true); }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: t.textPrimary, fontSize: 22, fontWeight: "900" }}>{MONTH_NAMES[month]} {year}</Text>
              {!isCurrentMonth && <Text style={{ color: t.accent, fontSize: 11, fontWeight: "800" }}>antippen zum Wählen</Text>}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: t.bgCard, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: t.border }} onPress={nextMonth}>
            <Text style={{ color: t.textPrimary, fontSize: 20, fontWeight: "900" }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Stat + Heute + Legende Toggle */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <Text style={{ color: t.textMuted, fontSize: 13, fontWeight: "700" }}>
            {shiftCount > 0 ? `📋 ${shiftCount} Dienste` : ""}
          </Text>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            {!isCurrentMonth && (
              <TouchableOpacity onPress={() => { hapticLight(); setYear(today.getFullYear()); setMonth(today.getMonth()); }}>
                <Text style={{ color: t.accent, fontSize: 13, fontWeight: "800" }}>Heute →</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => { hapticLight(); setShowLegend(v => !v); }}
              style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: t.bgCard, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: t.border }}
            >
              <MaterialCommunityIcons name="map-legend" size={14} color={showLegend ? t.accent : t.textMuted} />
              <Text style={{ color: showLegend ? t.accent : t.textMuted, fontSize: 11, fontWeight: "800" }}>Legende</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legende – ein-/ausblendbar */}
        {showLegend && (
          <View style={{ backgroundColor: t.bgCard, borderRadius: 16, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.border }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {LEGEND.map((item) => (
                <View key={item.color} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color }} />
                  <Text style={{ color: t.textMuted, fontSize: 12 }}>{item.label}</Text>
                </View>
              ))}
              {features.holidaysEnabled && <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}><Text style={{ fontSize: 10 }}>🎉</Text><Text style={{ color: t.textMuted, fontSize: 12 }}>Feiertag</Text></View>}
              {features.schoolHolidaysEnabled && <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}><Text style={{ fontSize: 10 }}>🏖</Text><Text style={{ color: t.textMuted, fontSize: 12 }}>Schulferien</Text></View>}
              {features.eventsEnabled && <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}><Text style={{ fontSize: 10 }}>📅</Text><Text style={{ color: t.textMuted, fontSize: 12 }}>Event</Text></View>}
            </View>
          </View>
        )}

        {/* Aktions-Buttons */}
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
          {[
            { label: "📄 Import",  fn: onImportPress },
            ...(features.wasteEnabled ? [{ label: "🗑 Müll", fn: onWastePress }] : []),
            { label: "＋ Dienst", fn: onNewTemplatePress },
          ].map(({ label, fn }) => (
            <TouchableOpacity key={label} style={{ flex: 1, backgroundColor: t.bgCard, padding: 10, borderRadius: 16, borderWidth: 1, borderColor: t.border }} onPress={() => { hapticLight(); fn(); }}>
              <Text style={{ color: t.textSecondary, fontSize: 12, fontWeight: "700", textAlign: "center" }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Schulferien-Banner */}
        {features.schoolHolidaysEnabled && todayDay && schoolHolidayMap[todayDay] && (
          <View style={{ backgroundColor: "#1e3a1e", borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#22c55e" }}>
            <Text style={{ color: "#22c55e", fontWeight: "800", fontSize: 14 }}>🏖 {schoolHolidayMap[todayDay]}</Text>
            <Text style={{ color: "#86efac", fontSize: 12, marginTop: 2 }}>Heute ist schulfrei</Text>
          </View>
        )}

        {/* Kalender */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", backgroundColor: t.bgCard, borderRadius: 22, padding: 8, marginBottom: 10, borderWidth: 1, borderColor: t.border }}>
          {WEEKDAY_LABELS.map((d) => (
            <Text key={d} style={{ width: "14.285%", textAlign: "center", color: t.textMuted, fontSize: 12, fontWeight: "800", paddingVertical: 8 }}>{d}</Text>
          ))}

          {/* Vormonat */}
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <View key={`prev-${i}`} style={{ width: "14.285%", minHeight: 84, padding: 4, alignItems: "center" }}>
              <Text style={{ color: t.border, fontSize: 13, fontWeight: "800", marginBottom: 3 }}>{prevMonthDays - leadingBlanks + i + 1}</Text>
            </View>
          ))}

          {days.map((day) => {
            const code = assignedMap[day];
            const template = code ? templateMap[code.toUpperCase()] : undefined;
            const isUnknown = code && !template;
            const taskCount = tasks.filter((task) => task.day === day).length;
            const isToday = day === todayDay;
            const weekday = new Date(year, month, day).getDay();
            const isWeekend = weekday === 0 || weekday === 6;
            const isPast = todayDay !== null && day < todayDay;
            const holiday = holidayMap[day];
            const schoolHoliday = schoolHolidayMap[day];
            const evCount = eventCountMap[day] ?? 0;

            return (
              <TouchableOpacity
                key={day}
                style={[
                  { width: "14.285%", minHeight: 84, padding: 3, borderRadius: 14, alignItems: "center" },
                  isToday && { backgroundColor: "#0c2a3f", borderWidth: 1, borderColor: t.accent },
                  schoolHoliday && !isToday && { backgroundColor: "#0d1f0d" },
                  isWeekend && !isToday && !schoolHoliday && { backgroundColor: t.bgDeep },
                  holiday && !isToday && { backgroundColor: "#1a1a0a" },
                  isPast && { opacity: 0.45 },
                ]}
                onPress={() => { hapticLight(); onDayPress(day); }}
                activeOpacity={0.7}
              >
                <Text style={[
                  { color: t.textPrimary, fontSize: 12, fontWeight: "800", marginBottom: 2 },
                  isToday && { color: t.accent },
                  isPast && { color: t.textMuted },
                  holiday && { color: "#fbbf24" },
                  schoolHoliday && !holiday && { color: "#86efac" },
                ]}>
                  {day}
                </Text>

                {code && (
                  <View style={{ minWidth: 34, paddingVertical: 2, paddingHorizontal: 3, borderRadius: 8, alignItems: "center", marginBottom: 2, backgroundColor: template?.color ?? "#ef4444" }}>
                    <Text style={{ color: "#020617", fontSize: 9, fontWeight: "900" }}>{code}</Text>
                  </View>
                )}
                {isUnknown && <Text style={{ color: "#fca5a5", fontSize: 10, fontWeight: "900" }}>?</Text>}

                {features.wasteEnabled && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                    {(wasteMap[day] || []).map((item, i) => <WasteIcon key={`${item}-${i}`} type={item} size={10} />)}
                  </View>
                )}

                <View style={{ flexDirection: "row", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                  {holiday && <View style={{ backgroundColor: "#78350f", borderRadius: 5, paddingHorizontal: 2, paddingVertical: 1 }}><Text style={{ fontSize: 7 }}>🎉</Text></View>}
                  {schoolHoliday && <View style={{ backgroundColor: "#14532d", borderRadius: 5, paddingHorizontal: 2, paddingVertical: 1 }}><Text style={{ fontSize: 7 }}>🏖</Text></View>}
                  {evCount > 0 && <View style={{ backgroundColor: "#4c1d95", borderRadius: 5, paddingHorizontal: 3, paddingVertical: 1 }}><Text style={{ color: "#c4b5fd", fontSize: 7, fontWeight: "900" }}>+{evCount}</Text></View>}
                  {features.tasksEnabled && taskCount > 0 && <View style={{ backgroundColor: t.accentMuted, borderRadius: 5, paddingHorizontal: 3, paddingVertical: 1 }}><Text style={{ color: t.accent, fontSize: 7, fontWeight: "900" }}>{taskCount}</Text></View>}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Nachmonat */}
          {Array.from({ length: trailingCount }).map((_, i) => (
            <View key={`next-${i}`} style={{ width: "14.285%", minHeight: 84, padding: 4, alignItems: "center" }}>
              <Text style={{ color: t.border, fontSize: 13, fontWeight: "800", marginBottom: 3 }}>{i + 1}</Text>
            </View>
          ))}
        </View>

        {shiftCount === 0 && <EmptyState icon="calendar-plus" title="Keine Dienste" subtitle="Tippe auf einen Tag oder nutze den Import." />}

        <MonthPickerModal
          visible={showPicker} currentYear={year} currentMonth={month} t={t}
          onSelect={(y, m) => { setYear(y); setMonth(m); }}
          onClose={() => setShowPicker(false)}
        />
      </ScrollView>
    </View>
  );
}
