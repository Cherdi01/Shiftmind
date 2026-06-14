/**
 * Müllplan-Service
 *
 * Heute: Berechnung aus wochentag-basiertem Plan (WasteScheduleEntry[])
 *
 * Vorbereitet für späteren automatischen Import:
 *   - Über Adresse Dienstleister-API anfragen (z.B. Abfallwirtschaft Mannheim)
 *   - Rückgabe in WasteScheduleEntry[] konvertieren
 *   - fetchWasteScheduleByAddress(address) durch echten API-Call ersetzen
 *
 * Aktuell: User trägt manuell ein "jeden Donnerstag Restmüll"
 * oder "jeden zweiten Dienstag wechselnd Grün/Schwarz"
 */

import { WasteScheduleEntry, WasteType } from "../types";

/**
 * Welche Tonnen werden an einem bestimmten Datum abgeholt?
 * @param scheduleEntries  Konfigurierter Müllplan
 * @param year             Jahr
 * @param month            Monat (0-indexed)
 * @param day              Tag (1-indexed)
 */
export function getWasteForDay(
  scheduleEntries: WasteScheduleEntry[],
  year: number,
  month: number,
  day: number
): WasteType[] {
  const date = new Date(year, month, day);
  // getDay(): 0=So, 1=Mo ... wir wollen 0=Mo
  const rawDay = date.getDay();
  const weekday = rawDay === 0 ? 6 : rawDay - 1;

  const result: WasteType[] = [];

  scheduleEntries.forEach((entry) => {
    if (entry.weekday !== weekday) return;

    if (entry.frequency === "weekly") {
      result.push(entry.type);
      return;
    }

    // Zweiwöchentlich: A/B-Woche über Referenzdatum bestimmen
    if (entry.frequency === "biweekly" && entry.referenceDate) {
      const ref = new Date(entry.referenceDate);
      const diffDays = Math.floor((date.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffDays / 7);
      const isWeekA = diffWeeks % 2 === 0;

      if (isWeekA) {
        result.push(entry.type);
      } else if (entry.alternateType) {
        result.push(entry.alternateType);
      }
    }
  });

  return result;
}

/**
 * Erstellt eine Map day→WasteType[] für einen ganzen Monat.
 */
export function getWasteMapForMonth(
  scheduleEntries: WasteScheduleEntry[],
  year: number,
  month: number
): Record<number, WasteType[]> {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const map: Record<number, WasteType[]> = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const types = getWasteForDay(scheduleEntries, year, month, day);
    if (types.length > 0) map[day] = types;
  }

  return map;
}

/**
 * PLATZHALTER für späteren API-Import.
 * Wird aufgerufen sobald eine Adresse gespeichert wird.
 * Gibt WasteScheduleEntry[] zurück (heute noch leer/manuell).
 *
 * TODO: echte API-Integration z.B.:
 *   - https://www.awm-muenchen.de/
 *   - Mannheimer Abfallwirtschaft API
 *   - oder generisch über https://www.meinabfallkalender.de/
 */
export async function fetchWasteScheduleByAddress(
  _street: string,
  _zip: string,
  _city: string
): Promise<WasteScheduleEntry[] | null> {
  // Noch nicht implementiert
  return null;
}

/** Standard-Beispielplan (wird beim ersten Start gezeigt) */
export const exampleWasteSchedule: WasteScheduleEntry[] = [
  {
    id: "ws1",
    type: "BLACK",
    alternateType: "GREEN",
    weekday: 3, // Donnerstag
    frequency: "biweekly",
    referenceDate: "2025-01-02", // erster Donnerstag 2025 = Woche A (Restmüll)
  },
  {
    id: "ws2",
    type: "BIO",
    weekday: 3, // Donnerstag
    frequency: "weekly",
  },
];
