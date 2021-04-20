import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import { View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { StyleSheet, ImageBackground } from "react-native";
import { Text, Image } from "react-native-elements";
import Spacer from "./Spacer";
import { navigate } from "../navigationRef";
import Icon from "react-native-vector-icons/FontAwesome";
import ProfileIcon from "./ProfileIcon";
import { NavigationEvents } from "react-navigation";

const DiscussionFeedView = ({
  title,
  description,
  data,
  id,
  not_touchable,
  num_comments,
  padding,
}) => {
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState([]);
  let padding_ = padding ? 16 : 0;
  async function fetchUid() {
    const uid = await AsyncStorage.getItem("token");
    const discussionsRef = firebase.firestore().collection("discussions");
    discussionsRef
      .doc(id)
      .get()
      .then((doc) => {
        const data = doc.data();
        setUpvoted(data.upvotes.includes(uid));
        setUpvotes(data.upvotes);
      })
      .catch((error) => console.log(error.message));
  }
  useEffect(() => {
    fetchUid();
    return () => {
      null;
    };
  }, []);
  return (
    <TouchableOpacity
      onPress={() => {
        navigate("DiscussionView", {
          data: data,
          upvoted,
          setUpvoted,
          upvotes,
          setUpvotes,
          editVote,
        });
      }}
      disabled={not_touchable}
      style={{ paddingLeft: padding_, paddingRight: padding_ }}
    >
      <NavigationEvents onWillFocus={(payload) => fetchUid()} />
      <View style={styles.container}>
        <View style={styles.profilecontainer}>
          <ProfileIcon uid={data.discussion_uid} />
        </View>
        <View style={styles.TextContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.bottomRow}>
            <TouchableWithoutFeedback>
              <TouchableOpacity
                onPress={() => editVote(upvotes, id, setUpvoted)}
              >
                <View style={styles.upvoteView}>
                  <Icon
                    name={upvoted ? "heart" : "heart-o"}
                    size={20}
                    color={upvoted ? "#FFD770" : "#999999"}
                  />
                  <Text style={styles.text}>{upvotes.length}</Text>
                </View>
              </TouchableOpacity>
            </TouchableWithoutFeedback>
            <View style={styles.upvoteView}>
              <Icon name={"comment-o"} size={20} color={"#999999"} />
              <Text style={styles.text}>{num_comments}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const editVote = async (upvotes, id, setUpvoted) => {
  const uid = await AsyncStorage.getItem("token");
  const discussionsRef = firebase.firestore().collection("discussions");
  console.log("hi");
  let new_upvotes = upvotes;
  if (upvotes.includes(uid)) {
    new_upvotes.splice(new_upvotes.indexOf(uid), 1);
    await discussionsRef
      .doc(id)
      .update({ upvotes: new_upvotes, num_upvotes: upvotes.length });
    setUpvoted(false);
  } else {
    // discussion has not already been upvoted
    new_upvotes.push(uid);
    await discussionsRef
      .doc(id)
      .update({ upvotes: new_upvotes, num_upvotes: upvotes.length });
    setUpvoted(true);
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    width: "100%",
    padding: 0,
    borderBottomWidth: 2,
    borderBottomColor: "#E5E5E5",
    paddingBottom: 16,
    paddingTop: 16,
  },
  profilecontainer: {
    flexDirection: "column",
    alignContent: "flex-start",
    paddingRight: 8,
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
    color: "#999999",
    fontFamily: "Raleway",
    paddingLeft: 4,
    fontSize: 11,
  },
  upvoteView: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    paddingTop: 8,
    // borderColor: "#FFD770",
    // borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
  },
  title: {
    fontFamily: "Raleway-Bold",
    fontSize: 13,
    paddingTop: 6,
    paddingBottom: 8,
  },
  description: {
    fontFamily: "Raleway-Regular",
    fontSize: 13,
    color: "#86878B",
  },
  bottomRow: {
    padding: 0,
    flexDirection: "row",
  },
});
export default DiscussionFeedView;
