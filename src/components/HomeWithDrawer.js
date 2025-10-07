import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./HomeScreen"; // sua tela
import { View, Text } from "react-native";

function PerfilScreen() {
  return <View><Text>Meu Perfil</Text></View>;
}

const Drawer = createDrawerNavigator();

export default function HomeWithDrawer() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Home" component={HomeScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
