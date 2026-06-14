import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { WasteEntry, WasteType } from "../types";
import { WasteIcon } from "./WasteIcon";
import { styles } from "./styles";

const WASTE_TYPES: WasteType[] = ["GREEN", "BIO", "BLACK", "GLASS"];
const WASTE_LABELS: Record<WasteType, string> = {
  GREEN: "Grüntonne",
  BIO:   "Biotonne",
  BLACK: "Restmüll",
  GLASS: "Glas",
};

export function WasteModal({
  visible,
  wasteEntries,
  onAdd,
  onDelete,
  onClose,
}: {
  visible: boolean;
  wasteEntries: WasteEntry[];
  onAdd: (day: number, type: WasteType) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<WasteType>("GREEN");
  const [showDayPicker, setShowDayPicker] = useState(false);

  const sorted = [...wasteEntries].sort((a, b) => a.day - b.day || a.type.localeCompare(b.type));

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Müllplan verwalten</Text>

          {/* Eintrag hinzufügen */}
          <View style={styles.detailBlock}>
            <Text style={styles.cardTitle}>Neuer Eintrag</Text>

            {/* Tag Auswahl */}
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDayPicker(!showDayPicker)}
            >
              <Text style={{ color: "#f8fafc", fontSize: 15 }}>Tag {selectedDay}</Text>
            </TouchableOpacity>

            {showDayPicker && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => { setSelectedDay(d); setShowDayPicker(false); }}
                    style={[styles.dayPickerBtn, selectedDay === d && styles.dayPickerBtnActive]}
                  >
                    <Text style={[styles.dayPickerText, selectedDay === d && styles.dayPickerTextActive]}>
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Typ Auswahl */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
              {WASTE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedType(type)}
                  style={[styles.wasteTypeBtn, selectedType === type && styles.wasteTypeBtnActive]}
                >
                  <WasteIcon type={type} size={16} />
                  <Text style={[styles.wasteTypeText, selectedType === type && { color: "#f8fafc" }]}>
                    {WASTE_LABELS[type]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => onAdd(selectedDay, selectedType)}
            >
              <Text style={styles.primaryButtonText}>Eintrag hinzufügen</Text>
            </TouchableOpacity>
          </View>

          {/* Bestehende Einträge */}
          <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false}>
            {sorted.length === 0 && (
              <Text style={styles.muted}>Noch keine Einträge.</Text>
            )}
            {sorted.map((entry) => (
              <View key={entry.id} style={styles.dayTaskRow}>
                <WasteIcon type={entry.type} size={18} />
                <Text style={[styles.dayTaskText, { flex: 1 }]}>
                  Tag {entry.day} · {WASTE_LABELS[entry.type]}
                </Text>
                <TouchableOpacity onPress={() => onDelete(entry.id)}>
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color="#f87171" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
