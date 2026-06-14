export type Tab = "home" | "tasks" | "month" | "more";

export type ShiftCategory =
  | "early" | "late" | "night" | "day" | "free" | "training" | "custom";

export type WasteType = "GREEN" | "BIO" | "BLACK" | "GLASS";

export type AppTheme = "dark" | "light" | "midnight";

export type WasteWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type WasteEntry = { id: string; day: number; type: WasteType; };

export type WasteScheduleEntry = {
  id: string;
  type: WasteType;
  weekday: WasteWeekday;
  frequency: "weekly" | "biweekly";
  referenceDate?: string;
  alternateType?: WasteType;
};

export type UserAddress = {
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  country: string;
  state?: string;
};

export type PublicHoliday = {
  date: string;
  name: string;
  scope: "national" | "regional";
};

export type SchoolHoliday = {
  name: string;
  start: string; // ISO "YYYY-MM-DD"
  end: string;
};

export type EventType = "appointment" | "birthday" | "reminder" | "custom";

export type CalendarEvent = {
  id: string;
  type: EventType;
  title: string;
  day: number;
  time?: string;
  birthYear?: number;
  recurring: boolean;
  month?: number;
  color?: string;
  note?: string;
};

export type ShiftTemplate = {
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
  category: ShiftCategory;
};

export type AssignedShift = { day: number; code: string; };

export type DayTask = { id: string; day: number; text: string; done: boolean; };

export type RoutineStep = { id: string; title: string; offsetMinutes: number; };

export type RoutineTemplate = {
  id: string;
  name: string;
  appliesTo: ShiftCategory;
  steps: RoutineStep[];
};

export type CompletedRoutineStep = { day: number; stepId: string; completed: boolean; };

// ─── Feature Flags ────────────────────────────────────────────────────────────
// Welche Features der User aktiv hat – konfigurierbar im Onboarding & Einstellungen
export type FeatureFlags = {
  wasteEnabled: boolean;       // Müllplan
  routinesEnabled: boolean;    // Routinen
  eventsEnabled: boolean;      // Termine & Geburtstage
  holidaysEnabled: boolean;    // Feiertage
  schoolHolidaysEnabled: boolean; // Schulferien
  tasksEnabled: boolean;       // Aufgaben-Tab
};

// ─── User Profile (Supabase-ready) ───────────────────────────────────────────
// Lokal gespeichert, später 1:1 in Supabase users-Tabelle gespiegelt
export type UserProfile = {
  /** Wird beim Supabase-Login auto-befüllt, lokal generiert bis dahin */
  id: string;
  name: string;
  /** Schichtmodell – bestimmt Onboarding-Standardvorlagen */
  shiftModel: "early-late-night" | "early-late" | "day-only" | "custom";
};

// ─── App Settings ─────────────────────────────────────────────────────────────
export type AppSettings = {
  theme: AppTheme;
  hapticsEnabled: boolean;
  address?: UserAddress;
  startTab: Tab;
  features: FeatureFlags;
  profile?: UserProfile;
  /** false = Onboarding noch nicht abgeschlossen */
  onboardingDone: boolean;
};
