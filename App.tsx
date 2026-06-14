import "react-native-url-polyfill/auto";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, StatusBar, Text, View } from "react-native";
import { AddressModal } from "./src/components/AddressModal";
import { DayDetailModal } from "./src/components/DayDetailModal";
import { EventModal } from "./src/components/EventModal";
import { ImportModal } from "./src/components/ImportModal";
import { NewRoutineModal } from "./src/components/NewRoutineModal";
import { NewTemplateModal } from "./src/components/NewTemplateModal";
import { ShiftSelectModal } from "./src/components/ShiftSelectModal";
import { TabButton } from "./src/components/TabButton";
import { WasteScheduleModal } from "./src/components/WasteScheduleModal";
import { OnboardingScreen } from "./src/screens/onboarding/OnboardingScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { useAuth } from "./src/hooks/useAuth";
import { useEvents } from "./src/hooks/useEvents";
import { useRoutines } from "./src/hooks/useRoutines";
import { DEFAULT_SETTINGS, useSettings } from "./src/hooks/useSettings";
import { useShiftPlan } from "./src/hooks/useShiftPlan";
import { useTasks } from "./src/hooks/useTasks";
import { useRoutineSteps, useWastePlan } from "./src/hooks/useWastePlan";
import { HomeScreen } from "./src/screens/HomeScreen";
import { MonthScreen } from "./src/screens/MonthScreen";
import { MoreScreen } from "./src/screens/MoreScreen";
import { TasksScreen } from "./src/screens/TasksScreen";
import { resetStoredData } from "./src/services/storage";
import {
  syncSettingsToCloud, syncTemplatesToCloud, syncRoutinesToCloud,
  syncEventsToCloud, syncWasteScheduleToCloud,
} from "./src/services/syncService";
import { getStateCode } from "./src/services/holidayService";
import { getTheme } from "./src/theme";
import {
  AppTheme, CalendarEvent, FeatureFlags,
  ShiftCategory, ShiftTemplate, Tab, UserProfile,
} from "./src/types";

