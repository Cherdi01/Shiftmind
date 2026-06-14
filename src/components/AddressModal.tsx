import React, { useEffect, useState } from "react";
import {
  Keyboard, KeyboardAvoidingView, Modal, Platform,
  ScrollView, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback, View,
} from "react-native";
import { ThemeColors } from "../theme";
import { UserAddress } from "../types";
import { hapticLight } from "../utils/haptics";

const STATES = [
  "Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen",
  "Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen",
  "Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen",
  "Sachsen-Anhalt","Schleswig-Holstein","Thüringen",
];

export function AddressModal({
  visible, current, t, onSave, onClose,
}: {
  visible: boolean;
  current?: UserAddress;
  t: ThemeColors;
  onSave: (address: UserAddress) => void;
  onClose: () => void;
}) {
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Baden-Württemberg");
  const [showStatePicker, setShowStatePicker] = useState(false);

  useEffect(() => {
    if (visible && current) {
      setStreet(current.street);
      setHouseNumber(current.houseNumber);
      setZip(current.zip);
      setCity(current.city);
      setState(current.state ?? "Baden-Württemberg");
    }
  }, [visible, current]);

  function handleSave() {
    if (!zip.trim() || !city.trim()) return;
    hapticLight();
    Keyboard.dismiss();
    onSave({ street: street.trim(), houseNumber: houseNumber.trim(), zip: zip.trim(), city: city.trim(), country: "DE", state });
  }

  const inp = {
    backgroundColor: t.bgDeep,
    color: t.textPrimary,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    fontSize: 15,
  } as const;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {/* Außerhalb antippen schließt Modal */}
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); onClose(); }}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end" }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
          >
            {/* Verhindert dass Tap auf Modal-Inhalt das Modal schließt */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{
                backgroundColor: t.bgCard,
                borderTopLeftRadius: 28, borderTopRightRadius: 28,
                padding: 20, maxHeight: "85%",
                borderWidth: 1, borderColor: t.border,
              }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  bounces={false}
                >
                  <Text style={{ color: t.textPrimary, fontSize: 22, fontWeight: "900", marginBottom: 6 }}>
                    Adresse
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 14, marginBottom: 14, lineHeight: 19 }}>
                    Für Feiertage & Schulferien – bleibt lokal auf dem Gerät.
                  </Text>

                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TextInput style={[inp, { flex: 3 }]} placeholder="Straße" placeholderTextColor={t.textMuted} value={street} onChangeText={setStreet} returnKeyType="next" />
                    <TextInput style={[inp, { flex: 1 }]} placeholder="Nr." placeholderTextColor={t.textMuted} value={houseNumber} onChangeText={setHouseNumber} returnKeyType="next" />
                  </View>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TextInput style={[inp, { width: 90 }]} placeholder="PLZ" placeholderTextColor={t.textMuted} value={zip} onChangeText={setZip} keyboardType="number-pad" returnKeyType="next" />
                    <TextInput style={[inp, { flex: 1 }]} placeholder="Stadt" placeholderTextColor={t.textMuted} value={city} onChangeText={setCity} returnKeyType="done" onSubmitEditing={Keyboard.dismiss} />
                  </View>

                  {/* Bundesland */}
                  <TouchableOpacity
                    style={[inp, { marginBottom: 10 }]}
                    onPress={() => { hapticLight(); Keyboard.dismiss(); setShowStatePicker(!showStatePicker); }}
                  >
                    <Text style={{ color: t.textPrimary, fontSize: 15 }}>{state}</Text>
                  </TouchableOpacity>

                  {showStatePicker && (
                    <ScrollView style={{ maxHeight: 200, marginBottom: 10 }} nestedScrollEnabled>
                      {STATES.map((s) => (
                        <TouchableOpacity
                          key={s}
                          onPress={() => { hapticLight(); setState(s); setShowStatePicker(false); }}
                          style={{ padding: 12, backgroundColor: s === state ? t.accentMuted : t.bgDeep, borderRadius: 12, marginBottom: 4 }}
                        >
                          <Text style={{ color: s === state ? t.accent : t.textSecondary, fontWeight: s === state ? "800" : "400" }}>{s}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}

                  <TouchableOpacity
                    style={{ backgroundColor: t.accent, padding: 15, borderRadius: 18, alignItems: "center", marginTop: 4 }}
                    onPress={handleSave}
                  >
                    <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 15 }}>Adresse speichern</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ padding: 14, alignItems: "center" }} onPress={() => { Keyboard.dismiss(); onClose(); }}>
                    <Text style={{ color: t.textMuted, fontWeight: "800" }}>Abbrechen</Text>
                  </TouchableOpacity>

                  {/* Extra Padding damit Inhalt nicht hinter Tastatur verschwindet */}
                  <View style={{ height: 20 }} />
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
