import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F3F6",
  },

  headerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  photo: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#6B4226",
  },

  userInfo: {
    marginLeft: 15,
  },

  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B4226",
  },

  userEmail: {
    fontSize: 13,
    color: "#8A6E63",
    marginBottom: 4,
  },

  changeText: {
    fontSize: 12,
    color: "#6B4226",
    fontWeight: "600",
  },

  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#6B4226",
    marginVertical: 20,
  },

  menuItemRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },

  menuText: {
    fontSize: 16,
    color: "#2C2C2C",
  },

  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingLeft: 20,
    paddingBottom: 30,
  },

  bottomRowButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});

export default styles;