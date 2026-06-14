/**
 * Berechnet die Arbeitszeit eines Dienstes in Stunden (mit Nacht-Overlap)
 * "07:00" – "14:00" → 7.0
 * "21:45" – "07:15" → 9.5
 */
export function calcShiftDuration(startTime: string, endTime: string): number | null {
  if (!startTime || !endTime || startTime === "--:--" || endTime === "--:--") return null;
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  let diff = toMinutes(endTime) - toMinutes(startTime);
  if (diff <= 0) diff += 1440; // Nacht-Overlap
  return Math.round((diff / 60) * 100) / 100;
}

/** "7.5" → "7 Std. 30 Min." */
export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h} Std.`;
  return `${h} Std. ${m} Min.`;
}

/** Wochenstunden aus einer Liste von Diensten */
export function calcWeeklyHours(
  shifts: { startTime: string; endTime: string }[]
): number {
  return shifts.reduce((sum, s) => {
    const d = calcShiftDuration(s.startTime, s.endTime);
    return sum + (d ?? 0);
  }, 0);
}
