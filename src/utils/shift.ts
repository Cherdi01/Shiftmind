import { ShiftCategory } from "../types";

export function detectCategory(code: string): ShiftCategory {
  const upper = code.toUpperCase();
  if (upper.includes("FREI") || upper === "BA") return "free";
  if (upper.startsWith("F")) return "early";
  if (upper.startsWith("S")) return "late";
  if (upper.startsWith("N")) return "night";
  if (upper.startsWith("T")) return "day";
  if (upper.includes("IBF") || upper.includes("WB")) return "training";
  return "custom";
}

export function chooseColorForCode(code: string): string {
  const category = detectCategory(code);
  if (category === "early") return "#38bdf8";
  if (category === "late") return "#f59e0b";
  if (category === "night") return "#a78bfa";
  if (category === "day") return "#34d399";
  if (category === "training") return "#fb7185";
  if (category === "free") return "#64748b";
  return "#38bdf8";
}
