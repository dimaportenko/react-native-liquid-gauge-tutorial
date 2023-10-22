import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.text}>
        Open up App.tsx to start working on your app!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignSelf: "center", justifyContent: "center" },
  text: { width: "90%" },
});
