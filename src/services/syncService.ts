/**
 * SyncService – lokale Daten ↔ Supabase
 *
 * Strategie: "Last-Write-Wins" mit updated_at Timestamp
 * - Beim Login: Remote-Daten laden und lokal cachen
 * - Bei jeder Änderung: sofort in Supabase schreiben + lokal speichern
 * - Offline: nur lokal, bei nächstem Online-Moment sync
 */

import { supabase } from "../lib/supabase";
import {
  AssignedShift, CalendarEvent, RoutineTemplate,
  ShiftTemplate, WasteScheduleEntry,
} from "../types";

// ─── Helper ──────────────────────────────────────────────────────────────────

function getUserId(): string | null {
  // Synchroner Zugriff auf die aktuelle Session
  return supabase.auth.getUser().then(({ data }) => data.user?.id ?? null) as any;
}

async function uid(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function syncSettingsToCloud(settings: object) {
  const userId = await uid();
  if (!userId) return;
  await supabase.from("user_settings").upsert({
    user_id: userId,
    theme: (settings as any).theme,
    haptics: (settings as any).hapticsEnabled,
    start_tab: (settings as any).startTab,
    features: (settings as any).features,
    address: (settings as any).address,
    updated_at: new Date().toISOString(),
  });
}

export async function loadSettingsFromCloud(): Promise<object | null> {
  const userId = await uid();
  if (!userId) return null;
  const { data } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (!data) return null;
  return {
    theme: data.theme,
    hapticsEnabled: data.haptics,
    startTab: data.start_tab,
    features: data.features ?? {},
    address: data.address,
  };
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function syncProfileToCloud(name: string, shiftModel: string) {
  const userId = await uid();
  if (!userId) return;
  await supabase.from("profiles").upsert({
    id: userId, name, shift_model: shiftModel,
    updated_at: new Date().toISOString(),
  });
}

export async function loadProfileFromCloud() {
  const userId = await uid();
  if (!userId) return null;
  const { data } = await supabase
    .from("profiles").select("*").eq("id", userId).single();
  return data;
}

// ─── Shift Templates ─────────────────────────────────────────────────────────

export async function syncTemplatesToCloud(templates: ShiftTemplate[]) {
  const userId = await uid();
  if (!userId) return;
  // Alle bestehenden löschen und neu einfügen (einfachste Strategie bei kleinen Datenmengen)
  await supabase.from("shift_templates").delete().eq("user_id", userId);
  if (templates.length === 0) return;
  await supabase.from("shift_templates").insert(
    templates.map((t) => ({
      user_id: userId,
      code: t.code,
      name: t.name,
      start_time: t.startTime,
      end_time: t.endTime,
      color: t.color,
      category: t.category,
      updated_at: new Date().toISOString(),
    }))
  );
}

export async function loadTemplatesFromCloud(): Promise<ShiftTemplate[]> {
  const userId = await uid();
  if (!userId) return [];
  const { data } = await supabase
    .from("shift_templates").select("*").eq("user_id", userId);
  return (data ?? []).map((r) => ({
    code: r.code, name: r.name,
    startTime: r.start_time, endTime: r.end_time,
    color: r.color, category: r.category,
  }));
}

// ─── Assigned Shifts ─────────────────────────────────────────────────────────

export async function syncAssignedToCloud(
  assigned: AssignedShift[],
  year: number,
  month: number
) {
  const userId = await uid();
  if (!userId) return;
  // Nur den aktuellen Monat sync (assigned sind monatsbezogen)
  await supabase.from("assigned_shifts")
    .delete().eq("user_id", userId).eq("year", year).eq("month", month);
  if (assigned.length === 0) return;
  await supabase.from("assigned_shifts").insert(
    assigned.map((a) => ({
      user_id: userId, day: a.day, month, year,
      code: a.code, updated_at: new Date().toISOString(),
    }))
  );
}

export async function loadAssignedFromCloud(
  year: number,
  month: number
): Promise<AssignedShift[]> {
  const userId = await uid();
  if (!userId) return [];
  const { data } = await supabase
    .from("assigned_shifts").select("*")
    .eq("user_id", userId).eq("year", year).eq("month", month);
  return (data ?? []).map((r) => ({ day: r.day, code: r.code }));
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function syncTaskToCloud(task: {
  id: string; day: number; month: number; year: number; text: string; done: boolean;
}) {
  const userId = await uid();
  if (!userId) return;
  await supabase.from("tasks").upsert({
    id: task.id, user_id: userId,
    day: task.day, month: task.month, year: task.year,
    text: task.text, done: task.done,
    updated_at: new Date().toISOString(),
  });
}

export async function deleteTaskFromCloud(id: string) {
  await supabase.from("tasks").delete().eq("id", id);
}

export async function loadTasksFromCloud(
  year: number,
  month: number
): Promise<{ id: string; day: number; text: string; done: boolean }[]> {
  const userId = await uid();
  if (!userId) return [];
  const { data } = await supabase
    .from("tasks").select("*")
    .eq("user_id", userId).eq("year", year).eq("month", month);
  return (data ?? []).map((r) => ({ id: r.id, day: r.day, text: r.text, done: r.done }));
}

// ─── Waste Schedule ───────────────────────────────────────────────────────────

export async function syncWasteScheduleToCloud(schedule: WasteScheduleEntry[]) {
  const userId = await uid();
  if (!userId) return;
  await supabase.from("waste_schedule").delete().eq("user_id", userId);
  if (schedule.length === 0) return;
  await supabase.from("waste_schedule").insert(
    schedule.map((e) => ({
      id: e.id, user_id: userId,
      type: e.type, weekday: e.weekday,
      frequency: e.frequency,
      reference_date: e.referenceDate,
      alternate_type: e.alternateType,
      updated_at: new Date().toISOString(),
    }))
  );
}

export async function loadWasteScheduleFromCloud(): Promise<WasteScheduleEntry[]> {
  const userId = await uid();
  if (!userId) return [];
  const { data } = await supabase
    .from("waste_schedule").select("*").eq("user_id", userId);
  return (data ?? []).map((r) => ({
    id: r.id, type: r.type, weekday: r.weekday,
    frequency: r.frequency,
    referenceDate: r.reference_date,
    alternateType: r.alternate_type,
  }));
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function syncEventsToCloud(events: CalendarEvent[]) {
  const userId = await uid();
  if (!userId) return;
  await supabase.from("calendar_events").delete().eq("user_id", userId);
  if (events.length === 0) return;
  await supabase.from("calendar_events").insert(
    events.map((e) => ({
      id: e.id, user_id: userId,
      type: e.type, title: e.title,
      day: e.day, month: e.month,
      time: e.time, birth_year: e.birthYear,
      recurring: e.recurring, color: e.color, note: e.note,
      updated_at: new Date().toISOString(),
    }))
  );
}

export async function loadEventsFromCloud(): Promise<CalendarEvent[]> {
  const userId = await uid();
  if (!userId) return [];
  const { data } = await supabase
    .from("calendar_events").select("*").eq("user_id", userId);
  return (data ?? []).map((r) => ({
    id: r.id, type: r.type, title: r.title,
    day: r.day, month: r.month,
    time: r.time, birthYear: r.birth_year,
    recurring: r.recurring, color: r.color, note: r.note,
  }));
}

// ─── Routines ────────────────────────────────────────────────────────────────

export async function syncRoutinesToCloud(routines: RoutineTemplate[]) {
  const userId = await uid();
  if (!userId) return;
  await supabase.from("routines").delete().eq("user_id", userId);
  if (routines.length === 0) return;
  await supabase.from("routines").insert(
    routines.map((r) => ({
      id: r.id, user_id: userId,
      name: r.name, applies_to: r.appliesTo,
      steps: r.steps,
      updated_at: new Date().toISOString(),
    }))
  );
}

export async function loadRoutinesFromCloud(): Promise<RoutineTemplate[]> {
  const userId = await uid();
  if (!userId) return [];
  const { data } = await supabase
    .from("routines").select("*").eq("user_id", userId);
  return (data ?? []).map((r) => ({
    id: r.id, name: r.name,
    appliesTo: r.applies_to, steps: r.steps,
  }));
}

// ─── Full initial sync after login ───────────────────────────────────────────

export async function loadAllFromCloud() {
  const [templates, wasteSchedule, events, routines, settings, profile] =
    await Promise.all([
      loadTemplatesFromCloud(),
      loadWasteScheduleFromCloud(),
      loadEventsFromCloud(),
      loadRoutinesFromCloud(),
      loadSettingsFromCloud(),
      loadProfileFromCloud(),
    ]);
  return { templates, wasteSchedule, events, routines, settings, profile };
}
