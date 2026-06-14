import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ShiftTemplate } from "../types";
import { BottomSheet } from "./BottomSheet";
import { styles } from "./styles";
import { hapticLight } from "../utils/haptics";

export function ShiftSelectModal({ visible, day, templates, onSelect, onNewTemplate, onClose }: {
  visible: boolean;
  day: number | null;
  templates: ShiftTemplate[];
  onSelect: (code: string) => void;
  onNewTemplate: () => void;
  onClose: () => void;
}) {
  return (
    <BottomSheet visible={visible} t={{ bgCard: "#0f172a", border: "#1e293b" }} onClose={onClose} maxHeight="85%">
      <Text style={styles.modalTitle}>Dienst für Tag {day}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {templates.map((template) => (
          <TouchableOpacity key={template.code} style={styles.shiftOption} onPress={() => { hapticLight(); onSelect(template.code); }}>
            <View style={[styles.colorDot, { backgroundColor: template.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.shiftOptionCode}>{template.code} · {template.name}</Text>
              <Text style={styles.shiftOptionTime}>{template.startTime} – {template.endTime}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => { hapticLight(); onNewTemplate(); }}>
          <Text style={styles.secondaryButtonText}>+ Neuen Diensttyp anlegen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteOption} onPress={() => { hapticLight(); onSelect(""); }}>
          <Text style={styles.deleteText}>Dienst entfernen</Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Abbrechen</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}
