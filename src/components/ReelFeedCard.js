import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import { View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { StyleSheet } from "react-native";
import { Text, Image } from "react-native-elements";
import Spacer from "./Spacer";
import { navigate } from "../navigationRef";
import Icon from "react-native-vector-icons/FontAwesome";

const ReelFeedView = ({ title, upvotes, image_url, youtube_id, id, data }) => {
  const [upvoted, setUpvoted] = useState(false);
  useEffect(() => {
    async function fetchUid() {
      const uid = await AsyncStorage.getItem("token");
      setUpvoted(upvotes.includes(uid));
    }
    fetchUid();
    return () => {
      null;
    };
  }, []);
  return (
    <TouchableOpacity
      onPress={() => {
        navigate("ReelView", { data: data });
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
                onPress={() => editVote(upvotes, id, setUpvoted)}
              >
                <View style={styles.upvoteView}>
                  <Icon
                    name={upvoted ? "star" : "star-o"}
                    size={30}
                    color="#FFD770"
                  />
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

const editVote = async (upvotes, id, setUpvoted) => {
  const uid = await AsyncStorage.getItem("token");
  const reelsRef = firebase.firestore().collection("reels");

  let new_upvotes = upvotes;
  if (upvotes.includes(uid)) {
    new_upvotes.splice(new_upvotes.indexOf(uid), 1);
    await reelsRef.doc(id).update({ upvotes: new_upvotes });
    setUpvoted(false);
  } else {
    // reel has not already been upvoted
    new_upvotes.push(uid);
    await reelsRef.doc(id).update({ upvotes: new_upvotes });
    setUpvoted(true);
  }
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
  upvoteView: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderColor: "#FFD770",
    borderWidth: 1,
    borderRadius: 8,
  },
});
export default ReelFeedView;
