import React from "react";
import { View, Text, StyleSheet } from "react-native";

function InfosScreen() {

  return (

    <View style={styles.container}>
      <Text style={styles.message}>
            Como podemos ajudar?{"\n"}Contate nosso time:{" "}
            {"\n"}
        <Text style={styles.email}>{"\n"}petpodeoficial@gmail.com</Text>
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
    backgroundColor: "#F9F3F6",
    
  },
  message: {
    fontSize: 20,
    marginBottom: 10,
    color: "#6B4226",
    fontFamily: "Nunito_700Bold",
     textAlign: "center",
  },
  submessage: {
    fontSize: 16,
    color: "#999",
  
  },
  email: {
    color: "#A3B18A"
    
  }
});

export default InfosScreen;