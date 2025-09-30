import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking"; // 👈 importa o linking do Expo

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import RegisterScreenPet from "./src/screens/RegisterScreenPet";
import Home from "./src/screens/Home";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen";

const Stack = createStackNavigator();

// 🔹 Prefixos de deep link (expo + scheme definido no app.json)
const prefix = Linking.createURL("/");

const linking = {
  prefixes: [prefix, "petpode://"], // expo + custom scheme
  config: {
    screens: {
      Login: "login",
      Home: "home",
      Cadastro: "cadastro",
      "Cadastro de Pets": "cadastro-de-pets", // evite espaço na rota
      ResetPassword: "reset-password", // rota do reset
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={RegisterScreen} />
        <Stack.Screen name="Cadastro de Pets" component={RegisterScreenPet} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
