import React, { useContext, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import UploadForm from "./../components/UploadForm";
import { navigate } from "../navigationRef";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import moment from "moment";

const ReelUploadScreen = () => {
  const [error, setError] = useState("");
  return (
    <View style={styles.container}>
      <UploadForm
        headerText="Upload Your Reel"
        errorMessage={error}
        submitButtonText="Upload"
        onSubmit={async ({ url, title, tags }) => {
          const usersRef = firebase.firestore().collection("users");
          const uid = await AsyncStorage.getItem("token");
          console.log(uid);
          await usersRef
            .doc(uid)
            .get()
            .then((firestoreDocument) => {
              if (!firestoreDocument.exists) {
                setError("Error getting user information");
                return;
              }
              const data = firestoreDocument.data();
              console.log(data);
              if (data.hasOwnProperty("lastUploaded")) {
                // convert unix timestamp to moment
                const lastUploaded = moment.unix(data.lastUploaded);
                const current = moment().subtract(1, "d").unix(); // limit 1 upload per day
                if (current > lastUploaded) {
                  // if more than 24 hours has elapsed
                  navigate("ConfirmUpload");
                } else {
                  setError(
                    "You must wait 24 hours since your last post before posting a new reel"
                  );
                }
              } else {
                navigate("ConfirmUpload");
              }
            })
            .catch((error) => {
              setError(error.message);
            });
          // console.log(data);
          // if (!data) {
          //   setError("Unable to get user information");
          // } else if (data.hasOwnProperty("lastUploaded")) {
          //   // convert unix timestamp to moment
          //   const lastUploaded = moment.unix(data.lastUploaded);
          //   const current = moment().subtract(1, "d").unix(); // limit 1 upload per day
          //   if (current > lastUploaded) {
          //     // if more than 24 hours has elapsed
          //     navigate("ConfirmUpload");
          //   } else {
          //     setError(
          //       "You must wait 24 hours since your last post before posting a new reel"
          //     );
          //   }
          // } else {
          //   navigate("ConfirmUpload");
          // }
        }}
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
    flex: 1,
    justifyContent: "center",
    marginBottom: 250,
  },
});

export default ReelUploadScreen;
