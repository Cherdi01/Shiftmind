import React, { useRef, useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeColors } from "../theme";
import { AssignedShift } from "../types";
import { ChatMessage, chatWithAI } from "../services/aiService";
import { hapticLight } from "../utils/haptics";

const QUICK_QUESTIONS = [
  "Was habe ich diese Woche?",
  "Wie viele Nachtdienste habe ich?",
  "Wann ist mein nächster freier Tag?",
  "Schlage mir Aufgaben für morgen vor",
  "Analysiere meinen Monat",
];

export function AIChatScreen({
  t, assigned, userName,
}: {
  t: ThemeColors;
  assigned: AssignedShift[];
  userName?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hey${userName ? ` ${userName}` : ""}! 👋 Ich bin dein ShiftMind-Assistent. Ich kann dir Fragen zu deinem Dienstplan beantworten, Aufgaben vorschlagen oder einfach helfen. Was möchtest du wissen?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const today = new Date();
  const context = {
    upcomingShifts: assigned.filter((s) => s.day >= today.getDate()),
    openTaskCount: 0,
    userName,
  };

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    hapticLight();
    setInput("");

    const userMsg: ChatMessage = { role: "user", content: msg };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const reply = await chatWithAI(msg, messages, context);
      setMessages([...newHistory, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setMessages([...newHistory, {
        role: "assistant",
        content: "Entschuldigung, da ist etwas schiefgelaufen. Bitte versuche es nochmal.",
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Nachrichten */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, i) => (
          <View
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
            }}
          >
            {msg.role === "assistant" && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <MaterialCommunityIcons name="robot-outline" size={14} color={t.accent} />
                <Text style={{ color: t.accent, fontSize: 11, fontWeight: "800" }}>ShiftMind KI</Text>
              </View>
            )}
            <View style={{
              backgroundColor: msg.role === "user" ? t.accent : t.bgCard,
              borderRadius: 18,
              borderBottomRightRadius: msg.role === "user" ? 4 : 18,
              borderBottomLeftRadius: msg.role === "assistant" ? 4 : 18,
              padding: 12,
              borderWidth: msg.role === "assistant" ? 1 : 0,
              borderColor: t.border,
            }}>
              <Text style={{
                color: msg.role === "user" ? t.bgDeep : t.textPrimary,
                fontSize: 15, lineHeight: 22,
              }}>
                {msg.content}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: t.bgCard, borderRadius: 18, padding: 12, borderWidth: 1, borderColor: t.border }}>
            <ActivityIndicator size="small" color={t.accent} />
            <Text style={{ color: t.textMuted, fontSize: 14 }}>Denkt nach…</Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 44, marginBottom: 8 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {QUICK_QUESTIONS.map((q) => (
            <TouchableOpacity
              key={q}
              onPress={() => send(q)}
              style={{ backgroundColor: t.bgCard, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: t.border }}
            >
              <Text style={{ color: t.textMuted, fontSize: 13 }}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input */}
      <View style={{ flexDirection: "row", alignItems: "flex-end", padding: 12, gap: 10, backgroundColor: t.bg, borderTopWidth: 1, borderTopColor: t.border }}>
        <TextInput
          style={{ flex: 1, backgroundColor: t.bgCard, color: t.textPrimary, borderWidth: 1, borderColor: t.border, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, maxHeight: 100 }}
          placeholder="Frag mich etwas…"
          placeholderTextColor={t.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          returnKeyType="send"
          onSubmitEditing={() => send()}
        />
        <TouchableOpacity
          onPress={() => send()}
          disabled={!input.trim() || loading}
          style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: input.trim() ? t.accent : t.border, alignItems: "center", justifyContent: "center" }}
        >
          <MaterialCommunityIcons name="send" size={20} color={input.trim() ? t.bgDeep : t.textMuted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
