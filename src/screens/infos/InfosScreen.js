import React from "react";
import { View, Text } from "react-native";
import InfosStyles from "../infos/Styles.js";
import Global from "../../components/estilos/Styles.js";

function InfosScreen() {
  return (
    <View style={Global.container}>
      <Text style={Global.message}>
        Como podemos ajudar?{"\n"}Contate nosso time: {"\n"}
        <Text style={InfosStyles.email}>{"\n"}petpodeoficial@gmail.com</Text>
      </Text>
    </View>
  );
}

export default InfosScreen;
