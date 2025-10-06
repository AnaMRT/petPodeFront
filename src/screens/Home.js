import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, Keyboard, Modal, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import ScreenWrapper from "../components/ScreenWrapper";
import { Icon } from "react-native-elements";

export default function HomeScreen({ navigation }) {
  const [plantas, setPlantas] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [plantaSelecionada, setPlantaSelecionada] = useState(null);

  useEffect(() => { carregarPlantas(); }, []);

  const carregarPlantas = async () => {
    try { setCarregando(true); const response = await api.get("/plantas"); setPlantas(response.data); }
    catch (error) { console.error(error); }
    finally { setCarregando(false); }
  };

  const buscarPlantas = async () => {
    Keyboard.dismiss();
    if (!busca.trim()) { carregarPlantas(); return; }
    try {
      setCarregando(true);
      const token = await AsyncStorage.getItem("token");
      const response = await api.get("/plantas/search", { params: { termo: busca }, headers: { Authorization: `Bearer ${token}` } });
      setPlantas(response.data);
    } catch (error) { console.error(error); }
    finally { setCarregando(false); }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => { setPlantaSelecionada(item); setModalVisible(true); }} style={styles.card}>
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
      <TouchableOpacity style={styles.userIcon} onPress={() => navigation.openDrawer()}>
        
        <Icon
          name='Home'
        />
        {/* <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }} style={{ width: 30, height: 30 }} /> */}
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.titulo}>Buscar Planta</Text>

        <View style={styles.searchContainer}>
          <TextInput style={styles.input} placeholder="Busca" value={busca} onChangeText={setBusca} onSubmitEditing={buscarPlantas} />
          <TouchableOpacity onPress={buscarPlantas} style={styles.botaoBuscar}>
            <Text style={styles.botaoBuscarTexto}>Buscar</Text>
          </TouchableOpacity>
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
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20 },
  userIcon: { position: "absolute", top: 10, left: 10, zIndex: 1 },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  searchContainer: { flexDirection: "row", marginBottom: 15, alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 10, marginRight: 10 },
  botaoBuscar: { backgroundColor: "#4CAF50", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  botaoBuscarTexto: { color: "#fff", fontWeight: "bold" },
  linha: { justifyContent: "space-between", marginBottom: 15 },
  card: { flex: 1, backgroundColor: "#f9f9f9", borderRadius: 10, padding: 10, alignItems: "center", marginHorizontal: 5 },
  imagem: { width: 100, height: 100, borderRadius: 8, marginBottom: 8 },
  nome: { fontWeight: "bold", fontSize: 16, textAlign: "center" },
  nomeCientifico: { fontSize: 12, fontStyle: "italic", color: "#555", textAlign: "center" },
  toxica: { fontSize: 12, color: "red", textAlign: "center", marginTop: 4 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "90%", alignItems: "center" },
  imagemGrande: { width: 200, height: 200, borderRadius: 10, marginBottom: 10 },
  botaoFechar: { marginTop: 15, backgroundColor: "#4CAF50", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  botaoFecharTexto: { color: "#fff", fontWeight: "bold" },
});
