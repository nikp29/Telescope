import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import Feed from "../components/Feed";

const ReelScreen = ({ navigation }) => {
  return (
    <>
      <Text style={{ fontSize: 48 }}>ReelScreen</Text>
      <Feed />
      <Button
        title="Go to Reel Detail"
        onPress={() => navigation.navigate("ReelView")}
      />
    </>
  );
};

const styles = StyleSheet.create({});

export default ReelScreen;
