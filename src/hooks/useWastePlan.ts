import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { exampleWasteSchedule, getWasteMapForMonth } from "../services/wasteScheduleService";
import { loadShiftMindData, saveCompletedSteps, saveWasteSchedule } from "../services/storage";
import { CompletedRoutineStep, WasteScheduleEntry, WasteType, WasteWeekday } from "../types";

// ─── Routine Steps ────────────────────────────────────────────────────────────
export function useRoutineSteps(loaded: boolean) {
  const [completedSteps, setCompletedSteps] = useState<CompletedRoutineStep[]>([]);
  const [stepsLoaded, setStepsLoaded] = useState(false);

  useEffect(() => {
    loadShiftMindData()
      .then((data) => { if (data.completedSteps) setCompletedSteps(data.completedSteps); })
      .catch(() => Alert.alert("Fehler", "Routine-Daten konnten nicht geladen werden."))
      .finally(() => setStepsLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded && stepsLoaded) saveCompletedSteps(completedSteps);
  }, [completedSteps, loaded, stepsLoaded]);

  function toggleRoutineStep(day: number, stepId: string) {
    setCompletedSteps((prev) => {
      const existing = prev.find((i) => i.day === day && i.stepId === stepId);
      if (existing) {
        return prev.map((i) =>
          i.day === day && i.stepId === stepId ? { ...i, completed: !i.completed } : i
        );
      }
      return [...prev, { day, stepId, completed: true }];
    });
  }

  function resetSteps() { setCompletedSteps([]); }
  return { completedSteps, toggleRoutineStep, resetSteps };
}

// ─── Waste Schedule ───────────────────────────────────────────────────────────
export function useWastePlan(loaded: boolean) {
  const [schedule, setSchedule] = useState<WasteScheduleEntry[]>(exampleWasteSchedule);
  const [scheduleLoaded, setScheduleLoaded] = useState(false);

  useEffect(() => {
    loadShiftMindData()
      .then((data) => {
        if (data.wasteSchedule && data.wasteSchedule.length > 0) {
          setSchedule(data.wasteSchedule);
        }
      })
      .finally(() => setScheduleLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded && scheduleLoaded) saveWasteSchedule(schedule);
  }, [schedule, loaded, scheduleLoaded]);

  /** Berechnet waste für den aktuellen Monat (oder beliebigen) */
  function getWasteMap(year: number, month: number): Record<number, WasteType[]> {
    return getWasteMapForMonth(schedule, year, month);
  }

  function addScheduleEntry(entry: Omit<WasteScheduleEntry, "id">) {
    const id = `ws${Date.now()}`;
    setSchedule((prev) => [...prev, { ...entry, id }]);
  }

  function deleteScheduleEntry(id: string) {
    setSchedule((prev) => prev.filter((e) => e.id !== id));
  }

  function resetWaste() { setSchedule(exampleWasteSchedule); }

  return { schedule, getWasteMap, addScheduleEntry, deleteScheduleEntry, resetWaste };
}
