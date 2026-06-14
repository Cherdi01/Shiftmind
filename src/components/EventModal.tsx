import React, { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BottomSheet } from "./BottomSheet";
import { ThemeColors } from "../theme";
import { CalendarEvent, EventType } from "../types";
import { hapticLight } from "../utils/haptics";

const EVENT_TYPES: { value: EventType; label: string; icon: string }[] = [
  { value: "appointment", label: "Termin",      icon: "📅" },
  { value: "birthday",    label: "Geburtstag",  icon: "🎂" },
  { value: "reminder",    label: "Erinnerung",  icon: "🔔" },
  { value: "custom",      label: "Sonstiges",   icon: "📌" },
];

const MONTH_NAMES = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];

export function EventModal({
  visible, day, month, t, editEvent, onSave, onClose,
}: {
  visible: boolean;
  day: number;
  month: number;
  t: ThemeColors;
  editEvent?: CalendarEvent;
  onSave: (data: Omit<CalendarEvent, "id">) => void;
  onClose: () => void;
}) {
  const [type, setType] = useState<EventType>("appointment");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!visible) return;
    if (editEvent) {
      setType(editEvent.type);
      setTitle(editEvent.title);
      setTime(editEvent.time ?? "");
      setBirthYear(editEvent.birthYear ? String(editEvent.birthYear) : "");
      setNote(editEvent.note ?? "");
    } else {
      setType("appointment");
      setTitle(""); setTime(""); setBirthYear(""); setNote("");
    }
  }, [visible, editEvent]);

  function handleSave() {
    if (!title.trim()) return;
    hapticLight();
    const isBirthday = type === "birthday";
    onSave({
      type, title: title.trim(),
      day, month,
      time: time.trim() || undefined,
      birthYear: isBirthday && birthYear ? parseInt(birthYear) : undefined,
      recurring: isBirthday,
      note: note.trim() || undefined,
    });
  }

  const inp = { backgroundColor: t.bgDeep, color: t.textPrimary, borderWidth: 1, borderColor: t.border, borderRadius: 14, padding: 12, marginBottom: 10, fontSize: 15 } as const;

  return (
    <BottomSheet visible={visible} t={t} onClose={onClose} avoidKeyboard maxHeight="93%">
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={{ color: t.textPrimary, fontSize: 22, fontWeight: "900", marginBottom: 4 }}>
              {editEvent ? "Event bearbeiten" : "Neues Event"}
            </Text>
            <Text style={{ color: t.textMuted, fontSize: 14, marginBottom: 14 }}>
              {day}. {MONTH_NAMES[month]}
            </Text>

            {/* Typ */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
              {EVENT_TYPES.map((et) => (
                <TouchableOpacity
                  key={et.value}
                  onPress={() => { hapticLight(); setType(et.value); }}
                  style={{ flex: 1, alignItems: "center", padding: 10, borderRadius: 14, backgroundColor: type === et.value ? t.accentMuted : t.bgDeep, borderWidth: 1, borderColor: type === et.value ? t.accent : t.border }}
                >
                  <Text style={{ fontSize: 18 }}>{et.icon}</Text>
                  <Text style={{ color: type === et.value ? t.accent : t.textMuted, fontSize: 11, fontWeight: "800", marginTop: 4 }}>{et.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput style={inp} placeholder="Titel" placeholderTextColor={t.textMuted} value={title} onChangeText={setTitle} />

            {type !== "birthday" && (
              <TextInput style={inp} placeholder="Uhrzeit, z.B. 14:30 (optional)" placeholderTextColor={t.textMuted} value={time} onChangeText={setTime} keyboardType="numbers-and-punctuation" />
            )}

            {type === "birthday" && (
              <TextInput style={inp} placeholder="Geburtsjahr, z.B. 1990 (optional)" placeholderTextColor={t.textMuted} value={birthYear} onChangeText={setBirthYear} keyboardType="number-pad" />
            )}

            <TextInput style={[inp, { minHeight: 70, textAlignVertical: "top" }]} placeholder="Notiz (optional)" placeholderTextColor={t.textMuted} value={note} onChangeText={setNote} multiline />

            <TouchableOpacity
              style={{ backgroundColor: t.accent, padding: 15, borderRadius: 18, alignItems: "center", marginTop: 4 }}
              onPress={handleSave}
            >
              <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 15 }}>
                {editEvent ? "Speichern" : "Event hinzufügen"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 14, alignItems: "center" }} onPress={onClose}>
              <Text style={{ color: t.textMuted, fontWeight: "800" }}>Abbrechen</Text>
            </TouchableOpacity>
          </ScrollView>
    </BottomSheet>
  );
}
