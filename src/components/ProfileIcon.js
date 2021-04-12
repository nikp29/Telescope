import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { firebase } from "../firebase/config.js";
var t = true;

const ProfileIcon = ({ uid }) => {
  const [uid_, setUid] = useState("");
  const [profilePic, setProfilePic] = useState({ uri: "" });
  const [username, setUsername] = useState("");
  useEffect(() => {
    (async () => {
      if (uid) {
        setUid(uid);
        getImage(setProfilePic, uid);
      } else {
        const uid_async = await AsyncStorage.getItem("token");
        setUid(uid_async);
        getImage(setProfilePic, uid_async);
      }
    })();
  }, []);
  return (
    <View style={styles.container}>
      <Image style={{ width: 30, height: 30 }} source={profilePic} />
    </View>
  );
};

const getImage = async (setProfilePic, uid) => {
  var imageURL = false;
  const userRef = firebase.firestore().collection("users");
  var storageRef = firebase.storage().ref();
  firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .get()
    .then((doc) => {
      const data = doc.data();
      imageURL = data.pic;
    })
    .then(() => {
      if (imageURL) {
        storageRef
          .child("profile_pictures/" + uid + ".jpg")
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            setProfilePic({ uri: url });
          });
      }
    })
    .catch((error) => {
      console.error("Error fetching document: ", error);
    });
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFD770",
    flexDirection: "row",
    overflow: "hidden",
    width: 30,
    height: 30,
  },
});

export default ProfileIcon;
