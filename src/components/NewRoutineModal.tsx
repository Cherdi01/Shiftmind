import React, { useState } from "react";
import { ScrollView, Text, TextInput,
  TouchableOpacity, View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheet } from "./BottomSheet";
import { ThemeColors } from "../theme";
import { RoutineStep, ShiftCategory } from "../types";
import { hapticLight } from "../utils/haptics";

const CATEGORIES: { value: ShiftCategory; label: string }[] = [
  { value: "early",    label: "Frühdienst" },
  { value: "late",     label: "Spätdienst" },
  { value: "night",    label: "Nachtdienst" },
  { value: "day",      label: "Tagdienst" },
  { value: "training", label: "Fortbildung" },
  { value: "custom",   label: "Sonstiges" },
];

type StepDraft = Omit<RoutineStep, "id">;

export function NewRoutineModal({
  visible,
  t,
  onSave,
  onClose,
}: {
  visible: boolean;
  t: ThemeColors;
  onSave: (data: { name: string; appliesTo: ShiftCategory; steps: StepDraft[] }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [appliesTo, setAppliesTo] = useState<ShiftCategory>("early");
  const [steps, setSteps] = useState<StepDraft[]>([
    { title: "", offsetMinutes: -60 },
  ]);

  function addStep() {
    hapticLight();
    setSteps((prev) => [...prev, { title: "", offsetMinutes: -30 }]);
  }

  function removeStep(index: number) {
    hapticLight();
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function updateStep(index: number, field: keyof StepDraft, value: string) {
    setSteps((prev) =>
      prev.map((s, i) =>
        i === index
          ? { ...s, [field]: field === "offsetMinutes" ? -Math.abs(parseInt(value) || 0) : value }
          : s
      )
    );
  }

  function handleSave() {
    onSave({ name, appliesTo, steps });
  }

  const input = {
    backgroundColor: t.bgInput,
    color: t.textPrimary,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    fontSize: 15,
  } as const;

  return (
    <BottomSheet visible={visible} t={t} onClose={onClose} avoidKeyboard maxHeight="93%">
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={{ color: t.textPrimary, fontSize: 22, fontWeight: "900", marginBottom: 14 }}>
              Neue Routine
            </Text>

            {/* Name */}
            <TextInput
              style={input}
              placeholder="Routine-Name, z.B. Meine Frühschicht"
              placeholderTextColor={t.textMuted}
              value={name}
              onChangeText={setName}
            />

            {/* Kategorie */}
            <Text style={{ color: t.accent, fontWeight: "800", fontSize: 14, marginBottom: 8 }}>
              Gilt für
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() => { hapticLight(); setAppliesTo(cat.value); }}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14,
                    backgroundColor: appliesTo === cat.value ? t.accent : t.bgDeep,
                    borderWidth: 1,
                    borderColor: appliesTo === cat.value ? t.accent : t.border,
                  }}
                >
                  <Text style={{
                    color: appliesTo === cat.value ? t.bgDeep : t.textMuted,
                    fontWeight: "800", fontSize: 13,
                  }}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Schritte */}
            <Text style={{ color: t.accent, fontWeight: "800", fontSize: 14, marginBottom: 8 }}>
              Schritte (Minuten vor Dienstbeginn)
            </Text>

            {steps.map((step, i) => (
              <View key={i} style={{
                backgroundColor: t.bgDeep, borderRadius: 14, padding: 12,
                marginBottom: 8, borderWidth: 1, borderColor: t.border,
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <TextInput
                    style={[input, { flex: 1, marginBottom: 0 }]}
                    placeholder={`Schritt ${i + 1}, z.B. Aufstehen`}
                    placeholderTextColor={t.textMuted}
                    value={step.title}
                    onChangeText={(v) => updateStep(i, "title", v)}
                  />
                  <TouchableOpacity onPress={() => removeStep(i)}>
                    <MaterialCommunityIcons name="close-circle-outline" size={22} color={t.danger} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <Text style={{ color: t.textMuted, fontSize: 13 }}>−</Text>
                  <TextInput
                    style={[input, { width: 80, marginBottom: 0, textAlign: "center" }]}
                    placeholder="60"
                    placeholderTextColor={t.textMuted}
                    value={String(Math.abs(step.offsetMinutes))}
                    onChangeText={(v) => updateStep(i, "offsetMinutes", v)}
                    keyboardType="number-pad"
                  />
                  <Text style={{ color: t.textMuted, fontSize: 13 }}>Minuten vor Start</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={addStep}
              style={{
                borderWidth: 1, borderColor: t.border, borderRadius: 14,
                padding: 12, alignItems: "center", marginBottom: 12,
                borderStyle: "dashed",
              }}
            >
              <Text style={{ color: t.accent, fontWeight: "800" }}>+ Schritt hinzufügen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={{ backgroundColor: t.accent, padding: 15, borderRadius: 18, alignItems: "center", marginTop: 4 }}
            >
              <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 15 }}>Routine speichern</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={{ padding: 15, borderRadius: 18, alignItems: "center", marginTop: 4 }}
            >
              <Text style={{ color: t.textMuted, fontWeight: "800" }}>Abbrechen</Text>
            </TouchableOpacity>
          </ScrollView>
    </BottomSheet>
  );
}
