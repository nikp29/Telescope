import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { firebase } from "../firebase/config.js";
import AsyncStorage from "@react-native-community/async-storage";

const ImagePick = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      console.log(result.uri);
      upload(result.uri);
    }
  };

  return (
    <View>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
    </View>
  );
}

const upload = async (image) => {
  console.log("image " + image);
  const response = await fetch(image);
  const blob = await response.blob();
  var storageRef = firebase.storage().ref();
  const uid = await AsyncStorage.getItem("token");
  var imageRef = storageRef.child( uid +'/profilepicture.jpg');
  imageRef.put(blob).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  })
  .then(() => {
    firebase.firestore().collection("users").doc(uid).update({
      pic: true
    });
  })
  .catch((e) => console.log('uploading image error => ', e));
  

};

export default ImagePick;