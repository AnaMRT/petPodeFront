import React from "react";
import { View, Text, StyleSheet } from "react-native";

function PlantasFavsScreen() {

    return (

    <View style={styles.container}>
        <Text style={styles.message}>
            Ops... você ainda não possui plantas favoritas!
        </Text>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",     
    padding: 30,
    backgroundColor: "#F9F3F6"
 },
  message: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6B4226",
    fontFamily:"Nunito_400Regular",
  },
  submessage: {
    fontSize: 16,
    color: "#999",
  },
});

export default PlantasFavsScreen;