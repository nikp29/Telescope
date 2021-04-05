import React, { useState } from "react";
import { View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { StyleSheet } from "react-native";
import { Text, Image } from "react-native-elements";
import Spacer from "./Spacer";
import { navigate } from "../navigationRef";
import Icon from "react-native-vector-icons/FontAwesome";

const ReelFeedView = ({ title, upvotes, image_url, youtube_id }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigate("ReelView", { id: youtube_id });
      }}
    >
      <View style={styles.container}>
        <View style={styles.horizontalContainer}>
          <View style={{ flex: 1 }}>
            <Image source={{ uri: image_url }} style={styles.image} />
          </View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 16,
            }}
          >
            <TouchableWithoutFeedback>
              <TouchableOpacity
                onPress={() => console.log("This is printed never")}
              >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    padding: 4,
                    borderColor: "#FFD770",
                    borderRadius: 8,
                  }}
                >
                  <Icon name="star" size={30} color="#FFD770" />
                  <Text style={styles.text}>{upvotes.length}</Text>
                </View>
              </TouchableOpacity>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      <Spacer />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "column",
    padding: 16,
    borderRadius: 8,
  },
  image: {
    // width: "90%",
    height: 180,
    width: null,
    flex: 1,
    borderRadius: 8,
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
  },
  text: {},
});
export default ReelFeedView;
