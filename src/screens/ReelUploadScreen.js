import React, { useContext, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import UploadForm from "./../components/UploadForm";
import { navigate } from "../navigationRef";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import moment from "moment";
import youtubeApi from "../api/youtube.js";

const ReelUploadScreen = () => {
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

const confirmUpload = async ({ url, tags, setError, description }) => {
  const usersRef = firebase.firestore().collection("users");
  const uid = await AsyncStorage.getItem("token");
  await usersRef
    .doc(uid)
    .get()
    .then(async (firestoreDocument) => {
      if (!firestoreDocument.exists) {
        setError("Error getting user information");
        return;
      }
      const data = firestoreDocument.data();
      if (data.hasOwnProperty("lastUploaded")) {
        // convert unix timestamp to moment
        const lastUploaded = data.lastUploaded;
        const current = moment().subtract(0, "d").unix().valueOf(); // limit 1 upload per day
        if (current > lastUploaded) {
          // if more than 24 hours has elapsed
          const response = await youtubeApi.get("/videos", {
            params: { id: url },
          });
          if (response && response.data.items[0]) {
            const thumbnail =
              response.data.items[0].snippet.thumbnails.standard.url;
            setError("");
            navigate("ConfirmUpload", {
              url,
              tags,
              thumbnail,
              description,
              username: data.fullName,
              uid,
            });
          } else {
            setError("invalid youtube video");
          }
        } else {
          setError(
            "You must wait 24 hours since your last post before posting a new reel"
          );
        }
      } else {
        const response = await youtubeApi.get("/videos", {
          params: { id: url },
        });
        if (response && response.data.items[0]) {
          const thumbnail =
            response.data.items[0].snippet.thumbnails.standard.url;
          setError("");
          navigate("ConfirmUpload", {
            url,
            tags,
            thumbnail,
            description,
            username: data.fullName,
            uid,
          });
        } else {
          setError("invalid youtube video");
        }
      }
    })
    .catch((error) => {
      setError(error.message);
    });
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

export default ReelUploadScreen;
