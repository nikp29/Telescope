import moment from "moment";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Input } from "react-native-elements";
import { Modalize } from "react-native-modalize";
import { Host, Portal } from "react-native-portalize";
import YoutubePlayer from "react-native-youtube-iframe";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import CommentCard from "../components/CommentCard";

const ReelView = ({
  url,
  tags,
  description,
  username,
  reel_uid,
  showComments,
  id,
}) => {
  const [status, setStatus] = useState(false);
  const [ready, setReady] = useState(false);
  const [comment, setComment] = useState("");
  const [uid, setUid] = useState("");
  const [comments, setComments] = useState([]);
  const [initialGet, setInitialGet] = useState(false);
  useEffect(() => {
    async function fetchUid() {
      const uid = await AsyncStorage.getItem("token");
      setUid(uid);
    }
    fetchUid();
    return () => {
      null;
    };
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
      </View>
      <View>
        <Text style={styles.username}>{username}</Text>
        {description != "" && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
      {tags != [] && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FlatList
            scrollEnabled={true}
            horizontal
            style={styles.tags}
            data={tags}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const color = colors[tags.indexOf(item) % 3];
              console.log(color);
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
      {showComments && (
        <>
          <TouchableOpacity onPress={onOpen}>
            <Text>Comments</Text>
          </TouchableOpacity>
          <Portal>
            <Modalize
              ref={modalizeRef}
              modalTopOffset={100}
              FooterComponent={
                <View>
                  <Input
                    placeholder={"Add a comment"}
                    value={comment}
                    onChangeText={setComment}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      addComment(id, comment, setComment);
                      getComments(id, setComments);
                    }}
                  >
                    <Text>Send</Text>
                  </TouchableOpacity>
                </View>
              }
            >
              <Text>Comments</Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={comments}
                keyExtractor={(data) => id}
                renderItem={({ item }) => {
                  return <CommentCard data={item} uid={uid} />;
                }}
              />
            </Modalize>
          </Portal>
        </>
      )}
    </View>
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

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 16,
    paddingTop: 110,
  },
  video: {
    borderRadius: 8,
    overflow: "hidden",
    height: 650,
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
});

export default ReelView;
