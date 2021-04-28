import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  FlatList,
  ScrollView,
} from "react-native";
import Spacer from "../components/Spacer";
import { LinearGradient } from "expo-linear-gradient";
import ReelFeedCard from "../components/ReelFeedCard";
import { firebase } from "../firebase/config.js";
import { navigate } from "../navigationRef";

const ExperienceCard = ({
    title,
    description
}) => {
    
  return (
    <View
      style={styles.container}
    >
      <View
        style={{
          height: 35,
          width: 35,
          borderRadius: 10,
          backgroundColor: "#FFD770",
        }}
      ></View>
        {/* <LinearGradient
          colors={["#DFD7FF", "#7D5BFC"]}
          style={{
            // height: 212.5,
            width: "100%",
            height: "100%",
            flex: 1,
            // flexDirection: "row",
            zIndex: 0,
            aspectRatio: 16 / 9,
            // backgroundColor: "#DFD7FF",
            alignItems: "center",
            borderRadius: 5,
            // borderRadius: 25,
            // borderTopRightRadius: 0,
            // borderTopLeftRadius: 0,
          }}
        > */}
        <View
          style={{
            marginLeft: 15,
            marginRight: 25,
            justifyContent: "space-around"
          }}
        >
          <Text style={styles.title}>{title}</Text>
        </View>
        {/* <Text>Description: {description}</Text> */}
        {/* </LinearGradient> */}
    </View>
  );
};


const getProfilePic = async(setProfilePic, uid, imageURL) => {
    var storageRef = firebase.storage().ref();
    console.log("getting profilePic")
    if(imageURL == false) {
        return;
    }
    storageRef
    .child("profile_pictures/" + uid + ".jpg")
    .getDownloadURL()
    .then((url) => {
        console.log("url is " + url);
        setProfilePic({ uri: url });
    });
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
  },
  title: {
    fontFamily: "Raleway-Regular",
    fontSize: 16
  },
  topBar: {
    position: "absolute",
    top: 0,
    paddingTop: 45,
    backgroundColor: "rgba(0,0,0,0)",
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
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
    // alignItems: "center",
    width: "50%",
    // borderWidth: 10,
  },
  name: {
    fontFamily: "Raleway-Bold",
    fontSize: 32,
  },
  bio: {
    fontFamily: "Raleway-Regular",
    fontSize: 16,
    color: "#545454",
  },
  icon: {
    height: 20,
    width: 20,
    marginLeft: 10
  }
});

export default ExperienceCard;
