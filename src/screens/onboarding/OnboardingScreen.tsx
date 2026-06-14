import React, { useState } from "react";
import {
  ScrollView, Text, TextInput, TouchableOpacity, View, Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeColors } from "../../theme";
import {
  AppTheme, FeatureFlags, ShiftCategory, Tab, UserAddress, UserProfile,
} from "../../types";
import { hapticLight, hapticSuccess } from "../../utils/haptics";

const { width } = Dimensions.get("window");

const STATES = [
  "Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen",
  "Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen",
  "Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen",
  "Sachsen-Anhalt","Schleswig-Holstein","Thüringen",
];

const SHIFT_MODELS: { value: UserProfile["shiftModel"]; label: string; desc: string; icon: string }[] = [
  { value: "early-late-night", label: "Früh / Spät / Nacht", desc: "Alle drei Schichten im Wechsel", icon: "clock-outline" },
  { value: "early-late",       label: "Früh / Spät",         desc: "Kein Nachtdienst",              icon: "weather-sunset" },
  { value: "day-only",         label: "Nur Tagdienst",        desc: "Feste Arbeitszeiten tagsüber",  icon: "white-balance-sunny" },
  { value: "custom",           label: "Individuell",          desc: "Eigene Diensttypen definieren", icon: "tune" },
];

const FEATURES: { key: keyof FeatureFlags; label: string; desc: string; icon: string; alwaysOn?: boolean }[] = [
  { key: "tasksEnabled",          label: "Aufgaben",       desc: "Tagesgebundene To-dos",            icon: "checkbox-marked-circle-outline", alwaysOn: true },
  { key: "routinesEnabled",       label: "Routinen",       desc: "Vorbereitung vor dem Dienst",      icon: "repeat" },
  { key: "wasteEnabled",          label: "Müllplan",       desc: "Abholtermine im Kalender",         icon: "trash-can-outline" },
  { key: "eventsEnabled",         label: "Termine",        desc: "Geburtstage & Verabredungen",      icon: "calendar-star" },
  { key: "holidaysEnabled",       label: "Feiertage",      desc: "Gesetzliche Feiertage einblenden", icon: "flag-outline" },
  { key: "schoolHolidaysEnabled", label: "Schulferien",    desc: "Ferienzeiten im Kalender",         icon: "school-outline" },
];

const START_TABS: { value: Tab; label: string; icon: string }[] = [
  { value: "home",  label: "Home",     icon: "home-variant" },
  { value: "month", label: "Kalender", icon: "calendar-month" },
  { value: "tasks", label: "Aufgaben", icon: "checkbox-marked-circle-outline" },
];

const THEMES: { value: AppTheme; label: string; icon: string; bg: string; accent: string }[] = [
  { value: "dark",     label: "Dark",     icon: "moon-waning-crescent", bg: "#050b14", accent: "#38bdf8" },
  { value: "midnight", label: "Midnight", icon: "star-crescent",        bg: "#000000", accent: "#818cf8" },
  { value: "light",    label: "Light",    icon: "white-balance-sunny",  bg: "#f1f5f9", accent: "#0284c7" },
];

type OnboardingData = {
  name: string;
  shiftModel: UserProfile["shiftModel"];
  state: string;
  zip: string;
  city: string;
  features: FeatureFlags;
  startTab: Tab;
  theme: AppTheme;
};

type Props = {
  t: ThemeColors;
  onComplete: (data: OnboardingData) => void;
};

const TOTAL_STEPS = 5;

