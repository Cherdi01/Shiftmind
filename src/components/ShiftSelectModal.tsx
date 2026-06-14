import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ShiftTemplate } from "../types";
import { styles } from "./styles";

export function ShiftSelectModal({
  visible,
  day,
  templates,
  onSelect,
  onNewTemplate,
  onClose,
}: {
  visible: boolean;
  day: number | null;
  templates: ShiftTemplate[];
  onSelect: (code: string) => void;
  onNewTemplate: () => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Dienst für Tag {day}</Text>
          <ScrollView style={{ maxHeight: 360 }}>
            {templates.map((template) => (
              <TouchableOpacity key={template.code} style={styles.shiftOption} onPress={() => onSelect(template.code)}>
                <View style={[styles.colorDot, { backgroundColor: template.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.shiftOptionCode}>{template.code} · {template.name}</Text>
                  <Text style={styles.shiftOptionTime}>{template.startTime} – {template.endTime}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.deleteOption} onPress={() => onSelect("")}>
              <Text style={styles.deleteText}>Dienst entfernen</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity style={styles.secondaryButton} onPress={onNewTemplate}>
            <Text style={styles.secondaryButtonText}>+ Neuen Diensttyp erstellen</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
