import React, { useState, useContext } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../context/UserContext";
import PhotoPickerModal from "./PhotoPickerModal";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { avatars } from "../../assets/avatars/avatarList"; 

export default function CustomDrawerContent() {
  const { user, userPhoto, setUserPhoto } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  const handleSelectAvatar = async (avatar) => {
    const avatarUri = Image.resolveAssetSource(avatar).uri;
    await setUserPhoto(avatarUri);
    setModalVisible(false);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      await setUserPhoto(result.assets[0].uri);
      setModalVisible(false);
    }
  };

 const pickFromCamera = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== "granted") {
    alert("Permissão da câmera negada. Habilite nas configurações.");
    return;
  }

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

        <View style={styles.userRow}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={
                userPhoto ? { uri: userPhoto } : require("../../assets/user-placeholder.png")
              }
              style={styles.photo}
            />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.nome?.toUpperCase() || "NOME"}</Text>
            <Text style={styles.userEmail}>{user?.email || "email@exemplo.com"}</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.changeText}>Alterar Foto</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.menuItemRow}
          onPress={() => navigation.navigate("EditarPerfilScreen")}
        >
          <Feather name="edit-2" size={20} color="#6B4226" />
          <Text style={styles.menuText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 40,
            justifyContent: "space-between",
            paddingRight: 20,
          }}
        >
          <TouchableOpacity style={styles.bottomRowButton} onPress={handleLogout}>
            <Feather name="log-out" size={30} color="#6B4226" />
            <Text style={styles.menuText}>Sair</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomRowButton}
            onPress={() => navigation.navigate("InfosScreen")}
          >
            <Feather name="help-circle" size={30} color="#6B4226" />
          </TouchableOpacity>
        </View>
      </View>

      <PhotoPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectAvatar={handleSelectAvatar}
        onPickGallery={pickFromGallery}
        onPickCamera={pickFromCamera}
        title="Escolha sua foto de perfil"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F3F6" },
  headerContainer: { paddingHorizontal: 15, paddingVertical: 20 },
  userRow: { flexDirection: "row", alignItems: "center" },
  photo: { width: 80, height: 80, borderRadius: 50, borderWidth: 2, borderColor: "#6B4226" },
  userInfo: { marginLeft: 15 },
  userName: { fontSize: 18, fontWeight: "bold", color: "#6B4226" },
  userEmail: { fontSize: 13, color: "#8A6E63", marginBottom: 4 },
  changeText: { fontSize: 12, color: "#6B4226", fontWeight: "600" },
  separator: { width: "100%", height: 1, backgroundColor: "#6B4226", marginVertical: 20 },
  menuItemRow: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: 10, gap: 10 },
  menuText: { fontSize: 16, color: "#2C2C2C" },
  bottomContainer: { flex: 1, justifyContent: "flex-end", paddingLeft: 20, paddingBottom: 30 },
  bottomRowButton: { flexDirection: "row", alignItems: "center", gap: 6 },
});
