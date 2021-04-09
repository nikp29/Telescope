import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { withNavigation } from "react-navigation";

const NavLink = ({ navigation, text, linkText, routeName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <TouchableOpacity onPress={() => navigation.navigate(routeName)}>
        <Text style={styles.link}> {linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  link: {
    fontFamily: "Raleway-Bold",
    color: "#FFD770",
    fontSize: 15,
  },
  text: {
    fontFamily: "Raleway-Bold",
    color: "#FFFFFF",
    fontSize: 15,
  },
});

export default withNavigation(NavLink);
