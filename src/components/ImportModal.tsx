import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { BottomSheet } from "./BottomSheet";
import { styles } from "./styles";
import { hapticLight } from "../utils/haptics";

export function ImportModal({ visible, unknownCodes, onImport, onDefineUnknown, onClose }: {
  visible: boolean;
  unknownCodes: string[];
  onImport: (text: string) => void;
  onDefineUnknown: (code: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("1 F12\n2 F13\n3 X9\n4 S4\n5 N3");

  return (
    <BottomSheet visible={visible} t={{ bgCard: "#0f172a", border: "#1e293b" }} onClose={onClose} avoidKeyboard maxHeight="85%">
      <Text style={styles.modalTitle}>Dienstplan importieren</Text>
      <Text style={styles.muted}>Format: Tag Code{"\n"}Beispiel: 1 F12</Text>
      <TextInput
        style={[styles.input, styles.importBox]}
        multiline
        value={text}
        onChangeText={setText}
        placeholderTextColor="#64748b"
        autoCapitalize="characters"
      />
      <TouchableOpacity style={styles.primaryButton} onPress={() => { hapticLight(); onImport(text); }}>
        <Text style={styles.primaryButtonText}>Importieren</Text>
      </TouchableOpacity>

      {unknownCodes.length > 0 && (
        <View style={styles.unknownBox}>
          <Text style={[styles.muted, { color: "#fca5a5", fontWeight: "800" }]}>
            Unbekannte Codes – bitte definieren:
          </Text>
          {unknownCodes.map((code) => (
            <TouchableOpacity key={code} style={styles.unknownItem} onPress={() => { hapticLight(); onDefineUnknown(code); }}>
              <Text style={styles.unknownText}>{code} – antippen zum Definieren</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Schließen</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}
