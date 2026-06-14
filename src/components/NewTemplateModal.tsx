import React, { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export function NewTemplateModal({
  visible,
  presetCode,
  onSave,
  onClose,
}: {
  visible: boolean;
  presetCode?: string;
  onSave: (data: { code: string; name: string; startTime: string; endTime: string }) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (visible) {
      setCode(presetCode || "");
      setName("");
      setStartTime("");
      setEndTime("");
    }
  }, [visible, presetCode]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Neuen Diensttyp anlegen</Text>

          <TextInput style={styles.input} placeholder="Code, z.B. X9" placeholderTextColor="#64748b" value={code} onChangeText={setCode} autoCapitalize="characters" />
          <TextInput style={styles.input} placeholder="Name, z.B. Zwischendienst" placeholderTextColor="#64748b" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Start, z.B. 09:00" placeholderTextColor="#64748b" value={startTime} onChangeText={setStartTime} />
          <TextInput style={styles.input} placeholder="Ende, z.B. 17:30" placeholderTextColor="#64748b" value={endTime} onChangeText={setEndTime} />

          <TouchableOpacity style={styles.primaryButton} onPress={() => onSave({ code, name, startTime, endTime })}>
            <Text style={styles.primaryButtonText}>Diensttyp speichern</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Abbrechen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
