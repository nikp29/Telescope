import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { firebase } from "../firebase/config.js";
import AsyncStorage from "@react-native-community/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";

const ImagePick = ({ setURL }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      upload(result.uri, setURL);
    }
  };

  return (
    <View>
      <TouchableOpacity
         onPress={pickImage}          
         style={styles.button}
      >
        
      <Text
        style={styles.buttonStyle}
      >Update Profile Picture</Text>
      </TouchableOpacity> 
    </View>
  );
};

const upload = async (image, setURL) => {
  const response = await fetch(image);
  const blob = await response.blob();
  var storageRef = firebase.storage().ref();
  const uid = await AsyncStorage.getItem("token");
  var imageRef = storageRef.child("profile_pictures/" + uid + ".jpg");
  imageRef
    .put(blob)
    .then((snapshot) => {})
    .then(() => {
      firebase.firestore().collection("users").doc(uid).update({
        pic: true,
      });
    })
    .then(() => {
      imageRef.getDownloadURL().then((url) => {
        setURL({ uri: url });
      });
    })
    .catch((e) => console.log("uploading image error => ", e));
};

const styles = StyleSheet.create({
  buttonStyle: {
    color: "white",
    fontFamily: "Raleway-SemiBold",
    fontSize: 14,
  },
  button: {
    width: 200,
    backgroundColor: "#5C33FF",
    padding: 5,
    borderRadius: 25,
    marginTop: 10,
    alignItems: "center"
  }
});

export default ImagePick;
