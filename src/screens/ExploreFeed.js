import React, { useContext, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import UploadForm from "../components/UploadForm";
import { navigate } from "../navigationRef";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import moment from "moment";
import youtubeApi from "../api/youtube.js";

const ExploreFeed = () => {
  const [error, setError] = useState("");
  return (
    <View style={styles.container}>
      <UploadForm
        headerText="Upload Your Reel"
        errorMessage={error}
        submitButtonText="Next"
        onSubmit={confirmUpload}
        setError={setError}
      />
    </View>
  );
};

ExploreFeed.navigationOptions = () => {
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

export default ExploreFeed;
