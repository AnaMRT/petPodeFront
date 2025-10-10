import React, { useState, useEffect, useContext } from "react";
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
import { UserContext } from "../context/UserContext"; // 👈 importa o contexto do usuário

export default function HomeScreen({ navigation }) {
  const [plantas, setPlantas] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [plantaSelecionada, setPlantaSelecionada] = useState(null);

  const { userPhoto } = useContext(UserContext); // 👈 obtém a foto do usuário do contexto

  useEffect(() => {
    carregarPlantas();
  }, []);

  const carregarPlantas = async () => {
    try {
      setCarregando(true);
      const response = await api.get("/plantas");
      setPlantas(response.data);
    } catch (error) {
      console.error("Erro ao carregar plantas:", error);
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
      console.error("Erro na busca:", error);
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
      <View style={styles.textBox}>
        <Text style={styles.nome}>{item.nomePopular}</Text>
        <Text style={styles.nomeCientifico}>{item.nomeCientifico}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* 🔍 Barra de busca + imagem do usuário */}
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconUserContainer}>
            <Image
              source={
                userPhoto
                  ? { uri: userPhoto }
                  : require("../../assets/user-placeholder.png")
              }
              style={styles.userPhoto}
            />
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="BUSCAR PLANTAS"
              placeholderTextColor="#999"
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

        {/* ⚠️ Alerta */}
        <Text style={styles.alerta}>Cuidado: algumas plantas podem ser tóxicas para seus pets!</Text>

        {/* 🌿 Lista de plantas */}
        {carregando ? (
          <ActivityIndicator size="large" color="#A3B18A" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={plantas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.linha}
            contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 5 }}
          />
        )}

        {/* 🌸 Modal de detalhes */}
        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: plantaSelecionada?.imagemUrl }} style={styles.imagemGrande} />
              <Text style={styles.nome}>{plantaSelecionada?.nomePopular}</Text>
              <Text style={styles.nomeCientifico}>{plantaSelecionada?.nomeCientifico}</Text>
              <Text style={styles.descricao}>{plantaSelecionada?.descricao}</Text>

              <Text style={styles.toxica}>
                {plantaSelecionada?.toxicaParaCaninos ? "🐶 Tóxica para cães\n" : ""}
                {plantaSelecionada?.toxicaParaFelinos ? "🐱 Tóxica para gatos" : ""}
              </Text>

              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.botaoFechar}>
                <Text style={styles.botaoFecharTexto}>FECHAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F9F3F6" },

  // 🔍 Barra de busca
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  iconUserContainer: {
    paddingRight: 10,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A3B18A",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#A3B18A",
    borderRadius: 16,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#333",
    fontFamily: "Nunito_400Regular",
  },
  searchIcon: {
    paddingLeft: 10,
  },

  // ⚠️ Alerta
  alerta: {
    color: "#D9534F",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  // 🌿 Lista
  linha: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#A3B18A",
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  imagem: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textBox: {
    paddingVertical: 8,
    alignItems: "center",
  },
  nome: {
    fontWeight: "bold",
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    textAlign: "center",
    color: "#2C2C2C",
    textTransform: "uppercase",
  },
  nomeCientifico: {
    fontSize: 12,
    fontStyle: "italic",
    fontFamily: "Nunito_400Regular",
    color: "#6D6D6D",
    textAlign: "center",
    marginTop: 2,
  },

  // 🌸 Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
  },
  imagemGrande: {
    width: 220,
    height: 220,
    borderRadius: 12,
    marginBottom: 10,
  },
  descricao: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    color: "#333",
  },
  toxica: {
    fontSize: 13,
    color: "#D9534F",
    textAlign: "center",
    marginTop: 4,
  },
  botaoFechar: {
    marginTop: 15,
    backgroundColor: "#6B4226",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  botaoFecharTexto: {
    color: "#fff",
    fontFamily: "Nunito_400Regular",
    fontWeight: "bold",
  },
});