export default function App() {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const {
    user, authState, syncing, cloudData,
    signUp, signIn, signInWithApple, signOut, resetPassword,
  } = useAuth();

  // ── Settings ──────────────────────────────────────────────────────────────
  const {
    settings, loaded: settingsLoaded,
    setTheme, toggleHaptics, setAddress, setStartTab,
    toggleFeature, setFeatures, setProfile, completeOnboarding,
  } = useSettings();

  const t = getTheme(settings.theme);
  const stateCode = getStateCode(settings.address);

  // ── Tab State ─────────────────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>("home");
  const [tabInitialized, setTabInitialized] = useState(false);
  const [skippedAuth, setSkippedAuth] = useState(false);
  useEffect(() => {
    if (settingsLoaded && !tabInitialized) {
      setTab(settings.startTab ?? "home");
      setTabInitialized(true);
    }
  }, [settingsLoaded]);

  // ── Cloud Sync: wenn Login erfolgreich ───────────────────────────────────
  useEffect(() => {
    if (!cloudData) return;
    // Cloud-Daten in lokale Hooks laden
    if (cloudData.templates?.length) { /* useShiftPlan lädt selbst */ }
    if (cloudData.settings) {
      const s = cloudData.settings as any;
      if (s.theme) setTheme(s.theme);
      if (s.startTab) setStartTab(s.startTab);
      if (s.features) setFeatures(s.features);
      if (s.address) setAddress(s.address);
    }
    if (cloudData.profile) {
      setProfile({
        id: user?.id ?? "local",
        name: cloudData.profile.name ?? "",
        shiftModel: cloudData.profile.shift_model ?? "early-late-night",
      });
      completeOnboarding(); // Cloud-User hat Onboarding bereits gemacht
    }
  }, [cloudData]);

  // Modal States
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth] = useState<number>(new Date().getMonth());
  const [showDayModal, setShowDayModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showWasteModal, setShowWasteModal] = useState(false);
  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [presetCode, setPresetCode] = useState<string | undefined>(undefined);
  const [editTemplate, setEditTemplate] = useState<ShiftTemplate | undefined>(undefined);
  const [editEvent, setEditEvent] = useState<CalendarEvent | undefined>(undefined);
  const [unknownCodes, setUnknownCodes] = useState<string[]>([]);

  // ── Data Hooks ────────────────────────────────────────────────────────────
  const {
    templates, assigned, assignedMap, templateMap, loaded,
    assignShift, saveNewTemplate, deleteTemplate, handleImport, resetShiftData,
  } = useShiftPlan();
  const { tasks, addTask, toggleTask, deleteTask, resetTasks } = useTasks(loaded);
  const { completedSteps, toggleRoutineStep, resetSteps } = useRoutineSteps(loaded);
  const { schedule, getWasteMap, addScheduleEntry, deleteScheduleEntry, resetWaste } = useWastePlan(loaded);
  const { routines, addRoutine, deleteRoutine, resetRoutines } = useRoutines();
  const { events, getEventsForDay, addEvent, deleteEvent, resetEvents } = useEvents(loaded);

  const today = new Date();
  const todayDay = today.getDate();
  const currentWasteMap = useMemo(() => getWasteMap(today.getFullYear(), today.getMonth()), [schedule]);
  const openTaskCount = tasks.filter((t) => !t.done && t.day >= todayDay).length;

  const selectedCode = selectedDay ? assignedMap[selectedDay] : undefined;
  const selectedTemplate = selectedCode ? templateMap[selectedCode.toUpperCase()] : undefined;
  const selectedTasks = selectedDay ? tasks.filter((t) => t.day === selectedDay) : [];
  const selectedWaste = selectedDay ? (currentWasteMap[selectedDay] ?? []) : [];

  // ── Sync nach Änderungen ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !loaded) return;
    syncTemplatesToCloud(templates).catch(() => {});
  }, [templates, user, loaded]);

  useEffect(() => {
    if (!user || !loaded) return;
    syncWasteScheduleToCloud(schedule).catch(() => {});
  }, [schedule, user, loaded]);

  useEffect(() => {
    if (!user || !loaded) return;
    syncEventsToCloud(events).catch(() => {});
  }, [events, user, loaded]);

  useEffect(() => {
    if (!user || !loaded) return;
    syncRoutinesToCloud(routines).catch(() => {});
  }, [routines, user, loaded]);

  useEffect(() => {
    if (!user || !settingsLoaded) return;
    syncSettingsToCloud(settings).catch(() => {});
  }, [settings, user, settingsLoaded]);

  // ── Handler ───────────────────────────────────────────────────────────────
  function openNewTemplate(preset?: string) {
    setPresetCode(preset); setEditTemplate(undefined); setShowNewTemplateModal(true);
  }

  function onSaveNewTemplate(data: { code: string; name: string; startTime: string; endTime: string; color: string }) {
    const success = saveNewTemplate(data);
    if (success) {
      setUnknownCodes((prev) => prev.filter((c) => c !== data.code.trim().toUpperCase()));
      setPresetCode(undefined); setEditTemplate(undefined); setShowNewTemplateModal(false);
    }
  }

  function onSaveRoutine(data: { name: string; appliesTo: ShiftCategory; steps: { title: string; offsetMinutes: number }[] }) {
    if (addRoutine(data)) setShowNewRoutineModal(false);
  }

  function onSaveEvent(data: Omit<CalendarEvent, "id">) {
    if (editEvent) deleteEvent(editEvent.id);
    addEvent(data);
    setShowEventModal(false);
    setEditEvent(undefined);
  }

  async function resetDemo() {
    Alert.alert("Zurücksetzen?", "Alle lokalen Daten werden zurückgesetzt.", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Zurücksetzen", style: "destructive", onPress: async () => {
        await resetStoredData();
        resetShiftData(); resetTasks(); resetSteps(); resetWaste(); resetRoutines(); resetEvents();
        Alert.alert("Erledigt", "Demo-Daten wurden neu geladen.");
      }},
    ]);
  }

  function handleOnboardingComplete(data: {
    name: string; shiftModel: UserProfile["shiftModel"]; state: string;
    zip: string; city: string; features: FeatureFlags; startTab: Tab; theme: AppTheme;
  }) {
    setProfile({ id: user?.id ?? `local-${Date.now()}`, name: data.name, shiftModel: data.shiftModel });
    setAddress({ street: "", houseNumber: "", zip: data.zip, city: data.city, country: "DE", state: data.state });
    setFeatures(data.features);
    setStartTab(data.startTab);
    setTheme(data.theme);
    setTab(data.startTab);
    completeOnboarding();
  }

  // ── Render-Logik ──────────────────────────────────────────────────────────

  // 1. Settings noch nicht geladen
  if (!settingsLoaded || authState === "loading") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#050b14", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#38bdf8", fontSize: 32, fontWeight: "900" }}>ShiftMind</Text>
      </SafeAreaView>
    );
  }

  // 2. Auth Screen (nicht eingeloggt UND Onboarding schon gemacht → zeige Login)
  if (authState === "unauthenticated" && settings.onboardingDone && !skippedAuth) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
        <StatusBar barStyle={settings.theme === "light" ? "dark-content" : "light-content"} />
        <AuthScreen
          t={t}
          onSignIn={signIn}
          onSignUp={signUp}
          onApple={signInWithApple}
          onReset={resetPassword}
          onSkip={() => {
            setSkippedAuth(true);
            setTab(settings.startTab ?? "home");
          }}
        />
      </SafeAreaView>
    );
  }

  // 3. Onboarding (allererster Start)
  if (!settings.onboardingDone) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
        <StatusBar barStyle={settings.theme === "light" ? "dark-content" : "light-content"} />
        <OnboardingScreen t={t} onComplete={handleOnboardingComplete} />
      </SafeAreaView>
    );
  }

  // 4. Haupt-App
  const displayName = settings.profile?.name ?? user?.email?.split("@")[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={settings.theme === "light" ? "dark-content" : "light-content"} backgroundColor={t.bg} />
      <View style={{ flex: 1, backgroundColor: t.bg }}>

        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 }}>
          <Text style={{ color: t.textPrimary, fontSize: 30, fontWeight: "900" }}>ShiftMind</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
            <Text style={{ color: t.textMuted, fontSize: 14 }}>
              {displayName ? `Hey ${displayName} 👋` : "Dienstplan, Alltag & ADHS-Struktur"}
            </Text>
            {syncing && (
              <View style={{ backgroundColor: t.accentMuted, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ color: t.accent, fontSize: 11, fontWeight: "800" }}>⟳ Sync</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {tab === "home" && (
            <HomeScreen assigned={assigned} templates={templates} tasks={tasks} wasteMap={currentWasteMap} t={t} />
          )}
          {tab === "tasks" && settings.features.tasksEnabled && (
            <TasksScreen tasks={tasks} t={t} onToggle={toggleTask} onDelete={deleteTask} />
          )}
          {tab === "month" && (
            <MonthScreen
              assignedMap={assignedMap} templateMap={templateMap} tasks={tasks}
              wasteMap={currentWasteMap} events={events} stateCode={stateCode}
              features={settings.features} t={t}
              onDayPress={(day) => { setSelectedDay(day); setShowDayModal(true); }}
              onImportPress={() => setShowImportModal(true)}
              onNewTemplatePress={() => openNewTemplate()}
              onWastePress={() => setShowWasteModal(true)}
            />
          )}
          {tab === "more" && (
            <MoreScreen
              templates={templates} routines={routines}
              currentTheme={settings.theme} startTab={settings.startTab}
              hapticsEnabled={settings.hapticsEnabled}
              features={settings.features} address={settings.address} t={t}
              user={user} syncing={syncing}
              onNewTemplatePress={() => openNewTemplate()}
              onEditTemplate={(tmpl) => { setEditTemplate(tmpl); setPresetCode(undefined); setShowNewTemplateModal(true); }}
              onDeleteTemplate={deleteTemplate}
              onNewRoutinePress={() => setShowNewRoutineModal(true)}
              onDeleteRoutine={deleteRoutine}
              onSetTheme={(theme: AppTheme) => setTheme(theme)}
              onSetStartTab={(newTab: Tab) => setStartTab(newTab)}
              onToggleHaptics={toggleHaptics}
              onToggleFeature={(key: keyof FeatureFlags) => toggleFeature(key)}
              onEditAddress={() => setShowAddressModal(true)}
              onSignOut={signOut}
              onReset={resetDemo}
            />
          )}
        </View>

        {/* Tab Bar */}
        <View style={{ flexDirection: "row", paddingHorizontal: 10, paddingTop: 8, paddingBottom: 12, borderTopWidth: 1, borderTopColor: t.border, backgroundColor: t.tabBar }}>
          <TabButton label="Home"     icon="home-variant"                  active={tab === "home"}   onPress={() => setTab("home")} />
          {settings.features.tasksEnabled && (
            <TabButton label="Aufgaben" icon="checkbox-marked-circle-outline" active={tab === "tasks"} onPress={() => setTab("tasks")} badge={openTaskCount} />
          )}
          <TabButton label="Monat"    icon="calendar-month"                 active={tab === "month"}  onPress={() => setTab("month")} />
          <TabButton label="Mehr"     icon="cog-outline"                    active={tab === "more"}   onPress={() => setTab("more")} />
        </View>

        {/* Modals */}
        <DayDetailModal
          visible={showDayModal} day={selectedDay} code={selectedCode}
          template={selectedTemplate} waste={selectedWaste} tasks={selectedTasks}
          routines={routines} completedSteps={completedSteps}
          onClose={() => setShowDayModal(false)}
          onChangeShift={() => setShowShiftModal(true)}
          onDefineUnknown={(code) => { setPresetCode(code); setEditTemplate(undefined); setShowNewTemplateModal(true); }}
          onAddTask={(text) => selectedDay && addTask(selectedDay, text)}
          onToggleTask={toggleTask} onDeleteTask={deleteTask}
          onToggleRoutineStep={toggleRoutineStep}
        />
        <ShiftSelectModal
          visible={showShiftModal} day={selectedDay} templates={templates}
          onSelect={(code) => { if (selectedDay) { assignShift(selectedDay, code); setShowShiftModal(false); } }}
          onNewTemplate={() => openNewTemplate()}
          onClose={() => setShowShiftModal(false)}
        />
        <NewTemplateModal
          visible={showNewTemplateModal} presetCode={presetCode} editTemplate={editTemplate} t={t}
          onSave={onSaveNewTemplate}
          onClose={() => { setPresetCode(undefined); setEditTemplate(undefined); setShowNewTemplateModal(false); }}
        />
        <ImportModal
          visible={showImportModal} unknownCodes={unknownCodes}
          onImport={(text) => setUnknownCodes(handleImport(text))}
          onDefineUnknown={(code) => { setPresetCode(code); setShowNewTemplateModal(true); }}
          onClose={() => setShowImportModal(false)}
        />
        <WasteScheduleModal
          visible={showWasteModal} schedule={schedule} t={t}
          onAdd={addScheduleEntry} onDelete={deleteScheduleEntry}
          onClose={() => setShowWasteModal(false)}
        />
        <NewRoutineModal
          visible={showNewRoutineModal} t={t}
          onSave={onSaveRoutine} onClose={() => setShowNewRoutineModal(false)}
        />
        <EventModal
          visible={showEventModal} day={selectedDay ?? 1} month={selectedMonth}
          t={t} editEvent={editEvent}
          onSave={onSaveEvent}
          onClose={() => { setShowEventModal(false); setEditEvent(undefined); }}
        />
        <AddressModal
          visible={showAddressModal} current={settings.address} t={t}
          onSave={(addr) => { setAddress(addr); setShowAddressModal(false); }}
          onClose={() => setShowAddressModal(false)}
        />
      </View>
    </SafeAreaView>
  );
}
