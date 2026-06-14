import React, { useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, Text, View } from "react-native";
import { DayDetailModal } from "./src/components/DayDetailModal";
import { ImportModal } from "./src/components/ImportModal";
import { NewTemplateModal } from "./src/components/NewTemplateModal";
import { ShiftSelectModal } from "./src/components/ShiftSelectModal";
import { TabButton } from "./src/components/TabButton";
import { styles } from "./src/components/styles";
import { initialAssigned, initialRoutines, initialTasks, initialTemplates, waste } from "./src/data/defaults";
import { HomeScreen } from "./src/screens/HomeScreen";
import { MonthScreen } from "./src/screens/MonthScreen";
import { MoreScreen } from "./src/screens/MoreScreen";
import { TasksScreen } from "./src/screens/TasksScreen";
import { loadShiftMindData, resetStoredData, saveAssigned, saveTasks, saveTemplates } from "./src/services/storage";
import {
  AssignedShift,
  CompletedRoutineStep,
  DayTask,
  RoutineTemplate,
  ShiftTemplate,
  Tab,
} from "./src/types";
import { chooseColorForCode, detectCategory } from "./src/utils/shift";

export default function App() {
  const [tab, setTab] = useState<Tab>("month");
  const [templates, setTemplates] = useState<ShiftTemplate[]>(initialTemplates);
  const [assigned, setAssigned] = useState<AssignedShift[]>(initialAssigned);
  const [tasks, setTasks] = useState<DayTask[]>(initialTasks);
  const [routines] = useState<RoutineTemplate[]>(initialRoutines);
  
  const [completedSteps, setCompletedSteps] = useState<CompletedRoutineStep[]>([]);

  const [loaded, setLoaded] = useState(false);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [presetCode, setPresetCode] = useState<string | undefined>(undefined);
  const [unknownCodes, setUnknownCodes] = useState<string[]>([]);

  useEffect(() => {
    async function boot() {
      try {
        const data = await loadShiftMindData();
        if (data.templates) setTemplates(data.templates);
        if (data.assigned) setAssigned(data.assigned);
        if (data.tasks) setTasks(data.tasks);
      } catch {
        Alert.alert("Speicherfehler", "Lokale Daten konnten nicht geladen werden.");
      } finally {
        setLoaded(true);
      }
    }
    boot();
  }, []);

  useEffect(() => {
    if (loaded) saveTemplates(templates);
  }, [templates, loaded]);

  useEffect(() => {
    if (loaded) saveAssigned(assigned);
  }, [assigned, loaded]);

  useEffect(() => {
    if (loaded) saveTasks(tasks);
  }, [tasks, loaded]);

  const assignedMap = useMemo(() => {
    const map: Record<number, string> = {};
    assigned.forEach((item) => {
      map[item.day] = item.code;
    });
    return map;
  }, [assigned]);

  const templateMap = useMemo(() => {
    const map: Record<string, ShiftTemplate> = {};
    templates.forEach((item) => {
      map[item.code.toUpperCase()] = item;
    });
    return map;
  }, [templates]);

  const selectedCode = selectedDay ? assignedMap[selectedDay] : undefined;
  const selectedTemplate = selectedCode ? templateMap[selectedCode.toUpperCase()] : undefined;
  const selectedTasks = selectedDay ? tasks.filter((task) => task.day === selectedDay) : [];
  const selectedWaste = selectedDay ? waste[selectedDay] || [] : [];

  function openDay(day: number) {
    setSelectedDay(day);
    setShowDayModal(true);
  }

  function assignShift(code: string) {
    if (!selectedDay) return;
    setAssigned((prev) => {
      const withoutDay = prev.filter((item) => item.day !== selectedDay);
      if (!code) return withoutDay;
      return [...withoutDay, { day: selectedDay, code }];
    });
    setShowShiftModal(false);
  }

  function saveNewTemplate(data: { code: string; name: string; startTime: string; endTime: string }) {
    const cleanCode = data.code.trim().toUpperCase();
    if (!cleanCode || !data.startTime.trim() || !data.endTime.trim()) {
      Alert.alert("Fehlende Angaben", "Bitte Code, Startzeit und Endzeit eintragen.");
      return;
    }

    const template: ShiftTemplate = {
      code: cleanCode,
      name: data.name.trim() || cleanCode,
      startTime: data.startTime.trim(),
      endTime: data.endTime.trim(),
      color: chooseColorForCode(cleanCode),
      category: detectCategory(cleanCode),
    };

    setTemplates((prev) => {
      const withoutOld = prev.filter((item) => item.code.toUpperCase() !== cleanCode);
      return [...withoutOld, template];
    });

    setUnknownCodes((prev) => prev.filter((code) => code !== cleanCode));
    setPresetCode(undefined);
    setShowNewTemplateModal(false);
  }

  function handleImport(text: string) {
    const lines = text.split("\n");
    const imported: AssignedShift[] = [];
    const unknown: string[] = [];

    lines.forEach((line) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 2) return;
      const day = Number(parts[0]);
      const code = parts[1].toUpperCase();
      if (!day || day < 1 || day > 31) return;
      imported.push({ day, code });
      if (!templateMap[code]) unknown.push(code);
    });

    setAssigned((prev) => {
      const importedDays = imported.map((item) => item.day);
      const withoutImportedDays = prev.filter((item) => !importedDays.includes(item.day));
      return [...withoutImportedDays, ...imported];
    });

    setUnknownCodes([...new Set(unknown)]);
  }

  function openUnknownCode(code: string) {
    setPresetCode(code);
    setShowNewTemplateModal(true);
  }

  function addTask(text: string) {
    if (!selectedDay) return;
    const task: DayTask = {
      id: String(Date.now()),
      day: selectedDay,
      text,
      done: false,
    };
    setTasks((prev) => [...prev, task]);
  }

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function toggleRoutineStep(day: number, stepId: string) {
    setCompletedSteps((prev) => {
      const existing = prev.find(
        (item) => item.day === day && item.stepId === stepId
      );
  
      if (existing) {
        return prev.map((item) =>
          item.day === day && item.stepId === stepId
            ? { ...item, completed: !item.completed }
            : item
        );
      }
  
      return [
        ...prev,
        {
          day,
          stepId,
          completed: true,
        },
      ];
    });
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  async function resetDemo() {
    await resetStoredData();
    setTemplates(initialTemplates);
    setAssigned(initialAssigned);
    setTasks(initialTasks);
    Alert.alert("Zurückgesetzt", "Demo-Daten wurden neu geladen.");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.app}>
        <View style={styles.header}>
          <Text style={styles.logo}>ShiftMind</Text>
          <Text style={styles.sub}>Dienstplan, Alltag & ADHS-Struktur</Text>
        </View>

        <View style={styles.content}>
          {tab === "home" && <HomeScreen assigned={assigned} templates={templates} tasks={tasks} />}
          {tab === "tasks" && <TasksScreen tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />}
          {tab === "month" && (
            <MonthScreen
              assignedMap={assignedMap}
              templateMap={templateMap}
              tasks={tasks}
              onDayPress={openDay}
              onImportPress={() => setShowImportModal(true)}
              onNewTemplatePress={() => {
                setPresetCode(undefined);
                setShowNewTemplateModal(true);
              }}
            />
          )}
          {tab === "more" && (
           <MoreScreen
  		templates={templates}
  		routines={routines}
              onNewTemplatePress={() => {
                setPresetCode(undefined);
                setShowNewTemplateModal(true);
              }}
              onReset={resetDemo}
            />
          )}
        </View>

        <View style={styles.tabs}>
          <TabButton label="Home" icon="home-variant" active={tab === "home"} onPress={() => setTab("home")} />
          <TabButton label="Aufgaben" icon="checkbox-marked-circle-outline" active={tab === "tasks"} onPress={() => setTab("tasks")} />
          <TabButton label="Monat" icon="calendar-month" active={tab === "month"} onPress={() => setTab("month")} />
          <TabButton label="Mehr" icon="cog-outline" active={tab === "more"} onPress={() => setTab("more")} />
        </View>

        <DayDetailModal

          visible={showDayModal}
          day={selectedDay}
          code={selectedCode}
          template={selectedTemplate}
          waste={selectedWaste}
          tasks={selectedTasks}
          onClose={() => setShowDayModal(false)}
          onChangeShift={() => setShowShiftModal(true)}
          onDefineUnknown={openUnknownCode}
          onAddTask={addTask}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
	        routines={routines}
          completedSteps={completedSteps}
          onToggleRoutineStep={toggleRoutineStep}
        />

        <ShiftSelectModal
          visible={showShiftModal}
          day={selectedDay}
          templates={templates}
          onSelect={assignShift}
          onNewTemplate={() => {
            setPresetCode(undefined);
            setShowNewTemplateModal(true);
          }}
          onClose={() => setShowShiftModal(false)}
        />

        <NewTemplateModal
          visible={showNewTemplateModal}
          presetCode={presetCode}
          onSave={saveNewTemplate}
          onClose={() => {
            setPresetCode(undefined);
            setShowNewTemplateModal(false);
          }}
        />

        <ImportModal
          visible={showImportModal}
          unknownCodes={unknownCodes}
          onImport={handleImport}
          onDefineUnknown={openUnknownCode}
          onClose={() => setShowImportModal(false)}
        />
      </View>
    </SafeAreaView>
  );
}
