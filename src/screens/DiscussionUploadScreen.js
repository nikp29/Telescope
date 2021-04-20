import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import DiscussionForm from "../components/DiscussionForm";
import { navigate } from "../navigationRef";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import moment from "moment";

const DiscussionUploadScreen = (props) => {
  const [error, setError] = useState("");

  const pushDiscusion = async ({ title, setError, description }) => {
    const discussionRef = firebase.firestore().collection("discussions");
    const uid = await AsyncStorage.getItem("token");
    await discussionRef
      .add({
        title: title,
        description: description,
        discussion_uid: uid,
        upvotes: [],
        num_upvotes: 0,
        timestamp: moment().unix().valueOf(),
      })
      .catch((error) => {
        setError(error.message);
      });
    navigate("DiscussionFeed");
  };
  return (
    <View style={styles.container}>
      <DiscussionForm
        headerText="Create Discussion"
        errorMessage={error}
        submitButtonText="Submit"
        onSubmit={pushDiscusion}
        setError={setError}
      />
    </View>
  );
};

ReelUploadScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginBottom: 250,
    height: "100%",
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "scroll",
  },
});

export default DiscussionUploadScreen;
