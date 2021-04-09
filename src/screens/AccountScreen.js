import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-elements";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import Info from "../components/AccountInfo"
import Edit from "../components/EditAccountInfo"
import ImagePick from "../components/ImagePick"

const AccountScreen = () => {
  const { signout } = useContext(AuthContext);

  return (
    <>
      <Text style={{ fontSize: 48 }}>AccountScreen</Text>
      <Spacer>
        <Button title="Sign Out" onPress={signout} />
      </Spacer>
      <Info/>
      {/* <Edit/> */}
      {/* <ImagePick/> */}
    </>
  );
};

const styles = StyleSheet.create({});

export default AccountScreen;
