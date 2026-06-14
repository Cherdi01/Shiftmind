export type Tab = "home" | "tasks" | "month" | "more";

export type ShiftCategory =
  | "early"
  | "late"
  | "night"
  | "day"
  | "free"
  | "training"
  | "custom";

export type WasteType = "GREEN" | "BIO" | "BLACK" | "GLASS";

export type ShiftTemplate = {
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
  category: ShiftCategory;
};

export type AssignedShift = {
  day: number;
  code: string;
};

export type DayTask = {
  id: string;
  day: number;
  text: string;
  done: boolean;
};
export type RoutineStep = {
  id: string;
  title: string;
  offsetMinutes: number;
};

export type RoutineTemplate = {
  id: string;
  name: string;
  appliesTo: ShiftCategory;
  steps: RoutineStep[];
};

export type CompletedRoutineStep = {
  day: number;
  stepId: string;
  completed: boolean;
};
