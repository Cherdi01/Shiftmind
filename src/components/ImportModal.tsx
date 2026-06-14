import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export function ImportModal({
  visible,
  unknownCodes,
  onImport,
  onDefineUnknown,
  onClose,
}: {
  visible: boolean;
  unknownCodes: string[];
  onImport: (text: string) => void;
  onDefineUnknown: (code: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("1 F12\n2 F13\n3 X9\n4 S4\n5 N3");

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Dienstplan-Import Simulation</Text>
          <Text style={styles.muted}>Format aktuell: Tag + Dienstcode. Später ersetzt OCR diesen Text automatisch.</Text>

          <TextInput style={[styles.input, styles.importBox]} multiline value={text} onChangeText={setText} />

          <TouchableOpacity style={styles.primaryButton} onPress={() => onImport(text)}>
            <Text style={styles.primaryButtonText}>Import auswerten</Text>
          </TouchableOpacity>

          {unknownCodes.length > 0 && (
            <View style={styles.unknownBox}>
              <Text style={styles.cardTitle}>Unbekannte Dienste erkannt</Text>
              {unknownCodes.map((code) => (
                <TouchableOpacity key={code} style={styles.unknownItem} onPress={() => onDefineUnknown(code)}>
                  <Text style={styles.unknownText}>{code} definieren</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
