import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card } from "../components/Card";
import { styles } from "../components/styles";
import { DayTask } from "../types";

export function TasksScreen({ tasks, onToggle, onDelete }: { tasks: DayTask[]; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  const sorted = [...tasks].sort((a, b) => a.day - b.day);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card>
        <Text style={styles.cardTitle}>Alle Tagesaufgaben</Text>
        {sorted.length === 0 && <Text style={styles.muted}>Noch keine Aufgaben.</Text>}

        {sorted.map((task) => (
          <View key={task.id} style={styles.dayTaskRow}>
            <TouchableOpacity onPress={() => onToggle(task.id)}>
              <MaterialCommunityIcons name={task.done ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} size={22} color={task.done ? "#22c55e" : "#38bdf8"} />
            </TouchableOpacity>
            <Text style={[styles.dayTaskText, task.done && styles.dayTaskTextDone]}>Tag {task.day}: {task.text}</Text>
            <TouchableOpacity onPress={() => onDelete(task.id)}>
              <MaterialCommunityIcons name="trash-can-outline" size={20} color="#f87171" />
            </TouchableOpacity>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}
