import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import { View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { StyleSheet, ImageBackground } from "react-native";
import { Text, Image } from "react-native-elements";
import Spacer from "./Spacer";
import { navigate } from "../navigationRef";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "react-navigation-hooks";

const ReelFeedView = ({ title, image_url, youtube_id, id, data }) => {
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState([]);

  useEffect(() => {
    async function fetchUid() {
      const uid = await AsyncStorage.getItem("token");
      const reelsRef = firebase.firestore().collection("reels");
      reelsRef
        .doc(id)
        .get()
        .then((doc) => {
          const data = doc.data();
          setUpvoted(data.upvotes.includes(uid));
          setUpvotes(data.upvotes);
        })
        .catch((error) => console.log(error.message));
    }
    fetchUid();
    return () => {
      null;
    };
  }, []);
  return (
    <TouchableOpacity
      onPress={() => {
        navigate("ReelView", {
          data: data,
          upvoted,
          setUpvoted,
          upvotes,
          setUpvotes,
          editVote,
        });
      }}
    >
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: image_url }}
          style={styles.image}
          imageStyle={{ borderRadius: 5 }}
        >
          <View
            style={{
              flexDirection: "column-reverse",
              height: "100%",
              alignItems: "flex-end",
              justifyContent: "flex-start",
            }}
          >
            <TouchableWithoutFeedback>
              <TouchableOpacity
                onPress={() => editVote(upvotes, id, setUpvoted)}
              >
                <View style={styles.upvoteView}>
                  <Icon
                    name={"heart"}
                    size={30}
                    color={upvoted ? "#FFD770" : "#999999"}
                  />
                  <Text style={styles.text}>{upvotes.length}</Text>
                </View>
              </TouchableOpacity>
            </TouchableWithoutFeedback>
          </View>
        </ImageBackground>
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
    await reelsRef
      .doc(id)
      .update({ upvotes: new_upvotes, num_upvotes: upvotes.length });
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
    padding: 0,
    // borderRadius: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    // height: null,
    // width: 100,
    // width: null,
    // flex: 1,
    borderRadius: 5,
  },
  horizontalContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    height: "100%",
  },
  name: {
    fontWeight: "bold",
  },
  text: {
    color: "white",
    fontFamily: "Raleway",
  },
  upvoteView: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    // borderColor: "#FFD770",
    // borderWidth: 1,
    borderRadius: 8,
  },
});
export default ReelFeedView;
