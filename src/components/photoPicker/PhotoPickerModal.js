import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { avatars } from "../../../assets/avatars/avatarList";
import PhotoPickerStyles from "./Styles.js";
import Global from "../../components/estilos/Styles.js";

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
      <View style={Global.overlay}>
        <View style={Global.modalContainerPhoto}>
          <Text style={PhotoPickerStyles.title}>{title}</Text>

          <Text style={PhotoPickerStyles.subtitle}>Avatares</Text>
          <FlatList
            horizontal
            data={avatars}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelectAvatar(item)}>
                <Image source={item} style={PhotoPickerStyles.avatar} />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />

          <View style={PhotoPickerStyles.options}>
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