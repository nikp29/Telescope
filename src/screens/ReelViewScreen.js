import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Input } from "react-native-elements";
import YoutubePlayer from "react-native-youtube-iframe";
import { Modalize } from "react-native-modalize";
import { Host, Portal } from "react-native-portalize";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import moment from "moment";
import ReelView from "../components/ReelView";

const ReelViewScreen = (props) => {
  const { data } = props.navigation.state.params;
  const [username, setUsername] = useState("");
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState([]);
  useEffect(() => {
    (async () => {
      let user_name = "";
      await firebase
        .firestore()
        .collection("users")
        .doc(data.user)
        .get()
        .then((doc) => {
          const data_ = doc.data();
          user_name = data_.fullName;
        })
        .catch((error) => {
          console.log(error.message);
        });
      setUsername(user_name);
      setUpvotes(data.upvotes);
    })();
  }, []);

  return (
    <>
      <ReelView
        url={data.youtube_id}
        tags={data.tags}
        description={data.description}
        username={username}
        reel_uid={data.user}
        id={data.id}
        upvotes={upvotes}
        setUpvotes={setUpvotes}
        showComments={true}
      />
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{ zIndex: 2 }}
          onPress={() => {
            props.navigation.goBack(null);
          }}
          style={styles.backContainer}
        >
          <Text style={styles.uploadText}>Back</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const addComment = async (reel_id, description, setComment) => {
  console.log("add to " + reel_id);
  console.log(description);
  if (description == "") {
    console.log("empty");
    return;
  }
  console.log(description);
  const uid = await AsyncStorage.getItem("token");
  firebase
    .firestore()
    .collection(`reels/${reel_id}/comments`)
    .add({
      user: uid,
      description: description,
      timestamp: moment().unix().valueOf(),
      upvotes: [],
      reel_id,
    })
    .then((docRef) => {
      setComment("");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  return;
};

const getComments = async (id, setComments) => {
  let comments = [];
  await firebase
    .firestore()
    .collection(`reels/${id}/comments`)
    .orderBy("upvotes", "desc")
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      comments = querySnapshot.docs.map((doc) => {
        let data_ = doc.data();
        data_["id"] = doc.id;
        return data_;
      });
    });
  setComments(comments);
};

ReelViewScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};
const styles = StyleSheet.create({
  topBar: {
    position: "absolute",
    top: 0,
    paddingTop: 45,
    backgroundColor: "white",
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uploadContainer: {
    padding: 8,
    marginRight: 8,
  },
  backContainer: {
    padding: 8,
    marginLeft: 8,
  },
  uploadText: {
    color: "#5C33FF",
    fontFamily: "Raleway-Bold",
    fontSize: 18,
  },
});

export default ReelViewScreen;
