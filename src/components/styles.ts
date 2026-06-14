import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ─── Layout ───────────────────────────────────────────────────────────────
  safe:    { flex: 1, backgroundColor: "#050b14" },
  app:     { flex: 1, backgroundColor: "#050b14" },
  header:  { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 },
  content: { flex: 1, paddingHorizontal: 16 },

  // ─── Typography ───────────────────────────────────────────────────────────
  logo:    { color: "#f8fafc", fontSize: 30, fontWeight: "900" },
  sub:     { color: "#94a3b8", marginTop: 4, fontSize: 14 },
  text:    { color: "#e2e8f0", fontSize: 15, lineHeight: 22 },
  muted:   { color: "#94a3b8", fontSize: 14, lineHeight: 21 },
  bigText: { color: "#f8fafc", fontSize: 24, fontWeight: "900", marginBottom: 4 },
  stepTime:{ color: "#38bdf8", fontSize: 12, marginTop: 2 },

  // ─── Card ─────────────────────────────────────────────────────────────────
  card:      { backgroundColor: "#0f172a", borderRadius: 22, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: "#1e293b" },
  cardTitle: { color: "#38bdf8", fontWeight: "800", fontSize: 16, marginBottom: 10 },

  // ─── Tabs ─────────────────────────────────────────────────────────────────
  tabs:           { flexDirection: "row", paddingHorizontal: 10, paddingTop: 8, paddingBottom: 12, borderTopWidth: 1, borderTopColor: "#1e293b", backgroundColor: "#07111f" },
  tabButton:      { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 16 },
  tabActive:      { backgroundColor: "#102033" },
  tabLabel:       { color: "#64748b", fontSize: 11, marginTop: 3 },
  tabLabelActive: { color: "#38bdf8", fontWeight: "800" },
  tabBadgeContainer: { position: "absolute", top: -4, right: -8, backgroundColor: "#ef4444", borderRadius: 8, paddingHorizontal: 4, paddingVertical: 1, minWidth: 16, alignItems: "center" },
  tabBadgeText: { color: "#fff", fontSize: 9, fontWeight: "900" },

  // ─── Month Header ─────────────────────────────────────────────────────────
  monthHeader:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  monthTitle:    { color: "#f8fafc", fontSize: 22, fontWeight: "900" },
  smallButton:   { backgroundColor: "#0f172a", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: "#1e293b" },
  buttonText:    { color: "#f8fafc", fontSize: 20, fontWeight: "900" },
  monthStatRow:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  monthStatText: { color: "#64748b", fontSize: 13, fontWeight: "700" },
  goTodayText:   { color: "#38bdf8", fontSize: 13, fontWeight: "800" },

  // ─── Action Row ───────────────────────────────────────────────────────────
  actionRow:    { flexDirection: "row", gap: 8, marginBottom: 10 },
  actionButton: { flex: 1, backgroundColor: "#0f172a", padding: 10, borderRadius: 16, borderWidth: 1, borderColor: "#1e293b" },
  wideButton:   { backgroundColor: "#0f172a", padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "#1e293b", marginBottom: 14 },
  actionText:   { color: "#e2e8f0", fontSize: 12, fontWeight: "700", textAlign: "center" },

  // ─── Calendar ─────────────────────────────────────────────────────────────
  calendar:         { flexDirection: "row", flexWrap: "wrap", backgroundColor: "#0f172a", borderRadius: 22, padding: 8, marginBottom: 10, borderWidth: 1, borderColor: "#1e293b" },
  weekday:          { width: "14.285%", textAlign: "center", color: "#64748b", fontSize: 12, fontWeight: "800", paddingVertical: 8 },
  day:              { width: "14.285%", minHeight: 84, padding: 4, borderRadius: 14, alignItems: "center" },
  dayToday:         { backgroundColor: "#0c2a3f", borderRadius: 14, borderWidth: 1, borderColor: "#38bdf8" },
  dayWeekend:       { backgroundColor: "#0a1628" },
  dayPast:          { opacity: 0.45 },
  dayNumber:        { color: "#f8fafc", fontSize: 13, fontWeight: "800", marginBottom: 3 },
  dayNumberToday:   { color: "#38bdf8" },
  dayNumberPast:    { color: "#475569" },
  shiftBadge:       { minWidth: 36, paddingVertical: 3, paddingHorizontal: 4, borderRadius: 9, alignItems: "center", marginBottom: 3 },
  shiftText:        { color: "#020617", fontSize: 10, fontWeight: "900" },
  wasteRow:         { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", minHeight: 14 },
  wasteIcon:        { marginHorizontal: 1 },
  unknownMini:      { color: "#fca5a5", fontSize: 11, fontWeight: "900" },
  taskCountBadge:   { marginTop: 2, backgroundColor: "#1e3a5f", minWidth: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  taskCountText:    { color: "#38bdf8", fontSize: 10, fontWeight: "800" },

  // ─── Legend ───────────────────────────────────────────────────────────────
  legendRow:  { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16, paddingHorizontal: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot:  { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: "#64748b", fontSize: 11 },

  // ─── Modal ────────────────────────────────────────────────────────────────
  modalOverlay:   { flex: 1, backgroundColor: "rgba(0,0,0,0.78)", justifyContent: "flex-end" },
  modal:          { backgroundColor: "#0f172a", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, maxHeight: "93%", borderWidth: 1, borderColor: "#1e293b" },
  modalTitle:     { color: "#f8fafc", fontSize: 22, fontWeight: "900", marginBottom: 14 },
  detailBlock:    { backgroundColor: "#020617", borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: "#1e293b" },
  detailShiftRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  detailWasteRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
  durationBadge:  { backgroundColor: "#0f172a", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", borderWidth: 1, borderColor: "#1e293b", marginTop: 6 },
  durationBadgeText: { color: "#94a3b8", fontSize: 12, fontWeight: "700" },

  // ─── Inputs ───────────────────────────────────────────────────────────────
  input:     { backgroundColor: "#020617", color: "#f8fafc", borderWidth: 1, borderColor: "#1e293b", borderRadius: 16, padding: 14, marginBottom: 10, fontSize: 15 },
  importBox: { minHeight: 130, textAlignVertical: "top", marginTop: 12 },

  // ─── Buttons ──────────────────────────────────────────────────────────────
  primaryButton:       { backgroundColor: "#38bdf8", padding: 15, borderRadius: 18, alignItems: "center", marginTop: 8 },
  primaryButtonText:   { color: "#020617", fontWeight: "900", fontSize: 15 },
  secondaryButton:     { backgroundColor: "#172554", padding: 14, borderRadius: 18, alignItems: "center", marginTop: 10 },
  secondaryButtonText: { color: "#bfdbfe", fontWeight: "800" },
  warningButton:       { backgroundColor: "#450a0a", padding: 12, borderRadius: 16, alignItems: "center", marginTop: 8 },
  warningButtonText:   { color: "#fecaca", fontWeight: "900" },
  closeButton:         { padding: 15, borderRadius: 18, alignItems: "center", marginTop: 8 },
  closeButtonText:     { color: "#94a3b8", fontWeight: "800" },
  dangerButton:        { backgroundColor: "#450a0a", padding: 15, borderRadius: 18, alignItems: "center", marginTop: 12, marginBottom: 20 },
  dangerButtonText:    { color: "#fecaca", fontWeight: "900", fontSize: 15 },

  // ─── Shift Select ─────────────────────────────────────────────────────────
  shiftOption:     { flexDirection: "row", alignItems: "center", backgroundColor: "#020617", padding: 12, borderRadius: 16, marginBottom: 8, borderWidth: 1, borderColor: "#1e293b" },
  colorDot:        { width: 14, height: 14, borderRadius: 7, marginRight: 10 },
  shiftOptionCode: { color: "#f8fafc", fontWeight: "800", fontSize: 15 },
  shiftOptionTime: { color: "#94a3b8", fontSize: 13, marginTop: 2 },
  deleteOption:    { padding: 14, alignItems: "center" },
  deleteText:      { color: "#f87171", fontWeight: "800" },

  // ─── Unknown Codes ────────────────────────────────────────────────────────
  unknownBox:  { marginTop: 14, backgroundColor: "#020617", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "#7f1d1d" },
  unknownItem: { backgroundColor: "#450a0a", borderRadius: 14, padding: 12, marginTop: 8 },
  unknownText: { color: "#fecaca", fontWeight: "800" },

  // ─── Tasks ────────────────────────────────────────────────────────────────
  task:             { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  taskCheck:        { color: "#38bdf8", fontSize: 20, marginRight: 10 },
  taskText:         { color: "#e2e8f0", fontSize: 15 },
  dayTaskRow:       { flexDirection: "row", alignItems: "center", backgroundColor: "#020617", borderRadius: 14, padding: 10, marginBottom: 8, gap: 8 },
  dayTaskText:      { color: "#e2e8f0", fontSize: 14, flex: 1 },
  dayTaskTextDone:  { color: "#334155", textDecorationLine: "line-through" },
  taskSummaryRow:   { flexDirection: "row", gap: 10, marginBottom: 12 },
  taskSummaryBadge: { backgroundColor: "#0f172a", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: "#1e293b" },
  taskSummaryText:  { color: "#94a3b8", fontSize: 13, fontWeight: "700" },
  overdueTag:       { backgroundColor: "#450a0a", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  overdueTagText:   { color: "#fca5a5", fontSize: 11, fontWeight: "800" },

  // ─── Templates ────────────────────────────────────────────────────────────
  templateRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },

  // ─── Home Preview ─────────────────────────────────────────────────────────
  previewRow:      { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: "#0f172a" },
  previewDay:      { color: "#64748b", fontSize: 13, width: 52, fontWeight: "700" },
  daysUntilBadge:  { backgroundColor: "#172554", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  daysUntilText:   { color: "#38bdf8", fontSize: 12, fontWeight: "800" },
  statBadge:       { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#0f172a", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: "#1e293b" },
  statBadgeText:   { color: "#64748b", fontSize: 12, fontWeight: "700" },

  // ─── Waste Modal ──────────────────────────────────────────────────────────
  dayPickerBtn:        { backgroundColor: "#0f172a", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginRight: 6, borderWidth: 1, borderColor: "#1e293b" },
  dayPickerBtnActive:  { backgroundColor: "#172554", borderColor: "#38bdf8" },
  dayPickerText:       { color: "#94a3b8", fontSize: 13, fontWeight: "700" },
  dayPickerTextActive: { color: "#38bdf8" },
  wasteTypeBtn:        { flex: 1, backgroundColor: "#0f172a", borderRadius: 12, padding: 8, alignItems: "center", borderWidth: 1, borderColor: "#1e293b", gap: 4 },
  wasteTypeBtnActive:  { backgroundColor: "#172554", borderColor: "#38bdf8" },
  wasteTypeText:       { color: "#64748b", fontSize: 11, fontWeight: "700", textAlign: "center" },
});
