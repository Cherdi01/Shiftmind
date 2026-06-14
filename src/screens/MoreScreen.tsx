import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../components/Card";
import { styles } from "../components/styles";
import { RoutineTemplate, ShiftTemplate } from "../types";

export function MoreScreen({
  templates,
  routines,
  onNewTemplatePress,
  onReset,
}: {
  templates: ShiftTemplate[];
  routines: RoutineTemplate[];
  onNewTemplatePress: () => void;
  onReset: () => void;
}) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card>
        <Text style={styles.cardTitle}>Diensttypen</Text>
        {templates.map((template) => (
          <View key={template.code} style={styles.templateRow}>
            <View style={[styles.colorDot, { backgroundColor: template.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.text}>{template.code} · {template.name}</Text>
              <Text style={styles.muted}>{template.startTime} – {template.endTime}</Text>
            </View>
          </View>
        ))}
      </Card>

<Card>
  <Text style={styles.cardTitle}>Routinen</Text>
  {routines.map((routine) => (
    <View key={routine.id} style={styles.templateRow}>
      <View style={[styles.colorDot, { backgroundColor: "#38bdf8" }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.text}>{routine.name}</Text>
        <Text style={styles.muted}>
          {routine.steps.length} Schritte · {routine.appliesTo}
        </Text>
      </View>
    </View>
  ))}
</Card>
      <TouchableOpacity style={styles.primaryButton} onPress={onNewTemplatePress}>
        <Text style={styles.primaryButtonText}>+ Diensttyp hinzufügen</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dangerButton} onPress={onReset}>
        <Text style={styles.dangerButtonText}>Demo-Daten zurücksetzen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
