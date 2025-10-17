import React, { useState, useContext } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../context/UserContext";
import PhotoPickerModal from "./PhotoPickerModal";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomDrawerContent() {
  const { userPhoto, setUserPhoto } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setUserPhoto(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setUserPhoto(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  const handleAvatarSelect = (avatar) => {
    const uri = Image.resolveAssetSource(avatar).uri;
    setUserPhoto(uri);
    setModalVisible(false);
  };

  // Botão de logout: apenas redireciona para tela de login
  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.photoContainer}>
          <Image
            source={
              userPhoto
                ? { uri: userPhoto }
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

      {/* Botão de logout no final do drawer */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.logoutText}>LOG OUT</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#F9F3F6",
  },
  headerContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  photoContainer: {
    alignItems: "center",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#6B4226",
  },
  changeText: {
    marginTop: 10,
    color: "#2C2C2C",
    fontWeight: "600",
    fontSize: 14,
    fontFamily:"Nunito_400Regular",
  },
  separator: {
    width: "80%",
    height: 1,
    backgroundColor: "#6B4226",
    marginTop: 20,
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#2C2C2C",
    fontFamily: "Nunito_400Regular",
  },
  footerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 30,
    alignItems: "center",
  },
  logoutText: {
    color: "#2C2C2C",
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
  },
});
