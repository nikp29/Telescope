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
import { Input } from "react-native-elements";
import { Modalize } from "react-native-modalize";
import { Host, Portal } from "react-native-portalize";
import YoutubePlayer from "react-native-youtube-iframe";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import CommentCard from "../components/CommentCard";
import ProfileIcon from "../components/ProfileIcon";
import Icon from "react-native-vector-icons/FontAwesome";

const ReelView = ({
  url,
  tags,
  description,
  reel_uid,
  showComments,
  upvoteStuff,
  id,
}) => {
  const { upvoted, setUpvoted, upvotes, setUpvotes, editVote } = upvoteStuff;
  const [status, setStatus] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [ready, setReady] = useState(false);
  const [comment, setComment] = useState("");
  const [uid, setUid] = useState("");
  const [comments, setComments] = useState([]);
  const [initialGet, setInitialGet] = useState(false);
  const [upvoted_, setUpvoted_] = useState(upvoted);
  const [upvotes_, setUpvotes_] = useState(upvotes.length);

  useEffect(() => {
    (async () => {
      const uid_ = await AsyncStorage.getItem("token");
      setUid(uid_);
    })();
  }, []);
  const modalizeRef = useRef(null);
  if (initialGet == false && showComments) {
    setInitialGet(true);
    getComments(id, setComments);
  }
  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const colors = [
    "rgba(196, 196, 196, 0.7)",
    "rgba(255, 215, 112, 0.7)",
    "rgba(92, 51, 255, 0.6)",
  ];
  return (
    <View style={styles.container}>
      <View style={styles.video}>
        <YoutubePlayer
          videoId={url}
          play={true} // control playback of video with true/false
          onReady={() => setReady(true)}
          onChangeState={(e) => setStatus(e)}
          height={201}
          forceAndroidAutoplay
        />
        {showComments && (
          <TouchableOpacity
            style={styles.upvoteBox}
            onPress={() => {
              if (!upvoted) {
                setUpvotes_(upvotes_ - 1);
              } else {
                setUpvotes_(upvotes_ + 1);
              }
              setUpvoted_(!upvoted_);
              editVote(upvotes, id, setUpvoted);
            }}
          >
            {upvoted_ ? (
              <Icon name={"star"} size={20} color="#FFD770" />
            ) : (
              <Icon name={"star-o"} size={20} color="#FFD770" />
            )}
            <Text style={styles.upvoteText}>{upvotes_}</Text>
          </TouchableOpacity>
        )}
        <View style={styles.bottomContainer}>
          <View style={styles.topRow}>
            {showComments && (
              <TouchableOpacity onPress={onOpen}>
                <Icon
                  name={"commenting"}
                  size={30}
                  color="rgba(196, 196, 196, 0.7)"
                />
              </TouchableOpacity>
            )}
            {tags != [] && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tagView}
              >
                <FlatList
                  scrollEnabled={true}
                  horizontal
                  style={styles.tags}
                  data={tags}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const color = colors[tags.indexOf(item) % 3];
                    return (
                      <View
                        style={{
                          padding: 8,
                          backgroundColor: color,
                          borderRadius: 8,
                          marginRight: 16,
                        }}
                      >
                        <Text>{item}</Text>
                      </View>
                    );
                  }}
                />
              </ScrollView>
            )}
          </View>
          <View style={styles.bottomRow}>
            <ProfileIcon uid={reel_uid} />
            {showComments && (
              <TouchableOpacity
                style={styles.commentInputContainer}
                onPress={() => {
                  onOpen();
                  setCommenting(true);
                }}
              >
                <Text
                  style={styles.commentInput}
                  placeholder={"Add a comment"}
                  value={comment}
                  onChangeText={setComment}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="send"
                  editable={false}
                >
                  Add a comment
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View>
        {description != "" && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>

      {showComments && (
        <>
          <Portal>
            <Modalize
              modalStyle={{ backgroundColor: "#E5E5E5" }}
              ref={modalizeRef}
              modalTopOffset={100}
              onClose={() => {
                setCommenting(false);
              }}
              FooterComponent={
                <View style={styles.footer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder={"Add a comment"}
                    value={comment}
                    onChangeText={setComment}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="send"
                    autoFocus={commenting}
                    onEndEditing={() => {
                      setCommenting(false);
                    }}
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                      setCommenting(false);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (comment != "") {
                        Keyboard.dismiss();
                        setCommenting(false);
                        addComment(id, comment, setComment);
                        getComments(id, setComments);
                      }
                    }}
                  >
                    <Icon
                      name={"paper-plane"}
                      size={24}
                      color="rgba(0, 0, 0, .7)"
                    />
                  </TouchableOpacity>
                </View>
              }
            >
              <View style={styles.commentModal}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={comments}
                  keyExtractor={(data) => {
                    return data.id;
                  }}
                  renderItem={({ item }) => {
                    return <CommentCard data={item} uid={uid} />;
                  }}
                />
              </View>
            </Modalize>
          </Portal>
        </>
      )}
    </View>
  );
};

const addComment = async (reel_id, description, setComment) => {
  if (description == "") {
    console.log("empty");
    return;
  }
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

const editVote = async (upvotes, id, setUpvoted, setUpvotes) => {
  const uid = await AsyncStorage.getItem("token");
  const reelsRef = firebase.firestore().collection("reels");

  let new_upvotes = upvotes;
  if (upvotes.includes(uid)) {
    new_upvotes.splice(new_upvotes.indexOf(uid), 1);
    await reelsRef.doc(id).update({ upvotes: new_upvotes });
    setUpvoted(false);
    setUpvotes(new_upvotes);
  } else {
    // reel has not already been upvoted
    new_upvotes.push(uid);
    await reelsRef.doc(id).update({ upvotes: new_upvotes });
    setUpvoted(true);
    setUpvotes(new_upvotes);
  }
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

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 16,
    paddingTop: 90,
  },
  video: {
    borderRadius: 8,
    overflow: "hidden",
    height: "100%",
    backgroundColor: "black",
    flexDirection: "column",
    justifyContent: "center",
  },
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
    backgroundColor: "white",
    padding: 16,
    paddingBottom: 24,
    alignItems: "center",
  },
  commentModal: {
    flexDirection: "column",
    marginTop: 16,
  },
  upvoteBox: {
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    top: 0,
    right: 0,
    padding: 8,
  },
  upvoteText: {
    fontFamily: "Raleway-Regular",
    fontSize: 13,
    color: "#86878B",
  },
});

export default ReelView;
