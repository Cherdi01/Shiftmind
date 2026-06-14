/**
 * Feiertags-Service
 *
 * Heute: statische Berechnung der deutschen gesetzlichen Feiertage
 * pro Bundesland (über Adresse bestimmt).
 *
 * Vorbereitet für spätere API-Integration:
 *   z.B. https://feiertage-api.de/api/?jahr=2026&nur_land=BW
 *   → einfach fetchHolidays() durch einen API-Call ersetzen,
 *     der dieselbe PublicHoliday[] Struktur zurückgibt.
 */

import { PublicHoliday, UserAddress } from "../types";

/** Bundesland-Kürzel aus Adresse ableiten */
export function getStateCode(address?: UserAddress): string {
  if (!address?.state) return "BW"; // Default
  const map: Record<string, string> = {
    "Baden-Württemberg": "BW",
    "Bayern": "BY",
    "Berlin": "BE",
    "Brandenburg": "BB",
    "Bremen": "HB",
    "Hamburg": "HH",
    "Hessen": "HE",
    "Mecklenburg-Vorpommern": "MV",
    "Niedersachsen": "NI",
    "Nordrhein-Westfalen": "NW",
    "Rheinland-Pfalz": "RP",
    "Saarland": "SL",
    "Sachsen": "SN",
    "Sachsen-Anhalt": "ST",
    "Schleswig-Holstein": "SH",
    "Thüringen": "TH",
  };
  return map[address.state] ?? "BW";
}

/** Ostersonntag nach Gaußscher Formel */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function iso(date: Date): string {
  return date.toISOString().split("T")[0];
}

/** Regionale Feiertage pro Bundesland */
const REGIONAL: Record<string, string[]> = {
  HH: [], HB: [], NI: [], SH: [],
  NW: ["Allerheiligen"],
  BY: ["Heilige Drei Könige", "Mariä Himmelfahrt", "Allerheiligen", "Mariä Empfängnis"],
  BW: ["Heilige Drei Könige", "Fronleichnam", "Allerheiligen"],
  RP: ["Fronleichnam", "Allerheiligen"],
  SL: ["Fronleichnam", "Mariä Himmelfahrt", "Allerheiligen"],
  HE: ["Fronleichnam"],
  SN: ["Fronleichnam", "Reformationstag"],
  ST: ["Reformationstag"],
  TH: ["Fronleichnam", "Reformationstag"],
  BB: ["Reformationstag"],
  MV: ["Reformationstag"],
  BE: [],
};

/**
 * Gibt alle Feiertage für ein Jahr und Bundesland zurück.
 * SPÄTER: durch API-Call ersetzen.
 */
export function getHolidaysForYear(year: number, stateCode: string): PublicHoliday[] {
  const easter = easterSunday(year);
  const regional = REGIONAL[stateCode] ?? [];

  const all: { date: Date; name: string; scope: "national" | "regional" }[] = [
    // Nationale
    { date: new Date(year, 0, 1),   name: "Neujahr",                scope: "national" },
    { date: addDays(easter, -2),     name: "Karfreitag",              scope: "national" },
    { date: easter,                  name: "Ostersonntag",             scope: "national" },
    { date: addDays(easter, 1),      name: "Ostermontag",              scope: "national" },
    { date: new Date(year, 4, 1),   name: "Tag der Arbeit",           scope: "national" },
    { date: addDays(easter, 39),     name: "Christi Himmelfahrt",      scope: "national" },
    { date: addDays(easter, 49),     name: "Pfingstsonntag",           scope: "national" },
    { date: addDays(easter, 50),     name: "Pfingstmontag",            scope: "national" },
    { date: new Date(year, 9, 3),   name: "Tag der Deutschen Einheit",scope: "national" },
    { date: new Date(year, 11, 25), name: "1. Weihnachtstag",         scope: "national" },
    { date: new Date(year, 11, 26), name: "2. Weihnachtstag",         scope: "national" },
    // Regionale
    { date: new Date(year, 0, 6),   name: "Heilige Drei Könige",      scope: "regional" },
    { date: addDays(easter, 60),     name: "Fronleichnam",             scope: "regional" },
    { date: new Date(year, 7, 15),  name: "Mariä Himmelfahrt",        scope: "regional" },
    { date: new Date(year, 9, 31),  name: "Reformationstag",          scope: "regional" },
    { date: new Date(year, 10, 1),  name: "Allerheiligen",            scope: "regional" },
    { date: new Date(year, 11, 8),  name: "Mariä Empfängnis",         scope: "regional" },
  ];

  return all
    .filter((h) => h.scope === "national" || regional.includes(h.name))
    .map((h) => ({ date: iso(h.date), name: h.name, scope: h.scope }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Feiertage für einen Monat, als Map day→name.
 * SPÄTER: async machen und durch API ersetzen.
 */
export function getHolidayMapForMonth(
  year: number,
  month: number,
  stateCode: string
): Record<number, string> {
  const holidays = getHolidaysForYear(year, stateCode);
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
  const map: Record<number, string> = {};
  holidays.forEach((h) => {
    if (h.date.startsWith(prefix)) {
      const day = parseInt(h.date.split("-")[2]);
      map[day] = h.name;
    }
  });
  return map;
}
