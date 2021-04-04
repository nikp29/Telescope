import React, { useState, useCallback, useRef } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import YoutubePlayer from "react-native-youtube-iframe";
import { firebase } from "../firebase/config.js";
import { navigate } from "../navigationRef";

const ConfirmUploadScreen = (props) => {
  const { url, title, tags, thumbnail } = props.navigation.state.params;
  const [status, setStatus] = useState(false);
  const [ready, setReady] = useState(false);
  console.log(moment().unix().valueOf());

  return (
    <View>
      <View>
        <Text>Your new reel:</Text>
        <Text>Title: {title}</Text>
        <Text>Preview</Text>
      </View>
      <YoutubePlayer
        videoId={url}
        play={true} // control playback of video with true/false
        onReady={() => setReady(true)}
        onChangeState={(e) => setStatus(e)}
        height={219}
        forceAndroidAutoplay
      />
      <View>
        {tags == [] ? (
          <>
            <Text>Tags:</Text>
            <Text>
              {tags
                .map((item) => {
                  return "#" + item;
                })
                .join(", ")}
            </Text>
          </>
        ) : (
          <></>
        )}
        <Button
          title={"Confirm"}
          onPress={async () => {
            const reelsRef = firebase.firestore().collection("reels");
            const usersRef = firebase.firestore().collection("users");

            const uid = await AsyncStorage.getItem("token");
            await usersRef
              .doc(uid)
              .update({ lastUploaded: moment().unix().valueOf() });
            await reelsRef.add({
              timestamp: moment().unix().valueOf(),
              title: title,
              youtube_id: url,
              tags: tags,
              user: uid,
              thumbnail,
              upvotes: 0,
            });
            props.navigation.goBack(null);
            navigate("FeedScreen");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ConfirmUploadScreen;
