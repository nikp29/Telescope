import moment from "moment";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { firebase } from "../firebase/config.js";
import ProfileIcon from "../components/ProfileIcon";
import Icon from "react-native-vector-icons/FontAwesome";

const CommentCard = ({ data, uid }) => {
  const [user, setUser] = useState({});
  const [upvoted, setUpvoted] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const uid_ = data.user;
      const usersRef = firebase.firestore().collection("users");
      await usersRef
        .doc(uid_)
        .get()
        .then((firestoreDocument) => {
          let data = firestoreDocument.data();
          data["id"] = uid_;
          setUser(data);
        })
        .catch((error) => console.log(error.message));
    }
    setUpvoted(data.upvotes.includes(uid));
    fetchUser();
    return () => {
      null;
    };
  }, []);

  const time =
    moment.unix(data.timestamp).add(1, "d") > moment()
      ? moment.unix(data.timestamp).format("LT")
      : moment.unix(data.timestamp).format("MM/DD/YYYY");

  return (
    <View style={styles.commentCard}>
      <View style={styles.col1}>
        <ProfileIcon uid={data.user} />
      </View>
      <View style={styles.col2}>
        <Text style={styles.userText}>{user && user.fullName}</Text>
        <Text style={styles.description}>{data.description}</Text>
      </View>
      <View style={styles.col3}>
        <TouchableOpacity
          style={styles.upvoteBox}
          onPress={() => {
            editVote(data.upvotes, data.id, setUpvoted, data.reel_id, uid);
          }}
        >
          <Icon
            name={"heart"}
            size={30}
            color={upvoted ? "#FFD770" : "#999999"}
          />
          <Text style={styles.upvoteText}>{data.upvotes.length}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const editVote = async (upvotes, id, setUpvoted, reel_id, uid) => {
  const reelsRef = firebase.firestore().collection(`reels/${reel_id}/comments`);

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
  commentCard: {
    flexDirection: "row",
    width: "100%",
    padding: 16,
  },
  col1: {
    marginRight: 8,
  },
  col2: {
    flexDirection: "column",
    flex: 1,
    marginRight: 8,
  },
  col3: {
    flexDirection: "column",
    justifyContent: "center",
  },
  description: {
    fontFamily: "Raleway-Regular",
    fontSize: 15,
  },
  userText: {
    fontFamily: "Raleway-Regular",
    fontSize: 13,
    color: "#86878B",
  },
  upvoteBox: {
    flexDirection: "column",
    alignItems: "center",
  },
  upvoteText: {
    fontFamily: "Raleway-Regular",
    fontSize: 13,
    color: "#86878B",
  },
});

export default CommentCard;
