import { Platform } from "react-native";

let Haptics: any = null;
try { Haptics = require("expo-haptics"); } catch {}

// Globales Flag – wird von useSettings gesetzt
let _enabled = true;
export function setHapticsEnabled(enabled: boolean) { _enabled = enabled; }

export function hapticLight() {
  if (!_enabled || !Haptics || Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle?.Light ?? "light").catch(() => {});
}
export function hapticSuccess() {
  if (!_enabled || !Haptics || Platform.OS === "web") return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType?.Success ?? "success").catch(() => {});
}
export function hapticError() {
  if (!_enabled || !Haptics || Platform.OS === "web") return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType?.Error ?? "error").catch(() => {});
}
