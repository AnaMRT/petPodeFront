import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import PlanoStyles from "./Styles.js";
import Global from "../../components/estilos/Styles.js";
import { PlanoContext } from "../../context/planoContext/PlanoContext.js"; 

export default function PlanoScreen() {
  const { isAssinante, assinarPlano, cancelarPlano } = useContext(PlanoContext); 

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

          {!isAssinante ? (
            <>
              <Text style={PlanoStyles.price}>R$ 8,90 / mês</Text>

              <TouchableOpacity style={PlanoStyles.button} onPress={assinarPlano}>
                <Text style={Global.buttonText}>ASSINAR AGORA</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={PlanoStyles.price}>Plano ativo: R$ 8,90 / mês</Text>

              <TouchableOpacity
                style={[PlanoStyles.button, { backgroundColor: "#ffdddd" }]}
                onPress={cancelarPlano}
              >
                <Text style={[Global.buttonText, { color: "#D9534F" }]}>
                  CANCELAR ASSINATURA
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}