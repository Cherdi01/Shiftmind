import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../components/Card";
import { WasteIcon } from "../components/WasteIcon";
import { styles } from "../components/styles";
import { days, waste } from "../data/defaults";
import { DayTask, ShiftTemplate } from "../types";

export function MonthScreen({
  assignedMap,
  templateMap,
  tasks,
  onDayPress,
  onImportPress,
  onNewTemplatePress,
}: {
  assignedMap: Record<number, string>;
  templateMap: Record<string, ShiftTemplate>;
  tasks: DayTask[];
  onDayPress: (day: number) => void;
  onImportPress: () => void;
  onNewTemplatePress: () => void;
}) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.monthHeader}>
        <TouchableOpacity style={styles.smallButton}><Text style={styles.buttonText}>‹</Text></TouchableOpacity>
        <Text style={styles.monthTitle}>Juni 2026</Text>
        <TouchableOpacity style={styles.smallButton}><Text style={styles.buttonText}>›</Text></TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onImportPress}>
          <Text style={styles.actionText}>📄 Dienstplan importieren</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>🗑 Müllplan verwalten</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.wideButton} onPress={onNewTemplatePress}>
        <Text style={styles.actionText}>+ Diensttyp hinzufügen</Text>
      </TouchableOpacity>

      <View style={styles.calendar}>
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
          <Text key={d} style={styles.weekday}>{d}</Text>
        ))}

        {days.map((day) => {
          const code = assignedMap[day];
          const template = code ? templateMap[code.toUpperCase()] : undefined;
          const isUnknown = code && !template;
          const taskCount = tasks.filter((task) => task.day === day).length;

          return (
            <TouchableOpacity key={day} style={styles.day} onPress={() => onDayPress(day)}>
              <Text style={styles.dayNumber}>{day}</Text>

              {code && (
                <View style={[styles.shiftBadge, { backgroundColor: template?.color || "#ef4444" }]}>
                  <Text style={styles.shiftText}>{code}</Text>
                </View>
              )}

              {isUnknown && <Text style={styles.unknownMini}>?</Text>}

              <View style={styles.wasteRow}>
                {(waste[day] || []).map((item, index) => (
                  <WasteIcon key={`${item}-${index}`} type={item} size={14} />
                ))}
              </View>

              {taskCount > 0 && (
                <View style={styles.taskCountBadge}>
                  <Text style={styles.taskCountText}>{taskCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Card>
        <Text style={styles.cardTitle}>KI-Analyse Juni</Text>
        <Text style={styles.text}>Diensttypen können frei definiert werden.</Text>
        <Text style={styles.text}>Aufgaben sind jetzt tagesbezogen speicherbar.</Text>
        <Text style={styles.muted}>Beim Import werden unbekannte Codes markiert und einmalig abgefragt.</Text>
      </Card>
    </ScrollView>
  );
}