export function OnboardingScreen({ t, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [shiftModel, setShiftModel] = useState<UserProfile["shiftModel"]>("early-late-night");
  const [state, setState] = useState("Baden-Württemberg");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [features, setFeatures] = useState<FeatureFlags>({
    wasteEnabled: true, routinesEnabled: true, eventsEnabled: true,
    holidaysEnabled: true, schoolHolidaysEnabled: false, tasksEnabled: true,
  });
  const [startTab, setStartTab] = useState<Tab>("home");
  const [theme, setTheme] = useState<AppTheme>("dark");

  function toggleFeature(key: keyof FeatureFlags) {
    hapticLight();
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function next() {
    hapticLight();
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  }

  function back() {
    hapticLight();
    if (step > 0) setStep((s) => s - 1);
  }

  function finish() {
    hapticSuccess();
    onComplete({ name, shiftModel, state, zip, city, features, startTab, theme });
  }

  const canNext = [
    name.trim().length > 0,          // Step 0: Name
    true,                             // Step 1: Schichtmodell
    zip.trim().length >= 4 && city.trim().length > 0, // Step 2: Adresse
    true,                             // Step 3: Features
    true,                             // Step 4: Design
  ][step];

  const inp = {
    backgroundColor: t.bgDeep,
    color: t.textPrimary,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    fontSize: 16,
  } as const;

  // Progress dots
  const Progress = () => (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 32 }}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View key={i} style={{
          width: i === step ? 24 : 8, height: 8, borderRadius: 4,
          backgroundColor: i <= step ? t.accent : t.border,
        }} />
      ))}
    </View>
  );

  const stepTitles = ["Hey, wer bist du?", "Dein Schichtmodell", "Dein Standort", "Welche Features?", "Dein Design"];
  const stepSubs = [
    "ShiftMind personalisiert sich für dich.",
    "Bestimmt welche Diensttypen vorgeschlagen werden.",
    "Für Feiertage & Schulferien – bleibt lokal auf dem Gerät.",
    "Du kannst alles später in den Einstellungen ändern.",
    "Startseite und Theme – jederzeit anpassbar.",
  ];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {/* Logo */}
      <View style={{ paddingHorizontal: 28, paddingTop: 60, paddingBottom: 8 }}>
        <Text style={{ color: t.accent, fontSize: 28, fontWeight: "900", marginBottom: 2 }}>ShiftMind</Text>
        <Text style={{ color: t.textMuted, fontSize: 13 }}>Einrichtung · Schritt {step + 1} von {TOTAL_STEPS}</Text>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 28 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Progress />

        <Text style={{ color: t.textPrimary, fontSize: 26, fontWeight: "900", marginBottom: 6 }}>
          {stepTitles[step]}
        </Text>
        <Text style={{ color: t.textMuted, fontSize: 15, marginBottom: 24, lineHeight: 22 }}>
          {stepSubs[step]}
        </Text>

        {/* ── Step 0: Name ── */}
        {step === 0 && (
          <View>
            <TextInput
              style={inp}
              placeholder="Dein Name"
              placeholderTextColor={t.textMuted}
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={name.trim() ? next : undefined}
            />
            <Text style={{ color: t.textMuted, fontSize: 13, marginTop: 4 }}>
              Wird nur lokal gespeichert – kein Account nötig.
            </Text>
            {/* Vorschau: spätere Login-Option */}
            <View style={{ marginTop: 24, backgroundColor: t.bgCard, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: t.border }}>
              <Text style={{ color: t.accent, fontWeight: "800", fontSize: 14, marginBottom: 4 }}>
                🔐 Account (demnächst)
              </Text>
              <Text style={{ color: t.textMuted, fontSize: 13, lineHeight: 20 }}>
                Mit einem Account werden deine Daten gesichert und du kannst ShiftMind auf mehreren Geräten nutzen. Login kommt in einem der nächsten Updates.
              </Text>
            </View>
          </View>
        )}

        {/* ── Step 1: Schichtmodell ── */}
        {step === 1 && (
          <View style={{ gap: 10 }}>
            {SHIFT_MODELS.map((m) => (
              <TouchableOpacity
                key={m.value}
                onPress={() => { hapticLight(); setShiftModel(m.value); }}
                style={{
                  flexDirection: "row", alignItems: "center", gap: 14,
                  backgroundColor: shiftModel === m.value ? t.accentMuted : t.bgCard,
                  borderRadius: 18, padding: 16,
                  borderWidth: 1, borderColor: shiftModel === m.value ? t.accent : t.border,
                }}
              >
                <MaterialCommunityIcons name={m.icon as any} size={26} color={shiftModel === m.value ? t.accent : t.textMuted} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: shiftModel === m.value ? t.accent : t.textPrimary, fontWeight: "800", fontSize: 16 }}>
                    {m.label}
                  </Text>
                  <Text style={{ color: t.textMuted, fontSize: 13 }}>{m.desc}</Text>
                </View>
                {shiftModel === m.value && (
                  <MaterialCommunityIcons name="check-circle" size={22} color={t.accent} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Step 2: Adresse ── */}
        {step === 2 && (
          <View>
            {/* Bundesland */}
            <TouchableOpacity
              style={[inp, { marginBottom: 10 }]}
              onPress={() => { hapticLight(); setShowStatePicker(!showStatePicker); }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: t.textPrimary, fontSize: 16 }}>{state}</Text>
                <MaterialCommunityIcons name={showStatePicker ? "chevron-up" : "chevron-down"} size={20} color={t.textMuted} />
              </View>
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
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput style={[inp, { width: 90 }]} placeholder="PLZ" placeholderTextColor={t.textMuted} value={zip} onChangeText={setZip} keyboardType="number-pad" />
              <TextInput style={[inp, { flex: 1 }]} placeholder="Stadt" placeholderTextColor={t.textMuted} value={city} onChangeText={setCity} />
            </View>
            <Text style={{ color: t.textMuted, fontSize: 13, marginTop: 4, lineHeight: 19 }}>
              PLZ und Stadt werden für Feiertage & Schulferien verwendet und bleiben lokal auf deinem Gerät.
            </Text>
          </View>
        )}

        {/* ── Step 3: Features ── */}
        {step === 3 && (
          <View style={{ gap: 10 }}>
            {FEATURES.map(({ key, label, desc, icon, alwaysOn }) => {
              const isOn = features[key];
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => !alwaysOn && toggleFeature(key)}
                  activeOpacity={alwaysOn ? 1 : 0.7}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 14,
                    backgroundColor: isOn ? t.accentMuted : t.bgCard,
                    borderRadius: 18, padding: 16,
                    borderWidth: 1, borderColor: isOn ? t.accent : t.border,
                    opacity: alwaysOn ? 0.7 : 1,
                  }}
                >
                  <MaterialCommunityIcons name={icon as any} size={24} color={isOn ? t.accent : t.textMuted} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: isOn ? t.accent : t.textPrimary, fontWeight: "800", fontSize: 15 }}>{label}</Text>
                    <Text style={{ color: t.textMuted, fontSize: 13 }}>{desc}{alwaysOn ? " · immer aktiv" : ""}</Text>
                  </View>
                  {/* Toggle */}
                  <View style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: isOn ? t.accent : t.border, justifyContent: "center", paddingHorizontal: 2 }}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", alignSelf: isOn ? "flex-end" : "flex-start" }} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── Step 4: Design & Startseite ── */}
        {step === 4 && (
          <View>
            <Text style={{ color: t.accent, fontWeight: "800", fontSize: 15, marginBottom: 10 }}>Theme</Text>
            <View style={{ gap: 10, marginBottom: 24 }}>
              {THEMES.map((th) => (
                <TouchableOpacity
                  key={th.value}
                  onPress={() => { hapticLight(); setTheme(th.value); }}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 14,
                    backgroundColor: theme === th.value ? t.accentMuted : t.bgCard,
                    borderRadius: 18, padding: 16,
                    borderWidth: 1, borderColor: theme === th.value ? t.accent : t.border,
                  }}
                >
                  {/* Mini-Vorschau */}
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: th.bg, borderWidth: 1, borderColor: th.accent, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: 16, height: 4, borderRadius: 2, backgroundColor: th.accent }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme === th.value ? t.accent : t.textPrimary, fontWeight: "800", fontSize: 15 }}>{th.label}</Text>
                  </View>
                  {theme === th.value && <MaterialCommunityIcons name="check-circle" size={22} color={t.accent} />}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ color: t.accent, fontWeight: "800", fontSize: 15, marginBottom: 10 }}>Startseite beim Öffnen</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {START_TABS.map((tab) => (
                <TouchableOpacity
                  key={tab.value}
                  onPress={() => { hapticLight(); setStartTab(tab.value); }}
                  style={{
                    flex: 1, alignItems: "center", padding: 14,
                    backgroundColor: startTab === tab.value ? t.accentMuted : t.bgCard,
                    borderRadius: 18, borderWidth: 1,
                    borderColor: startTab === tab.value ? t.accent : t.border,
                  }}
                >
                  <MaterialCommunityIcons name={tab.icon as any} size={24} color={startTab === tab.value ? t.accent : t.textMuted} />
                  <Text style={{ color: startTab === tab.value ? t.accent : t.textMuted, fontWeight: "800", fontSize: 12, marginTop: 6 }}>{tab.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Navigation */}
      <View style={{ paddingHorizontal: 28, paddingBottom: 40, paddingTop: 12, backgroundColor: t.bg, gap: 10 }}>
        {step === TOTAL_STEPS - 1 ? (
          <TouchableOpacity
            style={{ backgroundColor: t.accent, padding: 17, borderRadius: 20, alignItems: "center" }}
            onPress={finish}
          >
            <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 17 }}>Los geht's 🚀</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ backgroundColor: canNext ? t.accent : t.border, padding: 17, borderRadius: 20, alignItems: "center" }}
            onPress={canNext ? next : undefined}
            activeOpacity={canNext ? 0.8 : 1}
          >
            <Text style={{ color: canNext ? t.bgDeep : t.textMuted, fontWeight: "900", fontSize: 17 }}>Weiter →</Text>
          </TouchableOpacity>
        )}
        {step > 0 && (
          <TouchableOpacity style={{ alignItems: "center", padding: 12 }} onPress={back}>
            <Text style={{ color: t.textMuted, fontWeight: "700", fontSize: 15 }}>← Zurück</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
