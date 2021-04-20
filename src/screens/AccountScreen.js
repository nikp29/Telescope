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
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import { LinearGradient } from "expo-linear-gradient";
import Profile from "../components/Profile";
import { NavigationEvents } from "react-navigation";

const AccountScreen = (props) => {
  const defaultImage = require("../../assets/icons/user.png");
  const { signout } = useContext(AuthContext);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [youtube, setYoutube] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [instagram, setInstagram] = useState("");
  const [profilePic, setProfilePic] = useState(defaultImage);
  const [reelList, setReelList] = useState([]);
  const [expList, setExpList] = useState([]);

  useEffect(() => {
    getInfo(
      setBio,
      setName,
      setEmail,
      setProfilePic,
      setYoutube,
      setTiktok,
      setInstagram
    );
    getReelList(setReelList);
    getExpList(setExpList);
    return () => {
      null;
    };
  }, []);
  const update = () => {
    getInfo(
      setBio,
      setName,
      setEmail,
      setProfilePic,
      setYoutube,
      setTiktok,
      setInstagram
    );
  };

  // if (email == "") {
  //   getInfo(
  //     setBio,
  //     setName,
  //     setEmail,
  //     setProfilePic,
  //     setYoutube,
  //     setTiktok,
  //     setInstagram
  //   );
  //   getReelList(setReelList);
  // }

  return (
    <>
      <NavigationEvents onDidFocus={(event) => update()} />
      <Profile
        isOwn={true}
        reelList={reelList}
        update={update}
        bio={bio}
        name={name}
        profilePic={profilePic}
        youtube={youtube}
        instagram={instagram}
        tiktok={tiktok}
        navigation={props.navigation}
        expList={expList}
      />
    </>
  );
};



AccountScreen.navigationOptions = () => {
  return {
    header: () => true,
  };
};

const getInfo = async (
  setBio,
  setName,
  setEmail,
  setProfilePic,
  setYoutube,
  setTiktok,
  setInstagram
) => {
  var imageURL = false;
  const uid = await AsyncStorage.getItem("token");
  const userRef = firebase.firestore().collection("users");
  var storageRef = firebase.storage().ref();

  firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .get()
    .then((doc) => {
      setBio(doc.data().bio);
      setName(doc.data().fullName);
      setEmail(doc.data().email);
      setYoutube(doc.data().youtube);
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

const getReelList = async (setReelList) => {
  const uid = await AsyncStorage.getItem("token");
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
    });
};

const getExpList = async (setExpList) => {
  const uid = await AsyncStorage.getItem("token");
  console.log("getting exp");
  const expRef = firebase.firestore().collection("users").doc(uid).collection("experiences");
  let expList_ = [];
  let reel_id = "";
  expRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data_ = doc.data();
        data_["id"] = doc.id;
        console.log("exp doc id " + doc.id);
        expList_.push(data_);
      });
      setExpList(expList_);
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
    fontFamily: "Raleway-Bold",
    fontSize: 32,
    fontWeight: "bold",
  },
  bio: {
    fontFamily: "Raleway-Regular",
    fontSize: 16,
    color: "#545454",
    fontWeight: "normal",
  },
  reels: {
    fontFamily: "Raleway-Regular",
    fontSize: 14,
    fontWeight: "normal",
  },
  icon: {
    height: 20,
    width: 20,
  },
});

export default AccountScreen;
