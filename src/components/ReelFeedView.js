import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { Text, Image } from "react-native-elements";
import Spacer from "./Spacer";
import { navigate } from "../navigationRef";

const ReelFeedView = ({ title, upvotes, image_url, youtube_id }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigate("ReelView", { id: youtube_id });
      }}
    >
      <View>
        <Text h4>{title}</Text>
        <View>
          <Image source={{ uri: image_url }} style={styles.image} />
          <Text> Upvotes: {upvotes.length} </Text>
        </View>
      </View>
      <Spacer />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
  },
  image: {
    width: 250,
    height: 120,
    borderRadius: 4,
    marginBottom: 5,
  },
  name: {
    fontWeight: "bold",
  },
});
export default ReelFeedView;
