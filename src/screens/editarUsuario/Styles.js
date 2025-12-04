import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2C",
  },

  deleteButton: {
    backgroundColor: "#D9534F",
    borderRadius: 20,
    paddingVertical: 14,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButtonText: {
    color: "#fff",
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
  },

  deleteButtonLoading: {
    backgroundColor: "#ffdddd",
  },

  deleteButtonLoadingText: {
    color: "#D9534F",
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
  },
});
export default Styles;