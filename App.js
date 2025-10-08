import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text } from "react-native";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import RegisterScreenPet from "./src/screens/RegisterScreenPet";
import ResetSenhaScreen from "./src/screens/ResetSenhaScreen";
import PetsScreen from "./src/screens/PetsScreen";
import PlantasFavsScreen from "./src/screens/PlantasFavsScreen";
import Home from "./src/screens/Home";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function PlanoScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor:"#F9F3F6" }}>
      <Text>Plano</Text>
    </View>
  );
}

function TabRoutes() {
  return (
    <Tab.Navigator
    initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderWidth: 1,
          backgroundColor: "#F9F3F6",
          position: "absolute",
        },
        tabBarActiveTintColor: "#6B4226",
        tabBarInactiveTintColor: "#A3B18A",
      }}
    >
      <Tab.Screen
        name="Plano"
        component={PlanoScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="crown-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Pets"
        component={PetsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="paw" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={PlantasFavsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="star-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


function DrawerRoutes() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={TabRoutes} />
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
        <Stack.Screen name="Home" component={DrawerRoutes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
