import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function PlanoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>MENSAL</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.item}>• Biblioteca de Plantas;</Text>
          <Text style={styles.item}>• 20% de desconto com veterinários parceiros;</Text>
          <Text style={styles.item}>• 15% de desconto com lojas parceiras;</Text>
          <Text style={styles.item}>• Pode usar offline;</Text>
          <Text style={styles.item}>• Cancele a qualquer momento.</Text>

          <Text style={styles.price}>Plano ativo: R$ 8,90 / mês</Text>

          <TouchableOpacity style={styles.button} disabled>
            <Text style={styles.buttonText}>ASSINATURA ATIVA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A3B18A", // verde claro suave
    paddingVertical: 40,
  },
  card: {
    backgroundColor: "#F9F3F6",
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    backgroundColor: "#6B4226", // marrom
    paddingVertical: 15,
  },
  headerText: {
    color: "#FFF",
    fontSize: 25,
    textAlign: "center",
    fontFamily: "PlayfairDisplay_700Bold",
  },
  content: {
    padding: 20,
  },
  item: {
    fontSize: 20,
    color: "#2C2C2C",
    marginBottom: 6,
    fontFamily: "Nunito_400Regular",
  },
  price: {
    fontSize: 18,
    color: "#6B4226",
    marginTop: 15,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
  },
  button: {
    backgroundColor: "#6B4226",
    borderRadius: 12,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
  },
});
