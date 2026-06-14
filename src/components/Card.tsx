import React from "react";
import { View } from "react-native";
import { styles } from "./styles";

export function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}
