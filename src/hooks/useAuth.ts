import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Session, User } from "@supabase/supabase-js";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { supabase } from "../lib/supabase";
import { loadAllFromCloud, syncProfileToCloud } from "../services/syncService";

export type AuthState = "loading" | "unauthenticated" | "authenticated";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [cloudData, setCloudData] = useState<Awaited<ReturnType<typeof loadAllFromCloud>> | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthState(session ? "authenticated" : "unauthenticated");
      if (session) loadCloud();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setAuthState(session ? "authenticated" : "unauthenticated");
        if (session) await loadCloud();
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  async function loadCloud() {
    setSyncing(true);
    try {
      const data = await loadAllFromCloud();
      setCloudData(data);
    } catch (e) {
      console.warn("Cloud load failed, using local data", e);
    } finally {
      setSyncing(false);
    }
  }

  async function signUp(email: string, password: string, name: string): Promise<boolean> {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    });
    if (error) {
      Alert.alert("Fehler", error.message);
      return false;
    }
    await syncProfileToCloud(name, "early-late-night");
    return true;
  }

  async function signIn(email: string, password: string): Promise<boolean> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert("Fehler", error.message === "Invalid login credentials"
        ? "E-Mail oder Passwort falsch."
        : error.message
      );
      return false;
    }
    return true;
  }

  async function resetPassword(email: string): Promise<boolean> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) { Alert.alert("Fehler", error.message); return false; }
    Alert.alert("E-Mail gesendet", "Bitte überprüfe deinen Posteingang.");
    return true;
  }

  async function signInWithApple(): Promise<boolean> {
    try {
      // Rohes Nonce generieren
      const rawNonce = Math.random().toString(36).substring(2) +
                       Math.random().toString(36).substring(2);

      // SHA256 Hash des rohen Nonce für Apple
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce
      );

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce, // Apple bekommt den Hash
      });

      // Supabase bekommt das rohe Nonce + Apple Token
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken!,
        nonce: rawNonce, // Supabase bekommt das Original
      });

      if (error) { Alert.alert("Fehler", error.message); return false; }

      const name = [credential.fullName?.givenName, credential.fullName?.familyName]
        .filter(Boolean).join(" ");
      if (name) await syncProfileToCloud(name, "early-late-night");
      return true;
    } catch (e: any) {
      if (e.code !== "ERR_REQUEST_CANCELED") {
        Alert.alert("Apple Sign-In Fehler", e.message ?? "Unbekannter Fehler");
      }
      return false;
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setCloudData(null);
  }

  return {
    session, user, authState, syncing, cloudData,
    signUp, signIn, signInWithApple, signOut, resetPassword,
    refreshCloud: loadCloud,
  };
}
