import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard,
  Modal,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import ScreenWrapper from "../components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [plantas, setPlantas] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [plantaSelecionada, setPlantaSelecionada] = useState(null);

  useEffect(() => {
    carregarPlantas();
  }, []);

  const carregarPlantas = async () => {
    try {
      setCarregando(true);
      const response = await api.get("/plantas");
      setPlantas(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const buscarPlantas = async () => {
    Keyboard.dismiss();
    if (!busca.trim()) {
      carregarPlantas();
      return;
    }
    try {
      setCarregando(true);
      const token = await AsyncStorage.getItem("token");
      const response = await api.get("/plantas/search", {
        params: { termo: busca },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlantas(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setPlantaSelecionada(item);
        setModalVisible(true);
      }}
      style={styles.card}
    >
      <Image source={{ uri: item.imagemUrl }} style={styles.imagem} />
      <Text style={styles.nome}>{item.nomePopular}</Text>
      <Text style={styles.nomeCientifico}>{item.nomeCientifico}</Text>
      <Text style={styles.toxica}>
        {item.toxicaParaCaninos ? "Tóxica para cães " : ""}
        {item.toxicaParaFelinos ? "Tóxica para gatos" : ""}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Ícone do usuário + barra de busca */}
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconUserContainer}>
            <Ionicons name="person-circle-outline" color="#6B4226" size={40} />
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar planta"
              value={busca}
              onChangeText={setBusca}
              onSubmitEditing={buscarPlantas}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={buscarPlantas} style={styles.searchIcon}>
              <Ionicons name="search" size={20} color="#6B4226" />
            </TouchableOpacity>
          </View>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#00aa00" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={plantas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.linha}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: plantaSelecionada?.imagemUrl }} style={styles.imagemGrande} />
              <Text style={styles.nome}>{plantaSelecionada?.nomePopular}</Text>
              <Text style={styles.nomeCientifico}>{plantaSelecionada?.nomeCientifico}</Text>
              <Text style={{ marginVertical: 10 }}>{plantaSelecionada?.descricao}</Text>
              <Text style={styles.toxica}>
                {plantaSelecionada?.toxicaParaCaninos ? "Tóxica para cães " : ""}
                {plantaSelecionada?.toxicaParaFelinos ? "Tóxica para gatos" : ""}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.botaoFechar}>
                <Text style={styles.botaoFecharTexto}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9F3F6" },

  // Novo layout do ícone + barra de busca
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconUserContainer: {
    paddingRight: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    paddingLeft: 10,
  },

  linha: { justifyContent: "space-between", marginBottom: 15 },
  card: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  imagem: { width: 100, height: 100, borderRadius: 8, marginBottom: 8 },
  nome: { fontWeight: "bold", fontSize: 16, textAlign: "center" },
  nomeCientifico: { fontSize: 12, fontStyle: "italic", color: "#555", textAlign: "center" },
  toxica: { fontSize: 12, color: "red", textAlign: "center", marginTop: 4 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  imagemGrande: { width: 200, height: 200, borderRadius: 10, marginBottom: 10 },
  botaoFechar: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  botaoFecharTexto: { color: "#fff", fontWeight: "bold" },
});
