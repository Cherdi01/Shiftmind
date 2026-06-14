import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { ThemeColors } from "../theme";
import { DayTask } from "../types";
import { hapticLight, hapticSuccess } from "../utils/haptics";

export function TasksScreen({
  tasks, t, onToggle, onDelete,
}: {
  tasks: DayTask[];
  t: ThemeColors;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const today = new Date().getDate();
  const sorted = [...tasks].sort((a, b) => a.day - b.day);

  const grouped: Record<number, DayTask[]> = {};
  sorted.forEach((task) => {
    if (!grouped[task.day]) grouped[task.day] = [];
    grouped[task.day].push(task);
  });
  const days = Object.keys(grouped).map(Number).sort((a, b) => a - b);

  const openCount = tasks.filter((t) => !t.done).length;
  const doneCount = tasks.filter((t) => t.done).length;

  function getDayLabel(day: number): string {
    const diff = day - today;
    if (diff === 0) return `Tag ${day} · Heute`;
    if (diff === 1) return `Tag ${day} · Morgen`;
    if (diff < 0)  return `Tag ${day} · Vergangen`;
    return `Tag ${day}`;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {tasks.length > 0 && (
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
          <View style={{ backgroundColor: t.bgCard, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: t.border }}>
            <Text style={{ color: t.textMuted, fontSize: 13, fontWeight: "700" }}>⬜ {openCount} offen</Text>
          </View>
          <View style={{ backgroundColor: t.bgCard, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: t.border }}>
            <Text style={{ color: t.success, fontSize: 13, fontWeight: "700" }}>✓ {doneCount} erledigt</Text>
          </View>
        </View>
      )}

      {days.length === 0 ? (
        <Card>
          <EmptyState icon="clipboard-text-outline" title="Keine Aufgaben" subtitle="Öffne einen Tag im Kalender und füge dort Aufgaben hinzu." />
        </Card>
      ) : (
        days.map((day) => {
          const dayTasks = grouped[day];
          const allDone = dayTasks.every((task) => task.done);
          const isPast = day < today;

          return (
            <View key={day} style={{ backgroundColor: t.bgCard, borderRadius: 22, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: t.border }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 8 }}>
                <Text style={{ color: t.accent, fontWeight: "800", fontSize: 16 }}>{getDayLabel(day)}</Text>
                {allDone && <MaterialCommunityIcons name="check-circle" size={18} color={t.success} />}
                {isPast && !allDone && (
                  <View style={{ backgroundColor: "#450a0a", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
                    <Text style={{ color: "#fca5a5", fontSize: 11, fontWeight: "800" }}>überfällig</Text>
                  </View>
                )}
              </View>

              {dayTasks.map((task) => (
                // Ganzer Bereich antippbar – nicht nur Kreis
                <TouchableOpacity
                  key={task.id}
                  style={{ flexDirection: "row", alignItems: "center", backgroundColor: t.bgDeep, borderRadius: 14, padding: 10, marginBottom: 8, gap: 8 }}
                  onPress={() => {
                    hapticLight();
                    if (!task.done) hapticSuccess();
                    onToggle(task.id);
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={task.done ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                    size={22}
                    color={task.done ? t.success : t.accent}
                  />
                  <Text style={{ color: task.done ? t.textMuted : t.textSecondary, fontSize: 14, flex: 1, textDecorationLine: task.done ? "line-through" : "none" }}>
                    {task.text}
                  </Text>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      hapticLight();
                      onDelete(task.id);
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color={t.borderStrong} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
