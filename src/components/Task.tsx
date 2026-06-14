import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

export function Task({ text }: { text: string }) {
  return (
    <View style={styles.task}>
      <Text style={styles.taskCheck}>○</Text>
      <Text style={styles.taskText}>{text}</Text>
    </View>
  );
}
