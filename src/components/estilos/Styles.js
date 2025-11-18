import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  //Tela de login, Cdastro Usuario e Pet
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9F3F6",
  },
  title: {
    fontSize: 64,
    marginBottom: 100,
    textAlign: "center",
    fontFamily: "PlayfairDisplay_400Regular",
    color: "#2C2C2C",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
    fontFamily: "Nunito_400Regular",
    color: "#6D6D6D",
    backgroundColor: "#fff",
  },
  inputSenhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  //Tela Home talvez tela de plantcard tela favoritos
  cardVazio: {
    flex: 1,
    margin: 5,
    backgroundColor: "transparent",
  },
  scrollTopButton: {
    position: "absolute",
    bottom: 45,
    right: 25,
    backgroundColor: "#A3B18A",
    padding: 14,
    borderRadius: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
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
    position: "relative",
  },
  modalStar: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 5,
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
    color: "#2C2C2C",
    fontFamily: "Nunito_400Regular",
  },
  toxica: {
    fontSize: 14,
    color: "#D9534F",
    textAlign: "center",
    marginTop: 4,
    fontFamily: "Nunito_700Bold",
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
    fontFamily: "Nunito_700Bold",
  },
  nome: {
    fontFamily: "Nunito_700Bold",
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
  //tela pet e tela de favoritas
  titulo: {
    fontSize: 40,
    color: "#2C2C2C",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "PlayfairDisplay_700Bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#6B4226",
    fontFamily: "Nunito_400Regular",
    marginTop: 10,
  },
  message: {
    fontSize: 20,
    textAlign: "center",
    color: "#6B4226",
    fontFamily: "Nunito_700Bold",
    marginBottom: 30,
  },
  linha: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  //tela plano

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Nunito_500Medium",
  },
  //tela editar usuario
  containerEditar: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F3F6",
  },
  label: {
    marginBottom: 6,
    color: "#2C2C2C",
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
  },

  inputEditar: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#A3B18A",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#6B4226",
    borderRadius: 20,
    paddingVertical: 14,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  //tela de editar pet
  pickerContainer: {
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  picker: {
    color: "#6D6D6D",
  },
  //tela Photo Usuario
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "flex-end",
  },
  modalContainerPhoto: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  button: {
    backgroundColor: "#F4EDE4",
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
    color: "#6B4226",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 15,
    alignSelf: "center",
  },
  closeText: {
    color: "#6B4226",
    fontSize: 16,
  },
  //tela PlatCard
  
});

export default styles;
