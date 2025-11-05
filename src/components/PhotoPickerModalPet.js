import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function PhotoPickerModalPet({
  visible,
  onClose,
  onPickGallery,
  onPickCamera,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Escolha uma foto do pet</Text>

          <View style={styles.options}>
            <TouchableOpacity onPress={onPickGallery} style={styles.button}>
              <Text style={styles.optionText}>Escolher da Galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onPickCamera} style={styles.button}>
              <Text style={styles.optionText}>Tirar uma Foto</Text>
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
    marginBottom: 20,
    color: "#6B4226",
    textAlign: "center",
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
