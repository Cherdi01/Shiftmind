import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CompletedRoutineStep, DayTask, RoutineTemplate, ShiftTemplate, WasteType } from "../types";
import { calcStepTime } from "../utils/shift";
import { calcShiftDuration, formatDuration } from "../utils/time";
import { hapticLight, hapticSuccess } from "../utils/haptics";
import { WasteIcon } from "./WasteIcon";
import { BottomSheet } from "./BottomSheet";
import { styles } from "./styles";

const WASTE_LABELS: Record<WasteType, string> = {
  GREEN: "Grüntonne", BIO: "Biotonne", BLACK: "Restmüll", GLASS: "Glas",
};

export function DayDetailModal({
  visible, day, code, template, waste, tasks, routines, completedSteps,
  onToggleRoutineStep, onClose, onChangeShift, onDefineUnknown,
  onAddTask, onToggleTask, onDeleteTask,
}: {
  visible: boolean;
  day: number | null;
  code?: string;
  template?: ShiftTemplate;
  waste: WasteType[];
  tasks: DayTask[];
  routines: RoutineTemplate[];
  completedSteps: CompletedRoutineStep[];
  onToggleRoutineStep: (day: number, stepId: string) => void;
  onClose: () => void;
  onChangeShift: () => void;
  onDefineUnknown: (code: string) => void;
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}) {
  const [newTaskText, setNewTaskText] = useState("");

  const activeRoutine = template
    ? routines.find((r) => r.appliesTo === template.category)
    : undefined;

  const shiftDuration = template ? calcShiftDuration(template.startTime, template.endTime) : null;
  const allTasksDone = tasks.length > 0 && tasks.every((t) => t.done);
  const completedRoutineCount = activeRoutine
    ? activeRoutine.steps.filter((s) =>
        completedSteps.some((c) => c.day === day && c.stepId === s.id && c.completed)
      ).length
    : 0;

  function addTask() {
    if (!newTaskText.trim()) return;
    hapticLight();
    onAddTask(newTaskText.trim());
    setNewTaskText("");
  }

  return (
    <BottomSheet visible={visible} t={{ bgCard: "#0f172a", bgDeep: "#020617", border: "#1e293b" } as any} onClose={onClose} avoidKeyboard maxHeight="93%">
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.modalTitle}>Tag {day}. des Monats</Text>

        {/* Dienst */}
        <View style={styles.detailBlock}>
          <Text style={styles.cardTitle}>Dienst</Text>
          {template ? (
            <>
              <View style={styles.detailShiftRow}>
                <View style={[styles.colorDot, { backgroundColor: template.color, width: 16, height: 16, borderRadius: 8 }]} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.text}>{template.code} · {template.name}</Text>
                  <Text style={styles.muted}>{template.startTime} – {template.endTime}</Text>
                </View>
              </View>
              {shiftDuration && (
                <View style={styles.durationBadge}>
                  <Text style={styles.durationBadgeText}>⏱ {formatDuration(shiftDuration)}</Text>
                </View>
              )}
            </>
          ) : code ? (
            <View>
              <Text style={[styles.muted, { color: "#fca5a5" }]}>Unbekannter Code: {code}</Text>
              <TouchableOpacity style={[styles.warningButton, { marginTop: 8 }]} onPress={() => { hapticLight(); onDefineUnknown(code); }}>
                <Text style={styles.warningButtonText}>Diensttyp definieren</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.muted}>Kein Dienst eingetragen.</Text>
          )}
          <TouchableOpacity style={[styles.secondaryButton, { marginTop: 10 }]} onPress={() => { hapticLight(); onChangeShift(); }}>
            <Text style={styles.secondaryButtonText}>Dienst ändern</Text>
          </TouchableOpacity>
        </View>

        {/* Müll */}
        {waste.length > 0 && (
          <View style={styles.detailBlock}>
            <Text style={styles.cardTitle}>🗑 Müllabfuhr</Text>
            <View style={styles.detailWasteRow}>
              {waste.map((w, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginRight: 12 }}>
                  <WasteIcon type={w} size={18} />
                  <Text style={styles.muted}>{WASTE_LABELS[w]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Routine */}
        <View style={styles.detailBlock}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={[styles.cardTitle, { marginBottom: 0 }]}>Routine</Text>
            {activeRoutine && (
              <Text style={styles.muted}>{completedRoutineCount}/{activeRoutine.steps.length} erledigt</Text>
            )}
          </View>
          {activeRoutine ? activeRoutine.steps.map((step) => {
            const completed = completedSteps.some((c) => c.day === day && c.stepId === step.id && c.completed);
            const stepTime = template ? calcStepTime(template.startTime, step.offsetMinutes) : "";
            return (
              <TouchableOpacity key={step.id} style={styles.dayTaskRow} onPress={() => { hapticLight(); if (day) onToggleRoutineStep(day, step.id); }} activeOpacity={0.7}>
                <MaterialCommunityIcons name={completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} size={22} color={completed ? "#22c55e" : "#38bdf8"} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.dayTaskText, completed && styles.dayTaskTextDone]}>{step.title}</Text>
                  {stepTime ? <Text style={styles.stepTime}>{stepTime} Uhr</Text> : null}
                </View>
              </TouchableOpacity>
            );
          }) : (
            <Text style={styles.muted}>{template ? "Keine Routine für diesen Diensttyp." : "Kein Dienst – keine Routine."}</Text>
          )}
        </View>

        {/* Aufgaben */}
        <View style={styles.detailBlock}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={[styles.cardTitle, { marginBottom: 0 }]}>Aufgaben</Text>
            {allTasksDone && tasks.length > 0 && <MaterialCommunityIcons name="check-circle" size={18} color="#22c55e" />}
          </View>
          {tasks.length === 0 && <Text style={[styles.muted, { marginBottom: 8 }]}>Noch keine Aufgaben für diesen Tag.</Text>}
          {tasks.map((task) => (
            <View key={task.id} style={styles.dayTaskRow}>
              <TouchableOpacity onPress={() => { hapticLight(); onToggleTask(task.id); if (!task.done) hapticSuccess(); }}>
                <MaterialCommunityIcons name={task.done ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} size={22} color={task.done ? "#22c55e" : "#38bdf8"} />
              </TouchableOpacity>
              <Text style={[styles.dayTaskText, task.done && styles.dayTaskTextDone]}>{task.text}</Text>
              <TouchableOpacity onPress={() => { hapticLight(); onDeleteTask(task.id); }}>
                <MaterialCommunityIcons name="trash-can-outline" size={20} color="#334155" />
              </TouchableOpacity>
            </View>
          ))}
          <TextInput style={styles.input} placeholder="Neue Aufgabe…" placeholderTextColor="#64748b" value={newTaskText} onChangeText={setNewTaskText} onSubmitEditing={addTask} returnKeyType="done" />
          <TouchableOpacity style={styles.primaryButton} onPress={addTask}>
            <Text style={styles.primaryButtonText}>Aufgabe hinzufügen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Schließen</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}
