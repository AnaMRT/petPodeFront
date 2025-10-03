import React, { useState } from "react";
import {View, TextInput, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { Button } from "react-native-elements";

function PetsScreen({navigation} ) {
 

   const AbrirPets = () => {
    navigation.navigate("Cadastro de Pets");
  };

    return (

       <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.message}>
          Ops... você ainda não possui pets cadastrados!
        </Text>
        <Button title="CADASTRAR PET" onPress={AbrirPets} buttonStyle={styles.button} titleStyle={styles.buttonText}
        />
      </View>
    </ScreenWrapper>
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
   button: {
    backgroundColor: "#6B4226",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily:"Nunito_400Regular",
  },
  
});

export default PetsScreen;