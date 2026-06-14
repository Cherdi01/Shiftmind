/**
 * Schulferien-Service
 *
 * Heute: statische Daten für 2025 & 2026 pro Bundesland.
 *
 * Vorbereitet für API:
 *   https://ferien-api.de/api/v1/holidays/{state}/{year}
 *   → fetchSchoolHolidays(stateCode, year) durch echten Fetch ersetzen,
 *     Rückgabe als SchoolHoliday[] mit { name, start, end }
 *
 * Aufrufen: getSchoolHolidayMap(year, month, stateCode)
 * Rückgabe: Record<number, string>  →  Tag → Ferienname
 */

import { SchoolHoliday } from "../types";

// Statische Daten 2025+2026 für die häufigsten Bundesländer
// Quelle: Kultusministerkonferenz (KMK)
const SCHOOL_HOLIDAYS: Record<string, SchoolHoliday[]> = {
  BW: [
    // 2025
    { name: "Osterferien",      start: "2025-04-14", end: "2025-04-25" },
    { name: "Pfingstferien",    start: "2025-06-10", end: "2025-06-20" },
    { name: "Sommerferien",     start: "2025-07-31", end: "2025-09-13" },
    { name: "Herbstferien",     start: "2025-10-27", end: "2025-10-31" },
    { name: "Weihnachtsferien", start: "2025-12-22", end: "2026-01-05" },
    // 2026
    { name: "Osterferien",      start: "2026-03-30", end: "2026-04-10" },
    { name: "Pfingstferien",    start: "2026-06-02", end: "2026-06-12" },
    { name: "Sommerferien",     start: "2026-07-30", end: "2026-09-12" },
    { name: "Herbstferien",     start: "2026-10-26", end: "2026-10-30" },
    { name: "Weihnachtsferien", start: "2026-12-23", end: "2027-01-08" },
  ],
  BY: [
    { name: "Osterferien",      start: "2025-04-14", end: "2025-04-25" },
    { name: "Pfingstferien",    start: "2025-06-07", end: "2025-06-07" },
    { name: "Sommerferien",     start: "2025-07-28", end: "2025-09-08" },
    { name: "Herbstferien",     start: "2025-10-27", end: "2025-10-31" },
    { name: "Weihnachtsferien", start: "2025-12-24", end: "2026-01-05" },
    { name: "Osterferien",      start: "2026-03-30", end: "2026-04-09" },
    { name: "Sommerferien",     start: "2026-07-27", end: "2026-09-07" },
    { name: "Herbstferien",     start: "2026-10-26", end: "2026-10-30" },
    { name: "Weihnachtsferien", start: "2026-12-24", end: "2027-01-08" },
  ],
  NW: [
    { name: "Osterferien",      start: "2025-04-14", end: "2025-04-26" },
    { name: "Sommerferien",     start: "2025-06-23", end: "2025-08-05" },
    { name: "Herbstferien",     start: "2025-10-13", end: "2025-10-25" },
    { name: "Weihnachtsferien", start: "2025-12-22", end: "2026-01-06" },
    { name: "Osterferien",      start: "2026-03-23", end: "2026-04-04" },
    { name: "Sommerferien",     start: "2026-06-22", end: "2026-08-04" },
    { name: "Herbstferien",     start: "2026-10-12", end: "2026-10-24" },
    { name: "Weihnachtsferien", start: "2026-12-23", end: "2027-01-05" },
  ],
  BE: [
    { name: "Osterferien",      start: "2025-04-14", end: "2025-04-25" },
    { name: "Sommerferien",     start: "2025-06-26", end: "2025-08-08" },
    { name: "Herbstferien",     start: "2025-10-20", end: "2025-11-01" },
    { name: "Weihnachtsferien", start: "2025-12-22", end: "2026-01-02" },
    { name: "Osterferien",      start: "2026-03-23", end: "2026-04-04" },
    { name: "Sommerferien",     start: "2026-06-25", end: "2026-08-07" },
    { name: "Herbstferien",     start: "2026-10-19", end: "2026-10-31" },
    { name: "Weihnachtsferien", start: "2026-12-23", end: "2027-01-02" },
  ],
};

// Fallback: BW für alle anderen Bundesländer bis vollständige Daten vorliegen
function getHolidaysForState(stateCode: string): SchoolHoliday[] {
  return SCHOOL_HOLIDAYS[stateCode] ?? SCHOOL_HOLIDAYS["BW"];
}

/**
 * Gibt für einen Monat eine Map zurück: Tag → Ferienname
 * Tage innerhalb eines Ferienzeitraums werden alle markiert.
 *
 * SPÄTER: async machen und durch API ersetzen:
 * const data = await fetch(`https://ferien-api.de/api/v1/holidays/${stateCode}/${year}`)
 */
export function getSchoolHolidayMap(
  year: number,
  month: number,
  stateCode: string
): Record<number, string> {
  const holidays = getHolidaysForState(stateCode);
  const map: Record<number, string> = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];

    for (const holiday of holidays) {
      if (dateStr >= holiday.start && dateStr <= holiday.end) {
        map[day] = holiday.name;
        break;
      }
    }
  }

  return map;
}

/**
 * Gibt alle Schulferien für ein Jahr zurück (für spätere Listenansicht).
 */
export function getSchoolHolidaysForYear(
  year: number,
  stateCode: string
): SchoolHoliday[] {
  return getHolidaysForState(stateCode).filter(
    (h) => h.start.startsWith(String(year)) || h.end.startsWith(String(year))
  );
}
