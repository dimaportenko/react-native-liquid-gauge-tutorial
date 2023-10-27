import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet } from "react-native";
import { LiquidGaugeProgress } from "./src/LiquidGaugeProgress";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <LiquidGaugeProgress size={200} value={45} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignSelf: "center", justifyContent: "center" },
  text: { width: "90%" },
});
