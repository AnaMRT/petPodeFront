import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Linking } from "react-native";
import InfosStyles from "../infos/Styles.js";
import Global from "../../components/estilos/Styles.js";

function InfosScreen() {
  const email = "petpodeoficial@gmail.com";
  const copyEmail = () => {
    Clipboard.setStringAsync(email);
    Alert.alert("Copiado!", "E-mail copiado para a área de transferência.");
  };

  const openEmailApp = () => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={Global.container}>
      <Text style={Global.message}>
        Como podemos ajudar?{"\n"}Contate nosso time: {"\n"}
        {"\n"}

        <TouchableOpacity onPress={copyEmail} onLongPress={openEmailApp}>
          <Text style={InfosStyles.email}>{email}</Text>
        </TouchableOpacity>

        {"\n\n"}
        <Text style={{ fontSize: 12, color: "#6D6D6D" }}>
          Toque para copiar • Pressione e segure para enviar e-mail
        </Text>
      </Text>
    </View>
  );
}

export default InfosScreen;