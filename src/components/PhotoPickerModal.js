import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import { avatars } from "../../assets/avatars/avatarList";

export default function PhotoPickerModal({
  visible,
  onClose,
  onSelectAvatar,
  onPickGallery,
  onPickCamera,
  title = "Escolha sua foto",
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.subtitle}>Avatares</Text>
          <FlatList
            horizontal
            data={avatars}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelectAvatar(item)}>
                <Image source={item} style={styles.avatar} />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />

          <View style={styles.options}>
            <TouchableOpacity onPress={onPickGallery} style={styles.button}>
              <Text style={styles.optionText}>📁 Escolher da Galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onPickCamera} style={styles.button}>
              <Text style={styles.optionText}>📷 Tirar uma Foto</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6B4226",
  },
  subtitle: {
    fontWeight: "600",
    marginBottom: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#A3B18A",
  },
  options: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#F4EDE4",
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
    color: "#6B4226",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 15,
    alignSelf: "center",
  },
  closeText: {
    color: "#6B4226",
    fontSize: 16,
  },
});
