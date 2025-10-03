import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import RegisterScreenPet from "./src/screens/RegisterScreenPet";
import ResetSenhaScreen from "./src/screens/ResetSenhaScreen";
import PetsScreen from "./src/screens/PetsScreen";
import PlantasFavsScreen from "./src/screens/PlantasFavsScreen";

import Home from "./src/screens/Home";

// você pode criar essas telas simples só pra testar
import { View, Text } from "react-native";

function PerfilScreen() { return <View><Text>Meu Perfil</Text></View>; }
function PlanoScreen() { return <View><Text>Plano</Text></View>; }

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerRoutes() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Meu Perfil" component={PerfilScreen} />
      <Drawer.Screen name="Meus Pets" component={PetsScreen} />
      <Drawer.Screen name="Plantas Favoritas" component={PlantasFavsScreen} />
      <Drawer.Screen name="Plano" component={PlanoScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={RegisterScreen} />
        <Stack.Screen name="Cadastro de Pets" component={RegisterScreenPet} />
         <Stack.Screen name="ResetSenha" component={ResetSenhaScreen} />
        <Stack.Screen 
          name="Home" 
          component={DrawerRoutes} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
