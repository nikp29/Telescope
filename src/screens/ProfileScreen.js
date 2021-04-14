import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  FlatList,
} from "react-native";
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import { firebase } from "../firebase/config.js";
import { LinearGradient } from "expo-linear-gradient";
import Profile from "../components/Profile";

const ProfileScreen = (props) => {
  const { uid } = props.navigation.state.params;
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [instagram, setInstagram] = useState("");
  const [profilePic, setProfilePic] = useState({ uri: "" });
  const [reelList, setReelList] = useState([]);
  useEffect(() => {
    getReelList(setReelList);
    return () => {
      null;
    };
  }, []);
  console.log(reelList);
  const update = () => {
    getInfo(
      setBio,
      setName,
      setEmail,
      setProfilePic,
      setFacebook,
      setTiktok,
      setInstagram,
      uid
    );
  };

  if (email == "") {
    getInfo(
      setBio,
      setName,
      setEmail,
      setProfilePic,
      setFacebook,
      setTiktok,
      setInstagram,
      uid
    );
    getReelList(setReelList, uid);
  }

  return (
    <Profile
      navigation={props.navigation}
      reelList={reelList}
      update={update}
      bio={bio}
      name={name}
      profilePic={profilePic}
      facebook={facebook}
      instagram={instagram}
      tiktok={tiktok}
    />
  );
};

ProfileScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const getInfo = async (
  setBio,
  setName,
  setEmail,
  setProfilePic,
  setFacebook,
  setTiktok,
  setInstagram,
  uid
) => {
  var imageURL = false;
  const userRef = firebase.firestore().collection("users");
  var storageRef = firebase.storage().ref();

  userRef
    .doc(uid)
    .get()
    .then((doc) => {
      setBio(doc.data().bio);
      setName(doc.data().fullName);
      setEmail(doc.data().email);
      setFacebook(doc.data().facebook);
      setTiktok(doc.data().tiktok);
      setInstagram(doc.data().instagram);
      imageURL = doc.data().pic;
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
  return temp;
};

const getReelList = async (setReelList, uid) => {
  const reelsRef = firebase.firestore().collection("reels");
  let reelList_ = [];
  let reel_id = "";
  reelsRef
    .where("user", "==", uid)
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data_ = doc.data();
        data_["id"] = doc.id;
        reelList_.push(data_);
      });
      setReelList(reelList_);
      console.log(reelList_.length);
    });
};

const styles = StyleSheet.create({
  textInput: {
    color: "black",
  },
  imageCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  inline: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
  },
  name: {
    fontFamily: "Raleway",
    fontSize: 32,
    fontWeight: "bold",
  },
  bio: {
    fontFamily: "Raleway",
    fontSize: 16,
    color: "#545454",
    fontWeight: "normal",
  },
  reels: {
    fontFamily: "Raleway",
    fontSize: 14,
    fontWeight: "normal",
  },
  icon: {
    height: 20,
    width: 20,
  },
});

export default ProfileScreen;
