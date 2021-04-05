import React, { useState, useCallback, useRef } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import moment, { unix } from "moment";
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
              daystamp: getDaystamp(moment()),
              weekstamp: getWeekstamp(moment()),
              title: title,
              youtube_id: url,
              tags: tags,
              user: uid,
              thumbnail,
              upvotes: [],
            });
            props.navigation.goBack(null);
            navigate("FeedScreen");
          }}
        />
      </View>
    </View>
  );
};

const getDaystamp = (moment_) => {
  // get unix days since jan 1st 1970
  return Math.floor(moment_.unix().valueOf() / 86400);
};

const getWeekstamp = (moment_) => {
  // get unix weeks since dec 29 monday 1969
  return Math.floor((Math.floor(moment_.unix().valueOf() / 86400) - 4) / 7);
};

const styles = StyleSheet.create({});

export default ConfirmUploadScreen;
