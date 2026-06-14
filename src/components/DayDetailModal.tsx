import React, { useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CompletedRoutineStep, DayTask, RoutineTemplate, ShiftTemplate, WasteType } from "../types";
import { WasteIcon } from "./WasteIcon";
import { styles } from "./styles";

export function DayDetailModal({
  visible,
  day,
  code,
  template,
  waste,
  tasks,
  routines,
  completedSteps,
  onToggleRoutineStep,
  onClose,
  onChangeShift,
  onDefineUnknown,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: {
  visible: boolean;
  day: number | null;
  code?: string;
  template?: ShiftTemplate;
  waste: WasteType[];
  tasks: DayTask[];
  routines: RoutineTemplate[];
  completedSteps: CompletedRoutineStep[];

  onToggleRoutineStep: (
  day: number,
  stepId: string
) => void;
  onClose: () => void;
  onChangeShift: () => void;
  onDefineUnknown: (code: string) => void;
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}) {
  const [newTaskText, setNewTaskText] = useState("");

  const activeRoutine = template
  ? routines.find(
      (routine) =>
        routine.appliesTo === template.category
    )
  : undefined;

  function addTask() {
    if (!newTaskText.trim()) return;
    onAddTask(newTaskText.trim());
    setNewTaskText("");
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Tag {day}. Juni</Text>


            <View style={styles.detailBlock}>
  <Text style={styles.cardTitle}>Routine</Text>

  {activeRoutine ? (
    <>
      <Text style={styles.text}>{activeRoutine.name}</Text>

      {activeRoutine.steps.map((step) => {
        const completed = completedSteps.some(
          (item) =>
            item.day === day &&
            item.stepId === step.id &&
            item.completed
        );

        return (
          <TouchableOpacity
            key={step.id}
            style={styles.dayTaskRow}
            onPress={() => {
              if (day) {
                onToggleRoutineStep(day, step.id);
              }
            }}
          >
            <MaterialCommunityIcons
              name={
                completed
                  ? "checkbox-marked-circle"
                  : "checkbox-blank-circle-outline"
              }
              size={22}
              color={completed ? "#22c55e" : "#38bdf8"}
            />

            <Text
              style={[
                styles.dayTaskText,
                completed && styles.dayTaskTextDone,
              ]}
            >
              {step.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </>
  ) : (
    <Text style={styles.muted}>
      Keine passende Routine für diesen Diensttyp.
    </Text>
  )}
</View>

            <View style={styles.detailBlock}>
              <Text style={styles.cardTitle}>Aufgaben</Text>
              {tasks.length === 0 && <Text style={styles.muted}>Noch keine Aufgaben.</Text>}

              {tasks.map((task) => (
                <View key={task.id} style={styles.dayTaskRow}>
                  <TouchableOpacity onPress={() => onToggleTask(task.id)}>
                    <MaterialCommunityIcons
                      name={task.done ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                      size={22}
                      color={task.done ? "#22c55e" : "#38bdf8"}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.dayTaskText, task.done && styles.dayTaskTextDone]}>{task.text}</Text>
                  <TouchableOpacity onPress={() => onDeleteTask(task.id)}>
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color="#f87171" />
                  </TouchableOpacity>
                </View>
              ))}

              <TextInput
                style={styles.input}
                placeholder="Neue Aufgabe, z.B. Rasieren"
                placeholderTextColor="#64748b"
                value={newTaskText}
                onChangeText={setNewTaskText}
              />

              <TouchableOpacity style={styles.primaryButton} onPress={addTask}>
                <Text style={styles.primaryButtonText}>Aufgabe hinzufügen</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
