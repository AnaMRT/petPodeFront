import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../context/UserContext";
import PhotoPickerModal from "./PhotoPickerModal";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import api from "../../api"; 
import { atualizarImagemUsuario } from "../service/AtualizarImagemUsuario";

export default function CustomDrawerContent() {
  const { user, setUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const [fetchingUser, setFetchingUser] = useState(true);

  const fetchUser = async () => {
    try {
      setFetchingUser(true);
      const token = await AsyncStorage.getItem("token");
      const response = await api.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("[fetchUser]", error);
    } finally {
      setFetchingUser(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchUser);
    return unsubscribe;
  }, [navigation]);

  const handleUpload = async (uri) => {
    try {
      setLoading(true);
      const imagemUrl = await atualizarImagemUsuario(uri); // Salva no backend
      setUser((prev) => ({ ...prev, imagemUrl })); // Atualiza no contexto
      Alert.alert("Sucesso", "Imagem atualizada!");
    } catch (error) {
      console.error("[handleUpload]", error);
      Alert.alert("Erro", "Não foi possível atualizar a imagem.");
    } finally {
      setLoading(false);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setModalVisible(false);
      await handleUpload(uri);
    }
  };

  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setModalVisible(false);
      await handleUpload(uri);
    }
  };

  const handleAvatarSelect = async (avatar) => {
    const uri = Image.resolveAssetSource(avatar).uri;
    setModalVisible(false);
    await handleUpload(uri);
  };

  const handleLogout = async () => {
    await logout();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  if (fetchingUser) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#6B4226" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.photoContainer}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#6B4226" />
          ) : (
            <>
              <Image
                source={
                  user?.imagemUrl
                    ? { uri: user.imagemUrl }
                    : require("../../assets/user-placeholder.png")
                }
                style={styles.photo}
              />
              <Text style={styles.changeText}>Alterar Foto</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("EditarPerfilScreen")}
        >
          <Text style={styles.menuText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.alinhadorContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.menuText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.alinhadorContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("InfosScreen")}>
          <Text>Help</Text>
        </TouchableOpacity>
      </View>

      <PhotoPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectAvatar={handleAvatarSelect}
        onPickGallery={pickFromGallery}
        onPickCamera={pickFromCamera}
        title="Escolha sua foto de perfil"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F3F6" },
  headerContainer: { alignItems: "center", paddingBottom: 40 },
  photoContainer: { alignItems: "center" },
  photo: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: "#6B4226" },
  changeText: { marginTop: 10, color: "#2C2C2C", fontWeight: "600", fontSize: 14, fontFamily: "Nunito_400Regular" },
  separator: { width: "80%", height: 1, backgroundColor: "#6B4226", marginTop: 20 },
  menuItem: { paddingVertical: 15 },
  menuText: { fontSize: 16, color: "#2C2C2C", fontFamily: "Nunito_400Regular" },
  alinhadorContainer: { paddingLeft: 70 },
});
