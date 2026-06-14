import React, { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeColors } from "../theme";
import { hapticLight, hapticSuccess } from "../utils/haptics";

type Mode = "login" | "register" | "reset";

type Props = {
  t: ThemeColors;
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onSignUp: (email: string, password: string, name: string) => Promise<boolean>;
  onApple: () => Promise<boolean>;
  onReset: (email: string) => Promise<boolean>;
  onSkip?: () => void; // Optional: ohne Account fortfahren
};

export function AuthScreen({ t, onSignIn, onSignUp, onApple, onReset, onSkip }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) return;
    setLoading(true);
    hapticLight();
    try {
      if (mode === "login") {
        const ok = await onSignIn(email.trim(), password);
        if (ok) hapticSuccess();
      } else if (mode === "register") {
        if (!name.trim() || !password) return;
        const ok = await onSignUp(email.trim(), password, name.trim());
        if (ok) hapticSuccess();
      } else {
        await onReset(email.trim());
      }
    } finally {
      setLoading(false);
    }
  }

  const inp = {
    backgroundColor: t.bgDeep,
    color: t.textPrimary,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
  } as const;

  const titles: Record<Mode, string> = {
    login: "Willkommen zurück",
    register: "Konto erstellen",
    reset: "Passwort zurücksetzen",
  };
  const btnLabels: Record<Mode, string> = {
    login: "Anmelden",
    register: "Registrieren",
    reset: "Link senden",
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 28 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={{ marginBottom: 40 }}>
          <Text style={{ color: t.accent, fontSize: 34, fontWeight: "900" }}>ShiftMind</Text>
          <Text style={{ color: t.textMuted, fontSize: 15, marginTop: 4 }}>{titles[mode]}</Text>
        </View>

        {/* Apple Sign-In */}
        {mode !== "reset" && (
          <>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={t.bg === "#f1f5f9"
                ? AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                : AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
              cornerRadius={16}
              style={{ width: "100%", height: 52, marginBottom: 16 }}
              onPress={async () => { setLoading(true); await onApple(); setLoading(false); }}
            />

            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 10 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: t.border }} />
              <Text style={{ color: t.textMuted, fontSize: 13 }}>oder mit E-Mail</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: t.border }} />
            </View>
          </>
        )}

        {/* Formular */}
        {mode === "register" && (
          <TextInput
            style={inp} placeholder="Name" placeholderTextColor={t.textMuted}
            value={name} onChangeText={setName} autoCapitalize="words"
          />
        )}

        <TextInput
          style={inp} placeholder="E-Mail" placeholderTextColor={t.textMuted}
          value={email} onChangeText={setEmail}
          keyboardType="email-address" autoCapitalize="none"
        />

        {mode !== "reset" && (
          <View style={{ position: "relative", marginBottom: 12 }}>
            <TextInput
              style={[inp, { marginBottom: 0, paddingRight: 50 }]}
              placeholder="Passwort" placeholderTextColor={t.textMuted}
              value={password} onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 16, top: 16 }}
              onPress={() => setShowPassword((v) => !v)}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22} color={t.textMuted}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Passwort vergessen */}
        {mode === "login" && (
          <TouchableOpacity
            onPress={() => setMode("reset")}
            style={{ alignSelf: "flex-end", marginBottom: 20 }}
          >
            <Text style={{ color: t.accent, fontSize: 13, fontWeight: "700" }}>
              Passwort vergessen?
            </Text>
          </TouchableOpacity>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={{
            backgroundColor: t.accent, padding: 17, borderRadius: 18,
            alignItems: "center", marginTop: mode === "login" ? 0 : 8,
            opacity: loading ? 0.7 : 1,
          }}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={t.bgDeep} />
            : <Text style={{ color: t.bgDeep, fontWeight: "900", fontSize: 17 }}>{btnLabels[mode]}</Text>
          }
        </TouchableOpacity>

        {/* Mode-Wechsel */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20, gap: 6 }}>
          {mode === "login" ? (
            <>
              <Text style={{ color: t.textMuted }}>Noch kein Konto?</Text>
              <TouchableOpacity onPress={() => { hapticLight(); setMode("register"); }}>
                <Text style={{ color: t.accent, fontWeight: "800" }}>Registrieren</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={{ color: t.textMuted }}>Bereits registriert?</Text>
              <TouchableOpacity onPress={() => { hapticLight(); setMode("login"); }}>
                <Text style={{ color: t.accent, fontWeight: "800" }}>Anmelden</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Ohne Account fortfahren */}
        {onSkip && (
          <TouchableOpacity
            onPress={() => { hapticLight(); onSkip(); }}
            style={{ alignItems: "center", marginTop: 24 }}
          >
            <Text style={{ color: t.textMuted, fontSize: 13 }}>
              Ohne Account fortfahren →
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
