import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 60) / 2;

const Styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  message: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6B4226",
    fontFamily: "Nunito_400Regular",
    marginBottom: 30,
  },

  addButton: {
    backgroundColor: "#6B4226",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignSelf: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Nunito_400Regular",
  },

  petCard: {
    width: CARD_SIZE,
    height: CARD_SIZE + 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    borderWidth: 1,
    borderColor: "#A3B18A",
    borderRadius: 6,
  },

  petImage: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: "#C4C4C4",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },

  petName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#6B4226",
    textAlign: "center",
  },

  addCard: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#A3B18A",
    backgroundColor: "#fff9f6",
  },

  addText: {
    fontSize: 16,
    color: "#6B4226",
    fontWeight: "bold",
  },

  deleteIcon: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  editIcon: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});

export default Styles;
