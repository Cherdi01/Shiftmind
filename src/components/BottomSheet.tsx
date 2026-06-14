import React from "react";
import {
  Keyboard, KeyboardAvoidingView, Modal, Platform,
  TouchableWithoutFeedback, View,
} from "react-native";

type MinimalTheme = {
  bgCard: string;
  border: string;
};

export function BottomSheet({
  visible, t, onClose, children, maxHeight = "93%", avoidKeyboard = false,
}: {
  visible: boolean;
  t: MinimalTheme;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: string | number;
  avoidKeyboard?: boolean;
}) {
  function handleClose() {
    Keyboard.dismiss();
    onClose();
  }

  const sheet = (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{
        backgroundColor: t.bgCard,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 20,
        maxHeight,
        borderWidth: 1,
        borderColor: t.border,
      }}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end" }}>
          {avoidKeyboard ? (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
              {sheet}
            </KeyboardAvoidingView>
          ) : sheet}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
