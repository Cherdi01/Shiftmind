import { AssignedShift, DayTask, RoutineTemplate, ShiftTemplate, WasteType } from "../types";

export const initialTemplates: ShiftTemplate[] = [
  { code: "F12", name: "Frühdienst kurz", startTime: "07:00", endTime: "14:00", color: "#67e8f9", category: "early" },
  { code: "F13", name: "Frühdienst mittel", startTime: "07:00", endTime: "15:30", color: "#22d3ee", category: "early" },
  { code: "F14", name: "Frühdienst lang", startTime: "07:00", endTime: "16:00", color: "#06b6d4", category: "early" },
  { code: "S3", name: "Spätdienst kurz", startTime: "13:30", endTime: "20:00", color: "#fbbf24", category: "late" },
  { code: "S4", name: "Spätdienst lang", startTime: "13:30", endTime: "22:00", color: "#f59e0b", category: "late" },
  { code: "S8", name: "Spätdienst spät", startTime: "15:30", endTime: "22:00", color: "#f97316", category: "late" },
  { code: "N3", name: "Nachtdienst", startTime: "21:45", endTime: "07:15", color: "#a78bfa", category: "night" },
  { code: "T9", name: "Tagdienst", startTime: "09:00", endTime: "17:30", color: "#34d399", category: "day" },
  { code: "T14", name: "Tagdienst spät", startTime: "11:30", endTime: "20:00", color: "#10b981", category: "day" },
  { code: "IBF", name: "Fortbildung", startTime: "08:00", endTime: "16:00", color: "#fb7185", category: "training" },
  { code: "FREI", name: "Frei", startTime: "--:--", endTime: "--:--", color: "#64748b", category: "free" },
];

export const initialAssigned: AssignedShift[] = [
  { day: 1, code: "F12" },
  { day: 2, code: "F13" },
  { day: 4, code: "S4" },
  { day: 7, code: "N3" },
  { day: 11, code: "F14" },
  { day: 15, code: "S8" },
  { day: 18, code: "N3" },
  { day: 21, code: "F12" },
];

export const initialTasks: DayTask[] = [
  { id: "1", day: 3, text: "Müll rausstellen", done: false },
  { id: "2", day: 4, text: "Einkaufen", done: false },
  { id: "3", day: 7, text: "Vor Nachtdienst vorkochen", done: false },
];

export const waste: Record<number, WasteType[]> = {
  3: ["GREEN"],
  6: ["BIO"],
  10: ["BLACK"],
  14: ["GLASS"],
  17: ["BIO"],
  22: ["GREEN"],
  26: ["BLACK"],
};

export const days = Array.from({ length: 30 }, (_, i) => i + 1);

export const initialRoutines: RoutineTemplate[] = [
  {
    id: "early-basic",
    name: "Frühdienst Routine",
    appliesTo: "early",
    steps: [
      { id: "early-1", title: "Aufstehen", offsetMinutes: -75 },
      { id: "early-2", title: "Medikamente / Trinken", offsetMinutes: -65 },
      { id: "early-3", title: "Frühstück", offsetMinutes: -50 },
      { id: "early-4", title: "Zähne putzen", offsetMinutes: -30 },
      { id: "early-5", title: "Losfahren", offsetMinutes: -20 },
    ],
  },
  {
    id: "late-basic",
    name: "Spätdienst Routine",
    appliesTo: "late",
    steps: [
      { id: "late-1", title: "Aufstehen ohne Stress", offsetMinutes: -210 },
      { id: "late-2", title: "Essen vorbereiten", offsetMinutes: -160 },
      { id: "late-3", title: "Duschen", offsetMinutes: -100 },
      { id: "late-4", title: "Tasche prüfen", offsetMinutes: -45 },
      { id: "late-5", title: "Losfahren", offsetMinutes: -25 },
    ],
  },
  {
    id: "night-basic",
    name: "Nachtdienst Routine",
    appliesTo: "night",
    steps: [
      { id: "night-1", title: "Aufstehen", offsetMinutes: -520 },
      { id: "night-2", title: "Hauptmahlzeit", offsetMinutes: -300 },
      { id: "night-3", title: "Powernap / Ruhephase", offsetMinutes: -180 },
      { id: "night-4", title: "Duschen", offsetMinutes: -80 },
      { id: "night-5", title: "Losfahren", offsetMinutes: -25 },
    ],
  },
];
