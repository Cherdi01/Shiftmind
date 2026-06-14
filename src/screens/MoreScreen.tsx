import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { User } from "@supabase/supabase-js";
import { ThemeColors } from "../theme";
import { AppTheme, FeatureFlags, RoutineTemplate, ShiftCategory, ShiftTemplate, Tab, UserAddress } from "../types";
import { hapticLight } from "../utils/haptics";

const SHIFT_CATEGORY_ORDER: ShiftCategory[] = ["early","late","night","day","training","free","custom"];
const CATEGORY_LABELS: Record<ShiftCategory, string> = {
  early:"Frühdienst", late:"Spätdienst", night:"Nachtdienst", day:"Tagdienst",
  training:"Fortbildung", free:"Frei", custom:"Sonstiges",
};
const THEMES: { value: AppTheme; label: string; icon: string; desc: string }[] = [
  { value: "dark",     label: "Dark",     icon: "moon-waning-crescent", desc: "Dunkelblau – Standard" },
  { value: "midnight", label: "Midnight", icon: "star-crescent",        desc: "Tiefschwarz mit Lila" },
  { value: "light",    label: "Light",    icon: "white-balance-sunny",  desc: "Hell & klar" },
];
const START_TABS: { value: Tab; label: string; icon: string }[] = [
  { value: "home",  label: "Home",     icon: "home-variant" },
  { value: "month", label: "Kalender", icon: "calendar-month" },
  { value: "tasks", label: "Aufgaben", icon: "checkbox-marked-circle-outline" },
];
const FEATURE_LIST: { key: keyof FeatureFlags; label: string; icon: string; alwaysOn?: boolean }[] = [
  { key: "tasksEnabled",          label: "Aufgaben",    icon: "checkbox-marked-circle-outline", alwaysOn: true },
  { key: "routinesEnabled",       label: "Routinen",    icon: "repeat" },
  { key: "wasteEnabled",          label: "Müllplan",    icon: "trash-can-outline" },
  { key: "eventsEnabled",         label: "Termine",     icon: "calendar-star" },
  { key: "holidaysEnabled",       label: "Feiertage",   icon: "flag-outline" },
  { key: "schoolHolidaysEnabled", label: "Schulferien", icon: "school-outline" },
];

type Section = "account" | "features" | "display" | "shifts" | "routines" | null;

