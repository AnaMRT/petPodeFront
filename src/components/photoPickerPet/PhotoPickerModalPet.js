import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import PhotoPickerPetStyles from "./Styles.js";
import Global from "../../components/estilos/Styles.js";

export default function PhotoPickerModalPet({
  visible,
  onClose,
  onPickGallery,
  onPickCamera,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={Global.overlay}>
        <View style={Global.modalContainerPhoto}>
          <Text style={PhotoPickerPetStyles.title}>Escolha uma foto do pet</Text>

          <View style={Global.options}>
            <TouchableOpacity onPress={onPickGallery} style={Global.button}>
              <Text style={Global.optionText}>Escolher da Galeria</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onPickCamera} style={Global.button}>
              <Text style={Global.optionText}>Tirar uma Foto</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} style={Global.closeButton}>
            <Text style={Global.closeText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}