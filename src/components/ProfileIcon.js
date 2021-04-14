import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { firebase } from "../firebase/config.js";
import { navigate } from "../navigationRef";

var t = true;

const ProfileIcon = ({ uid }) => {
  const defaultImage = require("../../assets/icons/user.png");

  const [uid_, setUid] = useState("");
  const [profilePic, setProfilePic] = useState(defaultImage);
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
    <TouchableOpacity
      style={styles.container}
      onPress={(event) => navigate("ProfileView", { uid: uid_ ? uid_ : uid })}
    >
      <Image style={{ width: 30, height: 30 }} source={profilePic} />
    </TouchableOpacity>
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
