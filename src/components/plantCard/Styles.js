import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#A3B18A",
    alignItems: "center",
    marginHorizontal: 5,
    position: "relative",
    borderRadius: 6,
  },

  imagem: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },

  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },

  textBox: {
    paddingVertical: 5,
    alignItems: "center",
  },
});

export default styles;