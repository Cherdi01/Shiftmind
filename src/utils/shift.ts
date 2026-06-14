import { ShiftCategory } from "../types";

export function detectCategory(code: string): ShiftCategory {
  const upper = code.toUpperCase();
  if (upper === "FREI" || upper === "BA" || upper === "U") return "free";
  if (upper.startsWith("F")) return "early";
  if (upper.startsWith("S")) return "late";
  if (upper.startsWith("N")) return "night";
  if (upper.startsWith("T")) return "day";
  if (upper.includes("IBF") || upper.includes("WB") || upper.includes("FORT")) return "training";
  return "custom";
}

export function chooseColorForCode(code: string): string {
  const category = detectCategory(code);
  const colors: Record<ShiftCategory, string> = {
    early:    "#38bdf8",
    late:     "#f59e0b",
    night:    "#a78bfa",
    day:      "#34d399",
    training: "#fb7185",
    free:     "#64748b",
    custom:   "#e2e8f0",
  };
  return colors[category];
}

/** Berechnet die absolute Uhrzeit eines Routine-Schritts.
 *  startTime: "07:00", offsetMinutes: -75  →  "05:45"
 */
export function calcStepTime(startTime: string, offsetMinutes: number): string {
  if (!startTime || startTime === "--:--") return "";
  const [hStr, mStr] = startTime.split(":");
  const totalMinutes = parseInt(hStr) * 60 + parseInt(mStr) + offsetMinutes;
  // Wrap around midnight
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60).toString().padStart(2, "0");
  const m = (wrapped % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}
