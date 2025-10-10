import React, { useState, useContext } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../context/UserContext";
import PhotoPickerModal from "./PhotoPickerModal";

export default function CustomDrawerContent() {
  const { userPhoto, setUserPhoto } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);

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

        {/* Linha de separação agora com espaçamento */}
        <View style={styles.separator} />
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
    alignItems: "center", // garante que a foto não encoste na borda do celular
    paddingBottom: 40, // espaçamento entre foto e linha
  },
  photoContainer: {
    alignItems: "center",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#A3B18A",
  },
  changeText: {
    marginTop: 10,
    color: "#6B4226",
    fontWeight: "600",
  },
  separator: {
    width: "80%",
    height: 1,
    backgroundColor: "#A3B18A",
    marginTop: 20,
  },
});
