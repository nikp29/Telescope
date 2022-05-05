import React, { useState, useCallback, useRef } from "react";
import { View, StyleSheet, Text, Button, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment, { unix } from "moment";
import { firebase } from "../firebase/config.js";
import { navigate } from "../navigationRef";
import ReelView from "../components/ReelView";

const ConfirmUploadScreen = (props) => {
  const {
    url,
    tags,
    thumbnail,
    description,
    username,
    uid,
  } = props.navigation.state.params;
  const confirmUpload = async () => {
    const reelsRef = firebase.firestore().collection("reels");
    const usersRef = firebase.firestore().collection("users");

    const uid = await AsyncStorage.getItem("token");
    await usersRef.doc(uid).update({ lastUploaded: moment().unix().valueOf() });
    await reelsRef.add({
      timestamp: moment().unix().valueOf(),
      daystamp: getDaystamp(moment()),
      weekstamp: getWeekstamp(moment()),
      youtube_id: url,
      tags,
      user: uid,
      thumbnail,
      upvotes: [],
      comments: [],
      description,
      num_upvotes: 0,
    });
    props.navigation.goBack(null);
    navigate("Today");
  };

  return (
    <>
      <ReelView
        url={url}
        tags={tags}
        username={username}
        description={description}
        reel_uid={uid}
        autoplay={true}
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
        <TouchableOpacity
          style={{ zIndex: 2 }}
          onPress={() => {
            confirmUpload();
          }}
          style={styles.uploadContainer}
        >
          <Text style={styles.uploadText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </>
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

ConfirmUploadScreen.navigationOptions = () => {
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

export default ConfirmUploadScreen;
