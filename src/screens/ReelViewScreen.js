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
import CommentCard from "../components/CommentCard";

const ReelViewScreen = (props) => {
  const { data } = props.navigation.state.params;
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
  if (initialGet == false) {
    setInitialGet(true);
    getComments(data.id, setComments);
  }
  const onOpen = () => {
    modalizeRef.current?.open();
  };
  return (
    <>
      <Text style={{ fontSize: 48 }}>{data.title}</Text>
      <YoutubePlayer
        videoId={data.youtube_id}
        play={true} // control playback of video with true/false
        onReady={() => setReady(true)}
        onChangeState={(e) => setStatus(e)}
        height={219}
        forceAndroidAutoplay
      />
      <Text>{data.description}</Text>
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
                  addComment(data.id, comment, setComment);
                  getComments(data.id, setComments);
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
            keyExtractor={(data) => data.id}
            renderItem={({ item }) => {
              return <CommentCard data={item} uid={uid} />;
            }}
          />
        </Modalize>
      </Portal>
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

const styles = StyleSheet.create({});

export default ReelViewScreen;
