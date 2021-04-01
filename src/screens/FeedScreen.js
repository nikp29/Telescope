import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";

const ReelScreen = ({ navigation }) => {
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

export default ReelScreen;
