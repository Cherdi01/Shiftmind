import React from "react";
import { ScrollView, Text } from "react-native";
import { Card } from "../components/Card";
import { Task } from "../components/Task";
import { styles } from "../components/styles";
import { AssignedShift, DayTask, ShiftTemplate } from "../types";

export function HomeScreen({ assigned, templates, tasks }: { assigned: AssignedShift[]; templates: ShiftTemplate[]; tasks: DayTask[] }) {
  const next = [...assigned].sort((a, b) => a.day - b.day)[0];
  const template = templates.find((item) => item.code === next?.code);
  const openTasks = tasks.filter((task) => !task.done).slice(0, 4);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card>
        <Text style={styles.cardTitle}>Nächster Dienst</Text>
        <Text style={styles.bigText}>{next?.code || "Kein Dienst"}</Text>
        <Text style={styles.muted}>
          {template ? `${template.name} · Tag ${next.day} · ${template.startTime} – ${template.endTime}` : "Noch keine Details vorhanden."}
        </Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Nächster Schritt</Text>
        <Text style={styles.bigText}>Tagesplan prüfen</Text>
        <Text style={styles.muted}>ShiftMind baut den Alltag um deine echten Dienstzeiten herum.</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Offene Aufgaben</Text>
        {openTasks.length === 0 ? <Text style={styles.muted}>Keine offenen Aufgaben.</Text> : openTasks.map((task) => <Task key={task.id} text={`Tag ${task.day}: ${task.text}`} />)}
      </Card>
    </ScrollView>
  );
}
