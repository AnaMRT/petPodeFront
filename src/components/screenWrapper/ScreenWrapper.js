import React from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenWrapperStyles from "./Styles.js";

export default function ScreenWrapper({
  children,
  backgroundColor = "#F9F3F6",
  barStyle = "dark-content",
}) {
  return (
    <SafeAreaView style={[ScreenWrapperStyles.safeArea, { backgroundColor }]}>
      <StatusBar
        barStyle={barStyle}
        backgroundColor={backgroundColor}
        translucent={false}
      />
      <View style={ScreenWrapperStyles.container}>{children}</View>
    </SafeAreaView>
  );
}