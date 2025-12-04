import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F9F3F6",
  },

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
    borderColor: "#6B4226",
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2C2C2C",
    borderRadius: 16,
    paddingHorizontal: 10,
  },

  searchInput: {
    flex: 1,
    height: 40,
    color: "#6D6D6D",
    fontFamily: "Nunito_400Regular",
  },

  searchIcon: {
    paddingLeft: 10,
  },

  alerta: {
    color: "#D9534F",
    fontSize: 14,
    marginBottom: 15,
    marginLeft: 15,
    fontFamily: "Nunito_700Bold",
  },

  linha: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

export default styles;