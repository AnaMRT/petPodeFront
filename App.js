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

// 🔹 Telas
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import RegisterScreenPet from "./src/screens/RegisterScreenPet";
import ResetSenhaScreen from "./src/screens/ResetSenhaScreen";
import PetsScreen from "./src/screens/PetsScreen";
import PlantasFavsScreen from "./src/screens/PlantasFavsScreen";
import Home from "./src/screens/Home";
import EditarPetScreen from "./src/screens/EditarPetScreen";
import EditarPerfilScreen from "./src/screens/EditarPerfilScreen";

// 🔹 Contextos
import { UserProvider } from "./src/context/UserContext";
import { PetsProvider } from "./src/context/PetsContext";

// 🔹 Drawer customizado (com foto, galeria, câmera e avatares)
import CustomDrawerContent from "./src/components/CustomDrawerContent";
import InfosScreen from "./src/screens/InfosScreen";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// 🔹 Tela simples do Plano
function PlanoScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9F3F6",
      }}
    >
      <Text>Plano</Text>
    </View>
  );
}

// 🔹 Tabs inferiores
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

// 🔹 Drawer lateral
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

// 🔹 App principal (com providers)
export default function App() {
  return (
    <UserProvider>
      <PetsProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Cadastro" component={RegisterScreen} />
            <Stack.Screen name="Cadastro de Pets" component={RegisterScreenPet}/>
            <Stack.Screen name="PetsScreen" component={PetsScreen}/>
            <Stack.Screen name="EditarPetScreen" component={EditarPetScreen}/>
            <Stack.Screen name="EditarPerfilScreen" component={EditarPerfilScreen}/>
            <Stack.Screen name="ResetSenha" component={ResetSenhaScreen} />
            <Stack.Screen name="Home" component={DrawerRoutes} />
              <Stack.Screen name="InfosScreen" component={InfosScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PetsProvider>
    </UserProvider>
  );
}
