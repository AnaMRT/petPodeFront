import React, { useState, useContext } from "react";
import { View, Image, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../../context/userContext/UserContext.js";
import PhotoPickerModal from "../photoPicker/PhotoPickerModal";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { AuthContext } from "../../context/authContext/AuthContext.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import CustomDrawerStyles from "./Styles.js";
import * as FileSystem from "expo-file-system";

export default function CustomDrawerContent() {
  const { user, userPhoto, setUserPhoto } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);

  const handleSelectAvatar = async (avatar) => {
  try {
    setUploading(true);
    const avatarUri = Image.resolveAssetSource(avatar).uri;
    await setUserPhoto(avatarUri);
  } finally {
    setUploading(false);
  }
  setModalVisible(false);
};


 const pickFromGallery = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    try {
      setUploading(true);
      await setUserPhoto(result.assets[0].uri);
    } finally {
      setUploading(false);
    }
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
  }).catch((ex) => {
    console.log("ex", ex);
  });

  const uri = result.assets[0].uri;
  const fileName = uri.split("/").pop();
  console.log('result', result)
  console.log('uri', uri)
  console.log('fileName', fileName)

  const destDir = FileSystem.Paths.document;
  console.log('destDir', destDir);

  // Arquivos (objeto File, não string)
  const sourceFile = File.fromUri(uri);
  console.log('sourceFile', sourceFile);

  const destFile = new File(destDir, fileName);
  console.log('destFile', destFile);

  // Copiar para armazenamento seguro
  await sourceFile.copyToAsync(destFile);
  

  if (!result.canceled) {
    try {
      setUploading(true);
      await setUserPhoto(destFile.uri);
    } finally {
      setUploading(false);
    }
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
    <SafeAreaView style={CustomDrawerStyles.container}>
        <View style={CustomDrawerStyles.headerContainer}>
        <View style={CustomDrawerStyles.userRow}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={
                userPhoto
                  ? { uri: userPhoto }
                  : require("../../../assets/user-placeholder.png")
              }
              style={CustomDrawerStyles.photo}
            />
          </TouchableOpacity>

          <View style={CustomDrawerStyles.userInfo}>
            <Text style={CustomDrawerStyles.userName}>
              {user?.nome?.toUpperCase() || "NOME"}
            </Text>
            <Text style={CustomDrawerStyles.userEmail}>
              {user?.email || "email@exemplo.com"}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={CustomDrawerStyles.changeText}>Alterar Foto</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={CustomDrawerStyles.separator} />

        <TouchableOpacity
          style={CustomDrawerStyles.menuItemRow}
          onPress={() => navigation.navigate("EditarPerfilScreen")}
        >
          <Feather name="edit-2" size={20} color="#6B4226" />
          <Text style={CustomDrawerStyles.menuText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={CustomDrawerStyles.bottomContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 40,
            justifyContent: "space-between",
            paddingRight: 20,
          }}
        >
          <TouchableOpacity
            style={CustomDrawerStyles.bottomRowButton}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={30} color="#6B4226" />
            <Text style={CustomDrawerStyles.menuText}>Sair</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={CustomDrawerStyles.bottomRowButton}
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
      {uploading && (
        <ActivityIndicator
          size="large"
          color="#6B4226"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginLeft: -12,
            marginTop: -12,
          }}
        />
      )}
    </SafeAreaView>
  );
}