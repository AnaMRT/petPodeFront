import React from "react";
import { View, Text, Keyboard } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { AuthProvider } from "./src/context/AuthContext";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import RegisterScreenPet from "./src/screens/RegisterScreenPet";
import ResetSenhaScreen from "./src/screens/ResetSenhaScreen";
import PetsScreen from "./src/screens/PetsScreen";
import PlantasFavsScreen from "./src/screens/PlantasFavsScreen";
import Home from "./src/screens/Home";
import EditarPetScreen from "./src/screens/EditarPetScreen";
import EditarPerfilScreen from "./src/screens/EditarPerfilScreen";
import PlanoScreen from "./src/screens/PlanoScreen";

import { UserProvider } from "./src/context/UserContext";
import { PetsProvider } from "./src/context/PetsContext";

import CustomDrawerContent from "./src/components/CustomDrawerContent";
import InfosScreen from "./src/screens/InfosScreen";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function TabRoutes() {
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: isKeyboardVisible
          ? { display: "none" }
          : {
            height: 70,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderWidth: 1,
            borderColor: "#A3B18A",
            backgroundColor: "#F9F3F6",
            marginTop: -40,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
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
            <Ionicons name="paw-outline" size={24} color={color} />
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
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={TabRoutes} />
      <Drawer.Screen name="Editar Perfil" component={EditarPerfilScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <PetsProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Cadastro" component={RegisterScreen} />
              <Stack.Screen name="Cadastro de Pets" component={RegisterScreenPet} />
              <Stack.Screen name="PetsScreen" component={PetsScreen} />
              <Stack.Screen name="EditarPetScreen" component={EditarPetScreen} options={{ headerShown: true, title: "EDITAR PET", headerBackTitleVisible: false, headerTintColor: "#2C2C2C", headerStyle: { backgroundColor: "#F9F3F6", }, headerTitleStyle: { color: "#2C2C2C", fontSize: 34, fontFamily: "PlayfairDisplay_700Bold", } }} />
              <Stack.Screen name="EditarPerfilScreen" component={EditarPerfilScreen} options={{ headerShown: true, title: "EDITAR PERFIL", headerBackTitleVisible: false, headerTintColor: "#2C2C2C", headerStyle: { backgroundColor: "#F9F3F6", }, headerTitleStyle: { color: "#2C2C2C", fontSize: 34, fontFamily: "PlayfairDisplay_700Bold", } }} />
              <Stack.Screen name="ResetSenha" component={ResetSenhaScreen} options={{ headerShown: true, title: "", headerBackTitleVisible: false, headerTintColor: "#2C2C2C", headerStyle: { backgroundColor: "#F9F3F6", } }} />
              <Stack.Screen name="Home" component={DrawerRoutes} />
              <Stack.Screen name="InfosScreen" component={InfosScreen} options={{ headerShown: true, title: "", headerBackTitleVisible: false, headerTintColor: "#2C2C2C", headerStyle: { backgroundColor: "#F9F3F6", } }} />
              <Stack.Screen name="Plano" component={PlanoScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PetsProvider>
      </UserProvider>
    </AuthProvider>
  );
}
