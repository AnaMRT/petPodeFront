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
    <View style={[Global.container, { alignItems: "center" }]}>
      <Text style={Global.message}>
        Como podemos ajudar?{"\n"}
        Contate nosso time:{"\n\n"}
      </Text>
      <TouchableOpacity onPress={copyEmail} onLongPress={openEmailApp}>
        <Text style={InfosStyles.email}>{email}</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 12, color: "#6D6D6D", marginTop: 10 }}>
        Toque para copiar • Pressione e segure para enviar e-mail
      </Text>
    </View>
  );
}

export default InfosScreen;