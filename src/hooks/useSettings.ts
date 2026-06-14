import { useEffect, useState } from "react";
import { loadShiftMindData, saveSettings } from "../services/storage";
import { setHapticsEnabled } from "../utils/haptics";
import { AppSettings, AppTheme, FeatureFlags, Tab, UserAddress, UserProfile } from "../types";

const DEFAULT_FEATURES: FeatureFlags = {
  wasteEnabled:          true,
  routinesEnabled:       true,
  eventsEnabled:         true,
  holidaysEnabled:       true,
  schoolHolidaysEnabled: false, // default aus – nur relevant wenn Kinder
  tasksEnabled:          true,
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme:          "dark",
  hapticsEnabled: true,
  startTab:       "home",
  features:       DEFAULT_FEATURES,
  onboardingDone: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadShiftMindData()
      .then((data) => {
        if (data.settings) {
          // Merge: neue Keys aus DEFAULT_SETTINGS ergänzen falls noch nicht vorhanden
          const merged: AppSettings = {
            ...DEFAULT_SETTINGS,
            ...data.settings,
            features: { ...DEFAULT_FEATURES, ...data.settings.features },
          };
          setSettings(merged);
          setHapticsEnabled(merged.hapticsEnabled);
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) saveSettings(settings);
  }, [settings, loaded]);

  function setTheme(theme: AppTheme) {
    setSettings((prev) => ({ ...prev, theme }));
  }

  function toggleHaptics() {
    setSettings((prev) => {
      const next = { ...prev, hapticsEnabled: !prev.hapticsEnabled };
      setHapticsEnabled(next.hapticsEnabled);
      return next;
    });
  }

  function setAddress(address: UserAddress) {
    setSettings((prev) => ({ ...prev, address }));
  }

  function setStartTab(tab: Tab) {
    setSettings((prev) => ({ ...prev, startTab: tab }));
  }

  function toggleFeature(key: keyof FeatureFlags) {
    setSettings((prev) => ({
      ...prev,
      features: { ...prev.features, [key]: !prev.features[key] },
    }));
  }

  function setFeatures(features: FeatureFlags) {
    setSettings((prev) => ({ ...prev, features }));
  }

  function setProfile(profile: UserProfile) {
    setSettings((prev) => ({ ...prev, profile }));
  }

  function completeOnboarding() {
    setSettings((prev) => ({ ...prev, onboardingDone: true }));
  }

  return {
    settings, loaded,
    setTheme, toggleHaptics, setAddress, setStartTab,
    toggleFeature, setFeatures, setProfile, completeOnboarding,
  };
}
