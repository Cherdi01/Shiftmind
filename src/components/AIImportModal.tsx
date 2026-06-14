import React, { useState } from "react";
import {
  ActivityIndicator, Alert, Image, ScrollView,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  launchCamera, launchImageLibrary,
  ImagePickerResponse, MediaType,
} from "react-native-image-picker";
import { BottomSheet } from "./BottomSheet";
import { ThemeColors } from "../theme";
import { AssignedShift } from "../types";
import { parseShiftImage, parseShiftText } from "../services/aiService";
import { hapticLight, hapticSuccess } from "../utils/haptics";

type Props = {
  visible: boolean;
  t: ThemeColors;
  knownCodes: string[];
  onConfirm: (shifts: AssignedShift[]) => void;
  onClose: () => void;
};

type Mode = "choose" | "text" | "preview";

export function AIImportModal({ visible, t, knownCodes, onConfirm, onClose }: Props) {
  const [mode, setMode] = useState<Mode>("choose");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [parsed, setParsed] = useState<AssignedShift[]>([]);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setMode("choose");
    setText("");
    setImageUri(null);
    setParsed([]);
    setError(null);
  }

  async function handleImageResult(response: ImagePickerResponse) {
    if (response.didCancel || response.errorCode) return;
    const asset = response.assets?.[0];
    if (!asset?.base64 || !asset.uri) return;

    setImageUri(asset.uri);
    setLoading(true);
    setError(null);

    try {
      const mimeType = asset.type ?? "image/jpeg";
      const shifts = await parseShiftImage(asset.base64, mimeType, knownCodes);
      setParsed(shifts);
      setMode("preview");
      hapticSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function pickFromCamera() {
    hapticLight();
    launchCamera(
      { mediaType: "photo" as MediaType, includeBase64: true, quality: 0.8 },
      handleImageResult
    );
  }

  async function pickFromGallery() {
    hapticLight();
    launchImageLibrary(
      { mediaType: "photo" as MediaType, includeBase64: true, quality: 0.8 },
      handleImageResult
    );
  }

  async function analyzeText() {
    if (!text.trim()) return;
    hapticLight();
    setLoading(true);
    setError(null);
    try {
      const shifts = await parseShiftText(text, knownCodes);
      setParsed(shifts);
      setMode("preview");
      hapticSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function removeShift(index: number) {
    setParsed((prev) => prev.filter((_, i) => i !== index));
  }

  function confirm() {
    hapticSuccess();
    onConfirm(parsed);
    reset();
    onClose();
  }

  const actionBtn = (label: string, icon: string, onPress: () => void, accent = false) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1, alignItems: "center", padding: 16, borderRadius: 18,
        backgroundColor: accent ? t.accent : t.bgDeep,
        borderWidth: 1, borderColor: accent ? t.accent : t.border, gap: 8,
      }}
    >
      <MaterialCommunityIcons name={icon as any} size={28} color={accent ? t.bgDeep : t.accent} />
      <Text style={{ color: accent ? t.bgDeep : t.textPrimary, fontWeight: "800", fontSize: 13, textAlign: "center" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheet visible={visible} t={t} onClose={() => { reset(); onClose(); }} maxHeight="90%">
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <MaterialCommunityIcons name="robot-outline" size={26} color={t.accent} />
        <Text style={{ color: t.textPrimary, fontSize: 22, fontWeight: "900" }}>KI-Import</Text>
        {mode !== "choose" && (
          <TouchableOpacity onPress={reset} style={{ marginLeft: "auto" }}>
            <Text style={{ color: t.accent, fontWeight: "800" }}>← Zurück</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Auswahl */}
      {mode === "choose" && (
        <View>
          <Text style={{ color: t.textMuted, fontSize: 14, marginBottom: 16, lineHeight: 20 }}>
            Fotografiere deinen Dienstplan oder tippe ihn ein – die KI erkennt die Dienste automatisch.
          </Text>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            {actionBtn("Foto aufnehmen", "camera-outline", pickFromCamera, true)}
            {actionBtn("Aus Galerie", "image-outline", pickFromGallery)}
          </View>
          <TouchableOpacity
            onPress={() => setMode("text")}
            style={{ backgroundColor: t.bgDeep, borderRadius: 18, padding: 16, alignItems: "center", borderWidth: 1, borderColor: t.border, flexDirection: "row", gap: 10, justifyContent: "center" }}
          >
            <MaterialCommunityIcons name="text-box-outline" size={22} color={t.textMuted} />
            <Text style={{ color: t.textMuted, fontWeight: "800", fontSize: 14 }}>Text eingeben</Text>
          </TouchableOpacity>

          {/* Bild-Vorschau + Ladeindikator */}
          {loading && (
            <View style={{ alignItems: "center", padding: 24, gap: 12 }}>
              {imageUri && (
                <Image source={{ uri: imageUri }} style={{ width: 200, height: 140, borderRadius: 12 }} resizeMode="cover" />
              )}
              <ActivityIndicator size="large" color={t.accent} />
              <Text style={{ color: t.textMuted }}>KI liest deinen Dienstplan…</Text>
            </View>
          )}
        </View>
      )}

      {/* Text-Eingabe */}
      {mode === "text" && (
        <View>
          <Text style={{ color: t.textMuted, fontSize: 14, marginBottom: 10 }}>
            Kopiere deinen Dienstplan hier rein – die KI versteht auch unstrukturierten Text.
          </Text>
          <TextInput
            style={{
              backgroundColor: t.bgDeep, color: t.textPrimary,
              borderWidth: 1, borderColor: t.border, borderRadius: 14,
              padding: 14, minHeight: 150, textAlignVertical: "top",
              fontSize: 14, marginBottom: 12,
            }}
            multiline
            placeholder={"Mo 3.6 Frühdienst\nDi 4.6 frei\n5. Spätdienst S4\n..."}
            placeholderTextColor={t.textMuted}
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity
            style={{ backgroundColor: t.accent, padding: 15, borderRadius: 18, alignItems: "center" }}
            onPress={analyzeText}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={t.bgDeep} />
              : <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 16 }}>🤖 KI analysieren lassen</Text>
            }
          </TouchableOpacity>
        </View>
      )}

      {/* Fehler */}
      {error && (
        <View style={{ backgroundColor: "#450a0a", borderRadius: 14, padding: 14, marginTop: 12 }}>
          <Text style={{ color: "#fca5a5", fontWeight: "800" }}>Fehler</Text>
          <Text style={{ color: "#fca5a5", fontSize: 13, marginTop: 4 }}>{error}</Text>
          <TouchableOpacity onPress={reset} style={{ marginTop: 10 }}>
            <Text style={{ color: "#fca5a5", fontWeight: "800", textDecorationLine: "underline" }}>Nochmal versuchen</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Vorschau */}
      {mode === "preview" && (
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ color: t.success, fontWeight: "800", fontSize: 16 }}>
              ✓ {parsed.length} Dienste erkannt
            </Text>
            <Text style={{ color: t.textMuted, fontSize: 13 }}>Tippe zum Entfernen</Text>
          </View>
          <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false}>
            {[...parsed].sort((a, b) => a.day - b.day).map((shift, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => removeShift(i)}
                style={{ flexDirection: "row", alignItems: "center", backgroundColor: t.bgDeep, borderRadius: 12, padding: 10, marginBottom: 6, gap: 10 }}
              >
                <Text style={{ color: t.textMuted, fontSize: 13, width: 50 }}>Tag {shift.day}</Text>
                <View style={{ backgroundColor: t.accentMuted, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ color: t.accent, fontWeight: "900", fontSize: 14 }}>{shift.code}</Text>
                </View>
                <MaterialCommunityIcons name="close-circle-outline" size={18} color={t.borderStrong} style={{ marginLeft: "auto" }} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {parsed.length > 0 ? (
            <TouchableOpacity
              style={{ backgroundColor: t.accent, padding: 15, borderRadius: 18, alignItems: "center", marginTop: 12 }}
              onPress={confirm}
            >
              <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 16 }}>
                {parsed.length} Dienste übernehmen →
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ backgroundColor: t.bgDeep, borderRadius: 14, padding: 14, marginTop: 8, alignItems: "center" }}>
              <Text style={{ color: t.textMuted }}>Alle Einträge entfernt.</Text>
              <TouchableOpacity onPress={reset} style={{ marginTop: 8 }}>
                <Text style={{ color: t.accent, fontWeight: "800" }}>Neu starten</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </BottomSheet>
  );
}
