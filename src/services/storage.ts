import AsyncStorage from "@react-native-async-storage/async-storage";
import { AssignedShift, DayTask, ShiftTemplate } from "../types";

const STORAGE_KEYS = {
  templates: "shiftmind_templates_v1",
  assigned: "shiftmind_assigned_v1",
  tasks: "shiftmind_tasks_v1",
};

export async function loadShiftMindData() {
  const [templatesRaw, assignedRaw, tasksRaw] = await Promise.all([
    AsyncStorage.getItem(STORAGE_KEYS.templates),
    AsyncStorage.getItem(STORAGE_KEYS.assigned),
    AsyncStorage.getItem(STORAGE_KEYS.tasks),
  ]);

  return {
    templates: templatesRaw ? (JSON.parse(templatesRaw) as ShiftTemplate[]) : null,
    assigned: assignedRaw ? (JSON.parse(assignedRaw) as AssignedShift[]) : null,
    tasks: tasksRaw ? (JSON.parse(tasksRaw) as DayTask[]) : null,
  };
}

export function saveTemplates(templates: ShiftTemplate[]) {
  return AsyncStorage.setItem(STORAGE_KEYS.templates, JSON.stringify(templates));
}

export function saveAssigned(assigned: AssignedShift[]) {
  return AsyncStorage.setItem(STORAGE_KEYS.assigned, JSON.stringify(assigned));
}

export function saveTasks(tasks: DayTask[]) {
  return AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

export function resetStoredData() {
  return AsyncStorage.multiRemove([
    STORAGE_KEYS.templates,
    STORAGE_KEYS.assigned,
    STORAGE_KEYS.tasks,
  ]);
}
