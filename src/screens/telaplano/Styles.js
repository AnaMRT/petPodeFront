import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A3B18A",
    paddingVertical: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    backgroundColor: "#F9F3F6",
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 12,
    backgroundColor: "#6B4226",
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
    margin: 10,
  },
  item: {
    fontSize: 20,
    color: "#2C2C2C",
    marginBottom: 6,
    fontFamily: "Nunito_400Regular",
  },
  price: {
    fontWeight: "600",
    fontSize: 18,
    color: "#6B4226",
    marginTop: 15,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
  },
  button: {
    backgroundColor: "#6B4226",
    borderRadius: 20,
    padding: 14,
  },
});

export default Styles;