export function MoreScreen({
  templates, routines, currentTheme, startTab, hapticsEnabled,
  features, address, t, user, syncing,
  onNewTemplatePress, onEditTemplate, onDeleteTemplate,
  onNewRoutinePress, onDeleteRoutine,
  onSetTheme, onSetStartTab, onToggleHaptics, onToggleFeature,
  onEditAddress, onSignOut, onReset,
}: {
  templates: ShiftTemplate[];
  routines: RoutineTemplate[];
  currentTheme: AppTheme;
  startTab: Tab;
  hapticsEnabled: boolean;
  features: FeatureFlags;
  address?: UserAddress;
  t: ThemeColors;
  user: User | null;
  syncing: boolean;
  onNewTemplatePress: () => void;
  onEditTemplate: (t: ShiftTemplate) => void;
  onDeleteTemplate: (code: string) => void;
  onNewRoutinePress: () => void;
  onDeleteRoutine: (id: string) => void;
  onSetTheme: (theme: AppTheme) => void;
  onSetStartTab: (tab: Tab) => void;
  onToggleHaptics: () => void;
  onToggleFeature: (key: keyof FeatureFlags) => void;
  onEditAddress: () => void;
  onSignOut: () => void;
  onReset: () => void;
}) {
  const [openSection, setOpenSection] = useState<Section>(null);
  const [expandedCat, setExpandedCat] = useState<ShiftCategory | null>(null);
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null);

  const byCategory = SHIFT_CATEGORY_ORDER.reduce<Record<ShiftCategory, ShiftTemplate[]>>(
    (acc, cat) => { acc[cat] = templates.filter((tmpl) => tmpl.category === cat); return acc; },
    {} as Record<ShiftCategory, ShiftTemplate[]>
  );

  function toggleSection(s: Section) {
    hapticLight();
    setOpenSection((prev) => (prev === s ? null : s));
  }

  const card = {
    backgroundColor: t.bgCard, borderRadius: 22, marginBottom: 10,
    borderWidth: 1, borderColor: t.border, overflow: "hidden" as const,
  };
  const sectionHeader = (label: string, section: Section, icon: string, badge?: string) => (
    <TouchableOpacity
      onPress={() => toggleSection(section)}
      style={{ flexDirection: "row", alignItems: "center", padding: 18, gap: 12 }}
    >
      <MaterialCommunityIcons name={icon as any} size={22} color={openSection === section ? t.accent : t.textMuted} />
      <Text style={{ color: openSection === section ? t.accent : t.textPrimary, fontWeight: "800", fontSize: 16, flex: 1 }}>{label}</Text>
      {badge && (
        <View style={{ backgroundColor: t.accentMuted, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Text style={{ color: t.accent, fontSize: 11, fontWeight: "800" }}>{badge}</Text>
        </View>
      )}
      <MaterialCommunityIcons name={openSection === section ? "chevron-up" : "chevron-down"} size={20} color={t.textMuted} />
    </TouchableOpacity>
  );
  const divider = <View style={{ height: 1, backgroundColor: t.border, marginHorizontal: 16 }} />;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>

      {/* ── Account ── */}
      <View style={card}>
        {sectionHeader("Account", "account", "account-circle-outline",
          user ? undefined : "Lokal"
        )}
        {openSection === "account" && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            {user ? (
              <>
                {/* Eingeloggt */}
                <View style={{ backgroundColor: t.bgDeep, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: t.border }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <MaterialCommunityIcons name="check-circle" size={18} color={t.success} />
                    <Text style={{ color: t.success, fontWeight: "800", fontSize: 14 }}>Eingeloggt</Text>
                    {syncing && <Text style={{ color: t.accent, fontSize: 12 }}>⟳ Sync…</Text>}
                  </View>
                  <Text style={{ color: t.textMuted, fontSize: 14 }}>{user.email}</Text>
                </View>

                <View style={{ backgroundColor: t.bgDeep, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: t.border }}>
                  <Text style={{ color: t.accent, fontWeight: "800", fontSize: 14, marginBottom: 4 }}>☁️ Cloud-Sync aktiv</Text>
                  <Text style={{ color: t.textMuted, fontSize: 13, lineHeight: 19 }}>
                    Alle Daten werden automatisch gespeichert und sind auf jedem Gerät verfügbar.
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => { hapticLight(); onEditAddress(); }}
                  style={{ flexDirection: "row", alignItems: "center", backgroundColor: t.bgDeep, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: t.border }}
                >
                  <MaterialCommunityIcons name="map-marker-outline" size={20} color={t.accent} style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.textPrimary, fontWeight: "800" }}>Adresse</Text>
                    <Text style={{ color: t.textMuted, fontSize: 13 }} numberOfLines={1}>
                      {address ? `${address.zip} ${address.city} · ${address.state}` : "Noch nicht eingetragen"}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={t.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => { hapticLight(); onSignOut(); }}
                  style={{ backgroundColor: "#450a0a", padding: 14, borderRadius: 16, alignItems: "center" }}
                >
                  <Text style={{ color: "#fecaca", fontWeight: "900", fontSize: 15 }}>Abmelden</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Nicht eingeloggt */}
                <View style={{ backgroundColor: t.bgDeep, borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: t.border }}>
                  <Text style={{ color: t.textMuted, fontSize: 13, lineHeight: 19 }}>
                    Du nutzt ShiftMind lokal ohne Account. Daten werden nur auf diesem Gerät gespeichert und können verloren gehen.
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ flex: 1, backgroundColor: t.accentMuted, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: t.accent, alignItems: "center" }}>
                    <MaterialCommunityIcons name="cloud-sync-outline" size={22} color={t.accent} />
                    <Text style={{ color: t.accent, fontWeight: "800", fontSize: 12, marginTop: 4, textAlign: "center" }}>Cloud-Sync</Text>
                    <Text style={{ color: t.textMuted, fontSize: 11, textAlign: "center", marginTop: 2 }}>mit Account</Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: t.bgDeep, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: t.border, alignItems: "center" }}>
                    <MaterialCommunityIcons name="devices" size={22} color={t.textMuted} />
                    <Text style={{ color: t.textMuted, fontWeight: "800", fontSize: 12, marginTop: 4, textAlign: "center" }}>Alle Geräte</Text>
                    <Text style={{ color: t.textMuted, fontSize: 11, textAlign: "center", marginTop: 2 }}>synchron</Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: t.bgDeep, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: t.border, alignItems: "center" }}>
                    <MaterialCommunityIcons name="shield-check-outline" size={22} color={t.textMuted} />
                    <Text style={{ color: t.textMuted, fontWeight: "800", fontSize: 12, marginTop: 4, textAlign: "center" }}>Datensicherung</Text>
                    <Text style={{ color: t.textMuted, fontSize: 11, textAlign: "center", marginTop: 2 }}>jederzeit</Text>
                  </View>
                </View>
                <Text style={{ color: t.textMuted, fontSize: 12, textAlign: "center", marginTop: 10 }}>
                  → Starte die App neu um dich anzumelden
                </Text>
              </>
            )}
          </View>
        )}
      </View>

      {/* ── Features ── */}
      <View style={card}>
        {sectionHeader("Features", "features", "tune")}
        {openSection === "features" && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 8 }}>
            {FEATURE_LIST.map(({ key, label, icon, alwaysOn }) => {
              const isOn = features[key];
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => !alwaysOn && onToggleFeature(key)}
                  activeOpacity={alwaysOn ? 1 : 0.7}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: t.bgDeep, borderRadius: 14, padding: 12, opacity: alwaysOn ? 0.6 : 1 }}
                >
                  <MaterialCommunityIcons name={icon as any} size={20} color={isOn ? t.accent : t.textMuted} />
                  <Text style={{ color: isOn ? t.textPrimary : t.textMuted, fontWeight: "700", fontSize: 14, flex: 1 }}>{label}</Text>
                  <View style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: isOn ? t.accent : t.border, justifyContent: "center", paddingHorizontal: 2 }}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", alignSelf: isOn ? "flex-end" : "flex-start" }} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* ── Darstellung ── */}
      <View style={card}>
        {sectionHeader("Darstellung", "display", "palette-outline")}
        {openSection === "display" && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <Text style={{ color: t.textMuted, fontSize: 13, fontWeight: "700", marginBottom: 8 }}>Theme</Text>
            <View style={{ gap: 8, marginBottom: 16 }}>
              {THEMES.map((theme) => {
                const isActive = currentTheme === theme.value;
                return (
                  <TouchableOpacity key={theme.value} onPress={() => { hapticLight(); onSetTheme(theme.value); }}
                    style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: isActive ? t.accentMuted : t.bgDeep, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: isActive ? t.accent : t.border }}
                  >
                    <MaterialCommunityIcons name={theme.icon as any} size={22} color={isActive ? t.accent : t.textMuted} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: isActive ? t.accent : t.textPrimary, fontWeight: "800", fontSize: 15 }}>{theme.label}</Text>
                      <Text style={{ color: t.textMuted, fontSize: 13 }}>{theme.desc}</Text>
                    </View>
                    {isActive && <MaterialCommunityIcons name="check-circle" size={20} color={t.accent} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={{ color: t.textMuted, fontSize: 13, fontWeight: "700", marginBottom: 8 }}>Startseite</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
              {START_TABS.map((stab) => (
                <TouchableOpacity key={stab.value} onPress={() => { hapticLight(); onSetStartTab(stab.value); }}
                  style={{ flex: 1, alignItems: "center", padding: 12, backgroundColor: startTab === stab.value ? t.accentMuted : t.bgDeep, borderRadius: 14, borderWidth: 1, borderColor: startTab === stab.value ? t.accent : t.border }}
                >
                  <MaterialCommunityIcons name={stab.icon as any} size={22} color={startTab === stab.value ? t.accent : t.textMuted} />
                  <Text style={{ color: startTab === stab.value ? t.accent : t.textMuted, fontWeight: "800", fontSize: 11, marginTop: 4 }}>{stab.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={() => { hapticLight(); onToggleHaptics(); }}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: t.bgDeep, borderRadius: 14, padding: 14 }}
            >
              <MaterialCommunityIcons name="vibrate" size={22} color={hapticsEnabled ? t.accent : t.textMuted} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.textPrimary, fontWeight: "800", fontSize: 15 }}>Haptisches Feedback</Text>
                <Text style={{ color: t.textMuted, fontSize: 13 }}>{hapticsEnabled ? "Aktiv" : "Deaktiviert"}</Text>
              </View>
              <View style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: hapticsEnabled ? t.accent : t.border, justifyContent: "center", paddingHorizontal: 2 }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", alignSelf: hapticsEnabled ? "flex-end" : "flex-start" }} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── Diensttypen ── */}
      <View style={card}>
        {sectionHeader("Diensttypen", "shifts", "briefcase-clock-outline",
          `${templates.length}`
        )}
        {openSection === "shifts" && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            {SHIFT_CATEGORY_ORDER.map((cat) => {
              const catTemplates = byCategory[cat];
              if (!catTemplates.length) return null;
              const isOpen = expandedCat === cat;
              return (
                <View key={cat} style={{ marginBottom: 6 }}>
                  <TouchableOpacity onPress={() => { hapticLight(); setExpandedCat(isOpen ? null : cat); }}
                    style={{ flexDirection: "row", alignItems: "center", backgroundColor: t.bgDeep, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: isOpen ? t.accent : t.border }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: isOpen ? t.accent : t.textPrimary, fontWeight: "800", fontSize: 14 }}>{CATEGORY_LABELS[cat]}</Text>
                      <Text style={{ color: t.textMuted, fontSize: 12 }}>{catTemplates.length} {catTemplates.length === 1 ? "Typ" : "Typen"}</Text>
                    </View>
                    <MaterialCommunityIcons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color={t.textMuted} />
                  </TouchableOpacity>
                  {isOpen && catTemplates.map((tmpl) => (
                    <View key={tmpl.code} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12 }}>
                      <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: tmpl.color, marginRight: 10 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: t.textSecondary, fontWeight: "700", fontSize: 14 }}>{tmpl.code} · {tmpl.name}</Text>
                        <Text style={{ color: t.textMuted, fontSize: 12 }}>{tmpl.startTime} – {tmpl.endTime}</Text>
                      </View>
                      <TouchableOpacity onPress={() => { hapticLight(); onEditTemplate(tmpl); }} style={{ padding: 6 }}>
                        <MaterialCommunityIcons name="pencil-outline" size={18} color={t.accent} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { hapticLight(); onDeleteTemplate(tmpl.code); }} style={{ padding: 6 }}>
                        <MaterialCommunityIcons name="trash-can-outline" size={18} color={t.danger} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              );
            })}
            <TouchableOpacity style={{ backgroundColor: t.accent, padding: 14, borderRadius: 18, alignItems: "center", marginTop: 8 }} onPress={() => { hapticLight(); onNewTemplatePress(); }}>
              <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 15 }}>+ Diensttyp hinzufügen</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── Routinen ── */}
      {features.routinesEnabled && (
        <View style={card}>
          {sectionHeader("Routinen", "routines", "repeat", `${routines.length}`)}
          {openSection === "routines" && (
            <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
              {routines.map((routine) => {
                const isOpen = expandedRoutine === routine.id;
                return (
                  <View key={routine.id} style={{ marginBottom: 6 }}>
                    <TouchableOpacity onPress={() => { hapticLight(); setExpandedRoutine(isOpen ? null : routine.id); }}
                      style={{ flexDirection: "row", alignItems: "center", backgroundColor: t.bgDeep, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: isOpen ? t.accent : t.border }}
                    >
                      <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: t.accent, marginRight: 10 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: isOpen ? t.accent : t.textPrimary, fontWeight: "800", fontSize: 14 }}>{routine.name}</Text>
                        <Text style={{ color: t.textMuted, fontSize: 12 }}>{routine.steps.length} Schritte · {CATEGORY_LABELS[routine.appliesTo]}</Text>
                      </View>
                      <TouchableOpacity onPress={() => { hapticLight(); onDeleteRoutine(routine.id); }} style={{ padding: 6 }}>
                        <MaterialCommunityIcons name="trash-can-outline" size={18} color={t.danger} />
                      </TouchableOpacity>
                      <MaterialCommunityIcons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color={t.textMuted} />
                    </TouchableOpacity>
                    {isOpen && (
                      <View style={{ paddingLeft: 24, paddingTop: 6, paddingBottom: 4 }}>
                        {routine.steps.map((step) => (
                          <View key={step.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5 }}>
                            <MaterialCommunityIcons name="circle-small" size={18} color={t.textMuted} />
                            <Text style={{ color: t.textMuted, flex: 1 }}>{step.title}</Text>
                            <Text style={{ color: t.borderStrong, fontSize: 12, fontWeight: "700" }}>−{Math.abs(step.offsetMinutes)} min</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
              <TouchableOpacity style={{ backgroundColor: t.accentMuted, padding: 14, borderRadius: 18, alignItems: "center", marginTop: 8, borderWidth: 1, borderColor: t.accent }} onPress={() => { hapticLight(); onNewRoutinePress(); }}>
                <Text style={{ color: t.accent, fontWeight: "900", fontSize: 15 }}>+ Neue Routine erstellen</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* ── Reset ── */}
      <TouchableOpacity style={{ backgroundColor: "#450a0a", padding: 15, borderRadius: 18, alignItems: "center", marginTop: 4, marginBottom: 28 }} onPress={() => { hapticLight(); onReset(); }}>
        <Text style={{ color: "#fecaca", fontWeight: "900", fontSize: 15 }}>Demo-Daten zurücksetzen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
