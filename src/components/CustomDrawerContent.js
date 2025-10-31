import React, { useState, useContext } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../context/UserContext";
import PhotoPickerModal from "./PhotoPickerModal";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomDrawerContent() {
  const { userPhoto, setUserPhoto } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  // === Selecionar foto da galeria ===
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await setUserPhoto(result.assets[0].uri); // chama o upload e atualiza contexto
      setModalVisible(false);
    }
  };

  // === Tirar foto com câmera ===
  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await setUserPhoto(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  // === Logout ===
  const handleLogout = async () => {
    await logout();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Foto do usuário */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.photoContainer}
        >
          <Image
            source={
              userPhoto
                ? { uri: userPhoto } // pega do backend ou do state
                : require("../../assets/user-placeholder.png")
            }
            style={styles.photo}
          />
          <Text style={styles.changeText}>Alterar Foto</Text>
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

      {/* Modal de escolha da foto */}
      <PhotoPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#6B4226",
  },
  changeText: { marginTop: 10, color: "#2C2C2C", fontWeight: "600", fontSize: 14 },
  separator: { width: "80%", height: 1, backgroundColor: "#6B4226", marginTop: 20 },
  menuItem: { paddingVertical: 15 },
  menuText: { fontSize: 16, color: "#2C2C2C" },
  alinhadorContainer: { paddingLeft: 70 },
});
