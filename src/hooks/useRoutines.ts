import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { initialRoutines } from "../data/defaults";
import { loadShiftMindData, saveRoutines } from "../services/storage";
import { RoutineStep, RoutineTemplate, ShiftCategory } from "../types";

export function useRoutines() {
  const [routines, setRoutines] = useState<RoutineTemplate[]>(initialRoutines);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadShiftMindData()
      .then((data) => { if (data.routines) setRoutines(data.routines); })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) saveRoutines(routines);
  }, [routines, loaded]);

  function addRoutine(data: {
    name: string;
    appliesTo: ShiftCategory;
    steps: Omit<RoutineStep, "id">[];
  }): boolean {
    if (!data.name.trim() || data.steps.length === 0) {
      Alert.alert("Fehlende Angaben", "Bitte Name und mindestens einen Schritt eintragen.");
      return false;
    }
    const routine: RoutineTemplate = {
      id: `custom-${Date.now()}`,
      name: data.name.trim(),
      appliesTo: data.appliesTo,
      steps: data.steps.map((s, i) => ({ ...s, id: `s-${Date.now()}-${i}` })),
    };
    // Pro Kategorie nur eine Routine – bestehende ersetzen
    setRoutines((prev) => {
      const without = prev.filter((r) => r.appliesTo !== data.appliesTo);
      return [...without, routine];
    });
    return true;
  }

  function deleteRoutine(id: string) {
    Alert.alert("Routine löschen?", "Diese Routine wird dauerhaft entfernt.", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Löschen", style: "destructive", onPress: () =>
          setRoutines((prev) => prev.filter((r) => r.id !== id))
      },
    ]);
  }

  function resetRoutines() {
    setRoutines(initialRoutines);
  }

  return { routines, addRoutine, deleteRoutine, resetRoutines };
}
