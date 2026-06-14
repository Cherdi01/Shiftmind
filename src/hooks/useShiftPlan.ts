import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { initialAssigned, initialTemplates } from "../data/defaults";
import { loadShiftMindData, saveAssigned, saveTemplates } from "../services/storage";
import { AssignedShift, ShiftTemplate } from "../types";
import { chooseColorForCode, detectCategory } from "../utils/shift";

export function useShiftPlan() {
  const [templates, setTemplates] = useState<ShiftTemplate[]>(initialTemplates);
  const [assigned, setAssigned] = useState<AssignedShift[]>(initialAssigned);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadShiftMindData()
      .then((data) => {
        if (data.templates) setTemplates(data.templates);
        if (data.assigned) setAssigned(data.assigned);
      })
      .catch(() => Alert.alert("Fehler", "Dienstdaten konnten nicht geladen werden."))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => { if (loaded) saveTemplates(templates); }, [templates, loaded]);
  useEffect(() => { if (loaded) saveAssigned(assigned); }, [assigned, loaded]);

  const assignedMap = useMemo(() => {
    const map: Record<number, string> = {};
    assigned.forEach((i) => { map[i.day] = i.code; });
    return map;
  }, [assigned]);

  const templateMap = useMemo(() => {
    const map: Record<string, ShiftTemplate> = {};
    templates.forEach((i) => { map[i.code.toUpperCase()] = i; });
    return map;
  }, [templates]);

  function assignShift(day: number, code: string) {
    setAssigned((prev) => {
      const without = prev.filter((i) => i.day !== day);
      if (!code) return without;
      return [...without, { day, code }];
    });
  }

  // Jetzt nimmt onSave auch color entgegen
  function saveNewTemplate(data: {
    code: string; name: string; startTime: string; endTime: string; color?: string;
  }): boolean {
    const cleanCode = data.code.trim().toUpperCase();
    if (!cleanCode || !data.startTime.trim() || !data.endTime.trim()) {
      Alert.alert("Fehlende Angaben", "Bitte Code, Startzeit und Endzeit eintragen.");
      return false;
    }
    const template: ShiftTemplate = {
      code: cleanCode,
      name: data.name.trim() || cleanCode,
      startTime: data.startTime.trim(),
      endTime: data.endTime.trim(),
      color: data.color ?? chooseColorForCode(cleanCode),
      category: detectCategory(cleanCode),
    };
    setTemplates((prev) => {
      const without = prev.filter((t) => t.code.toUpperCase() !== cleanCode);
      return [...without, template];
    });
    return true;
  }

  function deleteTemplate(code: string) {
    Alert.alert(
      "Diensttyp löschen",
      `"${code}" wirklich löschen?`,
      [
        { text: "Abbrechen", style: "cancel" },
        { text: "Löschen", style: "destructive",
          onPress: () => setTemplates((prev) => prev.filter((t) => t.code !== code)) },
      ]
    );
  }

  function handleImport(text: string): string[] {
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
      const importedDays = imported.map((i) => i.day);
      return [...prev.filter((i) => !importedDays.includes(i.day)), ...imported];
    });
    return [...new Set(unknown)];
  }

  function resetShiftData() {
    setTemplates(initialTemplates);
    setAssigned(initialAssigned);
  }

  return {
    templates, assigned, assignedMap, templateMap, loaded,
    assignShift, saveNewTemplate, deleteTemplate, handleImport, resetShiftData,
  };
}
