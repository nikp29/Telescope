import moment from "moment";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { firebase } from "../firebase/config.js";
import { Button, Input } from "react-native-elements";

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
    <View>
      <Text>{data.description}</Text>
      <Text>{time}</Text>
      <Text>{user && user.fullName}</Text>
      <TouchableOpacity
        onPress={() => {
          editVote(data.upvotes, data.id, setUpvoted, data.reel_id, uid);
        }}
      >
        <Text>{data.upvotes.length}</Text>
      </TouchableOpacity>
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

const styles = StyleSheet.create({});

export default CommentCard;
