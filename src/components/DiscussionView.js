import moment from "moment";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from "../firebase/config.js";
import CommentCard from "./CommentCard";
import ProfileIcon from "./ProfileIcon";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationEvents } from "react-navigation";
import DiscussionFeedCard from "../components/DiscussionFeedCard";
import DiscussionCommentCard from "./DiscussionCommentCard.js";
import Spacer from "react-native-spacer";

const DiscussionView = ({ discussion_uid, showComments, id, height, data }) => {
  const [uid, setUid] = useState("");
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState([]);
  const [initialGet, setInitialGet] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [numComments, setNumComments] = useState(data.num_comments);
  const [upvotes, setUpvotes] = useState([]);
  const [author, setAuthor] = useState("");
  const [commenting, setCommenting] = useState(false);
  useEffect(() => {
    async function fetchUid() {
      const uid_ = await AsyncStorage.getItem("token");
      if (showComments) {
        const discussionsRef = firebase.firestore().collection("discussions");
        discussionsRef
          .doc(id)
          .get()
          .then((doc) => {
            const data = doc.data();
            setUpvoted(data.upvotes.includes(uid_));
            setUpvotes(data.upvotes);
          })
          .catch((error) => console.log(error.message));
      }
      setUid(uid_);
      firebase
        .firestore()
        .collection("users")
        .doc(discussion_uid)
        .get()
        .then((doc) => {
          const data = doc.data();
          setAuthor(data.fullName);
        })
        .catch((error) => console.log(error.message));
    }
    fetchUid();
    return () => {
      null;
    };
  }, []);
  if (initialGet == false) {
    setInitialGet(true);
    getComments(id, setComments);
  }
  let itemHeight = height ? height : "100%";
  let topPadding = height ? 0 : 90;
  let padding = height ? 0 : 16;
  let borderRad = height ? 0 : 8;
  let paddingBottom = commenting ? 82 : 0;
  return (
    <View
      style={{
        height: itemHeight,
        backgroundColor: "white",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 0,
        paddingTop: topPadding,
      }}
    >
      <NavigationEvents />
      <View styles={{ width: "50%" }}>
        <DiscussionFeedCard
          title={data.title}
          description={data.description}
          upvotes={data.upvotes}
          id={data.id}
          data={data}
          not_touchable={true}
          num_comments={numComments}
          padding
        />
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={comments}
            keyExtractor={(data) => {
              return data.id;
            }}
            renderItem={({ item }) => {
              return <DiscussionCommentCard data={item} uid={uid} />;
            }}
          />
        </ScrollView>
      </View>
      <Spacer>
        <View
          style={{
            marginBottom: paddingBottom,
            flexDirection: "row",
            backgroundColor: "#E5E5E5",
            padding: 16,
            paddingBottom: 24,
            alignItems: "center",
          }}
        >
          <TextInput
            style={styles.commentInput}
            placeholder={"Add a comment"}
            value={comment}
            onChangeText={setComment}
            autoCapitalize="none"
            onBlur={() => setCommenting(false)}
            onFocus={() => setCommenting(true)}
            autoCorrect={false}
            returnKeyType="send"
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
          />
          <TouchableOpacity
            onPress={() => {
              if (comment != "") {
                Keyboard.dismiss();
                setCommenting(false);
                addComment(
                  id,
                  comment,
                  setComment,
                  numComments,
                  setNumComments
                );
                getComments(id, setComments);
              }
            }}
          >
            <Icon name={"paper-plane"} size={24} color="rgba(0, 0, 0, .7)" />
          </TouchableOpacity>
        </View>
      </Spacer>
    </View>
  );
};

const addComment = async (
  discussion_id,
  description,
  setComment,
  num_comments,
  setNumComments
) => {
  if (description == "") {
    return;
  }
  const uid = await AsyncStorage.getItem("token");
  firebase
    .firestore()
    .collection(`discussions/${discussion_id}/comments`)
    .add({
      user: uid,
      description: description,
      timestamp: moment().unix().valueOf(),
      upvotes: [],
      num_upvotes: 0,
      discussion_id,
    })
    .then((docRef) => {
      setComment("");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  await firebase
    .firestore()
    .collection("discussions")
    .doc(discussion_id)
    .update({ num_comments: num_comments + 1 });
  setNumComments(num_comments + 1);
  console.log(num_comments + 1);
  return;
};

const editVote = async (upvotes, id, setUpvoted) => {
  const uid = await AsyncStorage.getItem("token");
  const discussionsRef = firebase.firestore().collection("discussions");

  let new_upvotes = upvotes;
  if (upvotes.includes(uid)) {
    new_upvotes.splice(new_upvotes.indexOf(uid), 1);
    await discussionsRef
      .doc(id)
      .update({ upvotes: new_upvotes, num_upvotes: new_upvotes.length });
    setUpvoted(false);
  } else {
    // discussion has not already been upvoted
    new_upvotes.push(uid);
    await discussionsRef
      .doc(id)
      .update({ upvotes: new_upvotes, num_upvotes: new_upvotes.length });
    setUpvoted(true);
  }
};

const getComments = async (id, setComments) => {
  let comments = [];
  await firebase
    .firestore()
    .collection(`discussions/${id}/comments`)
    .orderBy("timestamp", "asc")
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

const styles = StyleSheet.create({
  username: {
    fontFamily: "Raleway-ExtraBold",
    fontSize: 26,
    marginTop: 8,
  },
  description: {
    fontFamily: "Raleway-Regular",
    fontSize: 14,
    marginTop: 8,
  },
  tags: {
    flexDirection: "column",
    width: "100%",
    marginTop: 8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  commentRow: {
    flexDirection: "row-reverse",
    paddingLeft: 8,
    alignItems: "center",
  },
  topRow: {
    flexDirection: "row-reverse",
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: "center",
  },
  tagView: {
    flex: 1,
    marginRight: 8,
  },
  bottomRow: {
    flexDirection: "row-reverse",
    padding: 8,
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    fontFamily: "Raleway-Regular",
    color: "rgba(0, 0, 0, 0.9)",
    fontSize: 14,
  },
  commentInputContainer: {
    flex: 1,
    backgroundColor: "rgba(196, 196, 196, 0.7)",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "#E5E5E5",
    padding: 16,
    paddingBottom: 24,
    alignItems: "center",
  },
  commentModal: {
    flexDirection: "column",
  },
  upvoteBox: {
    flexDirection: "column",
    alignItems: "center",
    padding: 8,
    marginRight: -2,
  },
  upvoteText: {
    fontFamily: "Raleway-Regular",
    fontSize: 13,
    color: "#86878B",
  },
  adviceText: {
    marginTop: 16,
    padding: 16,
    fontFamily: "Raleway-Regular",
    fontSize: 15,
    color: "black",
  },
  header: {
    padding: 8,
    margin: 12,
  },
});

export default DiscussionView;
