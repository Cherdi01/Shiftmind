import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { BottomSheet } from "./BottomSheet";
import { ColorPickerModal } from "./ColorPickerModal";
import { ThemeColors } from "../theme";
import { ShiftTemplate } from "../types";
import { chooseColorForCode } from "../utils/shift";
import { hapticLight } from "../utils/haptics";

export function NewTemplateModal({
  visible, presetCode, editTemplate, t, onSave, onClose,
}: {
  visible: boolean;
  presetCode?: string;
  editTemplate?: ShiftTemplate;
  t: ThemeColors;
  onSave: (data: { code: string; name: string; startTime: string; endTime: string; color: string }) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState("#38bdf8");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (editTemplate) {
      setCode(editTemplate.code);
      setName(editTemplate.name);
      setStartTime(editTemplate.startTime);
      setEndTime(editTemplate.endTime);
      setColor(editTemplate.color);
    } else {
      setCode(presetCode ?? "");
      setName("");
      setStartTime("");
      setEndTime("");
      setColor(presetCode ? chooseColorForCode(presetCode) : "#38bdf8");
    }
  }, [visible, presetCode, editTemplate]);

  function handleCodeChange(v: string) {
    setCode(v);
    if (!editTemplate) setColor(chooseColorForCode(v));
  }

  const isEdit = !!editTemplate;
  const inp = {
    backgroundColor: t.bgInput, color: t.textPrimary,
    borderWidth: 1, borderColor: t.border, borderRadius: 16,
    padding: 14, marginBottom: 10, fontSize: 15,
  } as const;

  return (
    <>
      <BottomSheet visible={visible} t={t} onClose={onClose} avoidKeyboard maxHeight="85%">
        <Text style={{ color: t.textPrimary, fontSize: 22, fontWeight: "900", marginBottom: 14 }}>
          {isEdit ? "Diensttyp bearbeiten" : "Neuen Diensttyp anlegen"}
        </Text>

        <TextInput
          style={[inp, isEdit && { color: t.textMuted }]}
          placeholder="Code, z.B. X9"
          placeholderTextColor={t.textMuted}
          value={code}
          onChangeText={handleCodeChange}
          autoCapitalize="characters"
          editable={!isEdit}
        />
        <TextInput style={inp} placeholder="Name, z.B. Zwischendienst" placeholderTextColor={t.textMuted} value={name} onChangeText={setName} />
        <TextInput style={inp} placeholder="Start, z.B. 09:00" placeholderTextColor={t.textMuted} value={startTime} onChangeText={setStartTime} keyboardType="numbers-and-punctuation" />
        <TextInput style={inp} placeholder="Ende, z.B. 17:30" placeholderTextColor={t.textMuted} value={endTime} onChangeText={setEndTime} keyboardType="numbers-and-punctuation" />

        {/* Farbauswahl */}
        <TouchableOpacity
          onPress={() => { hapticLight(); setShowColorPicker(true); }}
          style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: t.bgDeep, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: t.border }}
        >
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: color }} />
          <Text style={{ color: t.textSecondary, fontSize: 15, flex: 1 }}>Farbe wählen</Text>
          <View style={{ width: 32, height: 20, borderRadius: 10, backgroundColor: color }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: t.accent, padding: 15, borderRadius: 18, alignItems: "center", marginTop: 4 }}
          onPress={() => { hapticLight(); onSave({ code, name, startTime, endTime, color }); }}
        >
          <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 15 }}>
            {isEdit ? "Änderungen speichern" : "Diensttyp speichern"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 15, borderRadius: 18, alignItems: "center", marginTop: 4 }} onPress={onClose}>
          <Text style={{ color: t.textMuted, fontWeight: "800" }}>Abbrechen</Text>
        </TouchableOpacity>
      </BottomSheet>

      <ColorPickerModal
        visible={showColorPicker}
        currentColor={color}
        t={t}
        onSelect={(c) => setColor(c)}
        onClose={() => setShowColorPicker(false)}
      />
    </>
  );
}
