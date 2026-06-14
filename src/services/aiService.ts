/**
 * AI Service – alle KI-Anfragen über Supabase Edge Function
 *
 * Wechsel zu anderem Modell: nur EDGE_FUNCTION_URL ändern
 * oder in der Edge Function das Modell tauschen.
 */

import { supabase } from "../lib/supabase";
import { AssignedShift, RoutineTemplate, ShiftTemplate } from "../types";

const EDGE_FUNCTION = "ai-proxy";

async function callAI(feature: string, payload: object): Promise<any> {
  const { data, error } = await supabase.functions.invoke(EDGE_FUNCTION, {
    body: { feature, payload },
  });
  if (error) throw new Error(error.message);
  if (!data.success) throw new Error(data.error);
  return data.data;
}

// ─── Freitext → Dienste ──────────────────────────────────────────────────────

export async function parseShiftText(
  text: string,
  knownCodes: string[]
): Promise<AssignedShift[]> {
  const result = await callAI("parse_shift_text", { text, knownCodes });
  if (Array.isArray(result)) return result as AssignedShift[];
  throw new Error("Ungültige Antwort vom KI-Service");
}

// ─── Foto → Dienste ──────────────────────────────────────────────────────────

export async function parseShiftImage(
  imageBase64: string,
  mimeType: string,
  knownCodes: string[]
): Promise<AssignedShift[]> {
  const result = await callAI("parse_shift_image", {
    imageBase64, mimeType, knownCodes,
  });
  if (Array.isArray(result)) return result as AssignedShift[];
  throw new Error("Ungültige Antwort vom KI-Service");
}

// ─── Routine generieren ───────────────────────────────────────────────────────

export async function generateRoutine(
  shiftCategory: string,
  startTime: string,
  userName?: string
): Promise<{ name: string; steps: { title: string; offsetMinutes: number }[] }> {
  return callAI("generate_routine", { shiftCategory, startTime, userName });
}

// ─── Aufgaben vorschlagen ─────────────────────────────────────────────────────

export async function suggestTasks(
  shiftCode: string,
  shiftCategory: string,
  day: number,
  existingTasks: string[]
): Promise<string[]> {
  const result = await callAI("suggest_tasks", {
    shiftCode, shiftCategory, day, existingTasks,
  });
  return result.tasks ?? [];
}

// ─── Natürlichsprachige Abfrage ───────────────────────────────────────────────

export async function naturalQuery(
  query: string,
  shifts: AssignedShift[],
  month: number,
  year: number
): Promise<string> {
  const result = await callAI("natural_query", { query, shifts, month, year });
  return result.text ?? result;
}

// ─── Monatsanalyse ────────────────────────────────────────────────────────────

export async function analyzeMonth(
  shifts: AssignedShift[],
  templates: ShiftTemplate[],
  month: number,
  year: number,
  userName?: string
): Promise<{ analysis: string; highlight: string }> {
  return callAI("analyze_month", { shifts, templates, month, year, userName });
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function chatWithAI(
  message: string,
  history: ChatMessage[],
  context?: {
    upcomingShifts?: AssignedShift[];
    openTaskCount?: number;
    userName?: string;
  }
): Promise<string> {
  const result = await callAI("chat", { message, history, context });
  return result.text ?? "";
}
