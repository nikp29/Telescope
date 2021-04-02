import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-elements";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import { NavigationEvents } from "react-navigation";

const AccountScreen = ({ navigation }) => {
  const { signout } = useContext(AuthContext);

  return (
    <>
      <Text style={{ fontSize: 48 }}>ReelScreen</Text>
      <Button
        title="Go to Reel Detail"
        onPress={() => navigation.navigate("ReelView")}
      />
    </>
  );
};

const styles = StyleSheet.create({});

export default AccountScreen;
