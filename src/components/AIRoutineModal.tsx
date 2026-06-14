import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheet } from "./BottomSheet";
import { ThemeColors } from "../theme";
import { RoutineTemplate, ShiftCategory, ShiftTemplate } from "../types";
import { generateRoutine } from "../services/aiService";
import { hapticLight, hapticSuccess } from "../utils/haptics";

const CATEGORY_LABELS: Record<ShiftCategory, string> = {
  early: "Frühdienst", late: "Spätdienst", night: "Nachtdienst",
  day: "Tagdienst", training: "Fortbildung", free: "Frei", custom: "Sonstiges",
};

type Props = {
  visible: boolean;
  t: ThemeColors;
  templates: ShiftTemplate[];
  userName?: string;
  onSave: (routine: Omit<RoutineTemplate, "id">) => void;
  onClose: () => void;
};

export function AIRoutineModal({ visible, t, templates, userName, onSave, onClose }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<ShiftCategory>("early");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{ name: string; steps: { title: string; offsetMinutes: number }[] } | null>(null);

  const categories: ShiftCategory[] = ["early", "late", "night", "day", "training"];

  // Startzeit aus Templates ableiten
  const startTime = templates.find((t) => t.category === selectedCategory)?.startTime ?? "07:00";

  async function generate() {
    hapticLight();
    setLoading(true);
    setPreview(null);
    try {
      const result = await generateRoutine(selectedCategory, startTime, userName);
      setPreview(result);
      hapticSuccess();
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function save() {
    if (!preview) return;
    hapticSuccess();
    onSave({ name: preview.name, appliesTo: selectedCategory, steps: preview.steps.map((s, i) => ({ ...s, id: `ai-${Date.now()}-${i}` })) });
    setPreview(null);
    onClose();
  }

  return (
    <BottomSheet visible={visible} t={t} onClose={() => { setPreview(null); onClose(); }} maxHeight="90%">
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <MaterialCommunityIcons name="robot-outline" size={24} color={t.accent} />
        <Text style={{ color: t.textPrimary, fontSize: 22, fontWeight: "900" }}>KI-Routine erstellen</Text>
      </View>

      <Text style={{ color: t.textMuted, fontSize: 14, marginBottom: 14 }}>
        Die KI erstellt eine auf dich zugeschnittene ADHS-freundliche Routine.
      </Text>

      {/* Kategorie wählen */}
      <Text style={{ color: t.accent, fontWeight: "800", fontSize: 14, marginBottom: 8 }}>Für welchen Dienst?</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => { hapticLight(); setSelectedCategory(cat); setPreview(null); }}
            style={{
              paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14,
              backgroundColor: selectedCategory === cat ? t.accentMuted : t.bgDeep,
              borderWidth: 1, borderColor: selectedCategory === cat ? t.accent : t.border,
            }}
          >
            <Text style={{ color: selectedCategory === cat ? t.accent : t.textMuted, fontWeight: "800", fontSize: 13 }}>
              {CATEGORY_LABELS[cat]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ backgroundColor: t.bgDeep, borderRadius: 14, padding: 12, marginBottom: 16, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <MaterialCommunityIcons name="clock-outline" size={18} color={t.textMuted} />
        <Text style={{ color: t.textMuted, fontSize: 13 }}>Dienstbeginn: {startTime} Uhr</Text>
      </View>

      <TouchableOpacity
        style={{ backgroundColor: t.accent, padding: 15, borderRadius: 18, alignItems: "center", marginBottom: 16 }}
        onPress={generate}
        disabled={loading}
      >
        {loading
          ? <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              <ActivityIndicator color={t.bgDeep} />
              <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 15 }}>KI denkt nach…</Text>
            </View>
          : <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 15 }}>🤖 Routine generieren</Text>
        }
      </TouchableOpacity>

      {/* Vorschau */}
      {preview && (
        <View style={{ backgroundColor: t.bgDeep, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: t.border }}>
          <Text style={{ color: t.accent, fontWeight: "900", fontSize: 16, marginBottom: 12 }}>{preview.name}</Text>
          <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
            {preview.steps.map((step, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: i < preview.steps.length - 1 ? 1 : 0, borderBottomColor: t.border, gap: 10 }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: t.accentMuted, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: t.accent, fontSize: 12, fontWeight: "900" }}>{i + 1}</Text>
                </View>
                <Text style={{ color: t.textPrimary, flex: 1, fontSize: 14 }}>{step.title}</Text>
                <Text style={{ color: t.textMuted, fontSize: 12, fontWeight: "700" }}>
                  −{Math.abs(step.offsetMinutes)} min
                </Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={{ backgroundColor: t.accent, padding: 14, borderRadius: 16, alignItems: "center", marginTop: 14 }}
            onPress={save}
          >
            <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 15 }}>Routine speichern ✓</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={generate} style={{ alignItems: "center", marginTop: 8 }}>
            <Text style={{ color: t.textMuted, fontSize: 13 }}>↻ Neu generieren</Text>
          </TouchableOpacity>
        </View>
      )}
    </BottomSheet>
  );
}
