# ShiftMind

**Dienstplan-App für Pflegepersonal – mit ADHS-Struktur im Alltag.**

ShiftMind hilft dabei, Schichtdienste zu verwalten, tagesgebundene Aufgaben zu organisieren und passende Routinen für jeden Diensttyp bereitzustellen. Entwickelt für Menschen, die klare Strukturen brauchen.

---

## Features

- 📅 **Monatskalender** – Dienste eintragen, importieren und auf einen Blick sehen
- ✅ **Tagesaufgaben** – Aufgaben direkt an einen Tag koppeln
- 🔄 **Routinen** – Automatische Vorbereitung basierend auf dem Diensttyp (Früh/Spät/Nacht)
- 🗑 **Müllplan** – Abfuhrtage direkt im Kalender sichtbar
- 📄 **Import** – Dienstplan per Text-Import einlesen; unbekannte Codes werden erkannt und abgefragt
- 💾 **Offline-first** – Alle Daten lokal gespeichert via AsyncStorage

---

## Diensttypen

Dienste sind frei konfigurierbar. Standardmäßig enthalten: Frühdienst (F), Spätdienst (S), Nachtdienst (N), Tagdienst (T), Fortbildung (IBF), Frei.

---

## Tech Stack

- [Expo](https://expo.dev) (React Native)
- TypeScript
- AsyncStorage für lokale Persistenz
- `@expo/vector-icons` (MaterialCommunityIcons)

---

## Setup

```bash
npm install
npx expo start
```

iOS-Build via [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
eas build --platform ios
```

---

## Projektstruktur

```
src/
├── components/   UI-Komponenten & Modals
├── data/         Standardwerte & JSON-Daten
├── hooks/        Custom Hooks (State-Logik)
├── screens/      Tab-Screens
├── services/     Storage, Parser, AI
├── types/        TypeScript-Typdefinitionen
└── utils/        Hilfsfunktionen
```
