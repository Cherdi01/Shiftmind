import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AppSettings, AssignedShift, CalendarEvent, CompletedRoutineStep,
  DayTask, RoutineTemplate, ShiftTemplate, WasteEntry, WasteScheduleEntry,
} from "../types";

const STORAGE_KEYS = {
  templates:       "shiftmind_templates_v1",
  assigned:        "shiftmind_assigned_v1",
  tasks:           "shiftmind_tasks_v1",
  completedSteps:  "shiftmind_completed_steps_v1",
  wasteEntries:    "shiftmind_waste_entries_v1",
  wasteSchedule:   "shiftmind_waste_schedule_v1",
  routines:        "shiftmind_routines_v1",
  settings:        "shiftmind_settings_v1",
  events:          "shiftmind_events_v1",
};

export async function loadShiftMindData() {
  const vals = await Promise.all(Object.values(STORAGE_KEYS).map((k) => AsyncStorage.getItem(k)));
  const [templates, assigned, tasks, completedSteps, wasteEntries, wasteSchedule, routines, settings, events] = vals;
  return {
    templates:      templates      ? JSON.parse(templates)      as ShiftTemplate[]        : null,
    assigned:       assigned       ? JSON.parse(assigned)       as AssignedShift[]         : null,
    tasks:          tasks          ? JSON.parse(tasks)          as DayTask[]               : null,
    completedSteps: completedSteps ? JSON.parse(completedSteps) as CompletedRoutineStep[]  : null,
    wasteEntries:   wasteEntries   ? JSON.parse(wasteEntries)   as WasteEntry[]            : null,
    wasteSchedule:  wasteSchedule  ? JSON.parse(wasteSchedule)  as WasteScheduleEntry[]    : null,
    routines:       routines       ? JSON.parse(routines)       as RoutineTemplate[]       : null,
    settings:       settings       ? JSON.parse(settings)       as AppSettings             : null,
    events:         events         ? JSON.parse(events)         as CalendarEvent[]         : null,
  };
}

export const saveTemplates      = (v: ShiftTemplate[])        => AsyncStorage.setItem(STORAGE_KEYS.templates,      JSON.stringify(v));
export const saveAssigned       = (v: AssignedShift[])        => AsyncStorage.setItem(STORAGE_KEYS.assigned,       JSON.stringify(v));
export const saveTasks          = (v: DayTask[])              => AsyncStorage.setItem(STORAGE_KEYS.tasks,          JSON.stringify(v));
export const saveCompletedSteps = (v: CompletedRoutineStep[]) => AsyncStorage.setItem(STORAGE_KEYS.completedSteps, JSON.stringify(v));
export const saveWasteEntries   = (v: WasteEntry[])           => AsyncStorage.setItem(STORAGE_KEYS.wasteEntries,   JSON.stringify(v));
export const saveWasteSchedule  = (v: WasteScheduleEntry[])   => AsyncStorage.setItem(STORAGE_KEYS.wasteSchedule,  JSON.stringify(v));
export const saveRoutines       = (v: RoutineTemplate[])      => AsyncStorage.setItem(STORAGE_KEYS.routines,       JSON.stringify(v));
export const saveSettings       = (v: AppSettings)            => AsyncStorage.setItem(STORAGE_KEYS.settings,       JSON.stringify(v));
export const saveEvents         = (v: CalendarEvent[])        => AsyncStorage.setItem(STORAGE_KEYS.events,         JSON.stringify(v));

export const resetStoredData = () => AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
