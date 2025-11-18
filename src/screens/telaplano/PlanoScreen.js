import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import PlanoStyles from "./Styles.js";
import Global from "../../components/estilos/Styles.js";

export default function PlanoScreen() {
  return (
    <ScrollView contentContainerStyle={PlanoStyles.container}>
      <View style={PlanoStyles.card}>
        <View style={PlanoStyles.header}>
          <Text style={PlanoStyles.headerText}>MENSAL</Text>
        </View>

        <View style={PlanoStyles.content}>
          <Text style={PlanoStyles.item}>• Biblioteca de Plantas;</Text>
          <Text style={PlanoStyles.item}>• 20% de desconto com veterinários parceiros;</Text>
          <Text style={PlanoStyles.item}>• 15% de desconto com lojas parceiras;</Text>
          <Text style={PlanoStyles.item}>• Pode usar offline;</Text>
          <Text style={PlanoStyles.item}>• Cancele a qualquer momento.</Text>

          <Text style={PlanoStyles.price}>Plano ativo: R$ 8,90 / mês</Text>

          <TouchableOpacity style={PlanoStyles.button} disabled>
            <Text style={Global.buttonText}>ASSINATURA ATIVA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
