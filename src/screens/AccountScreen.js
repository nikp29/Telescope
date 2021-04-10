import React, { useContext,useState } from "react";
import {Text, View, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native' 
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import Info from "../components/AccountInfo";
import { Button, Input } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";




const AccountScreen = (props) => {
  const { signout } = useContext(AuthContext);
  const [bio, setBio] = useState(""); 
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [profilePic, setProfilePic] = useState({uri: ""}); 
  const [edit, setEdit] = useState(false);
  const [editText, setEditText] = useState("Edit Profile");
  const update = () => {
    getInfo(setBio, setName, setEmail, setProfilePic);
  }

  if(email == "") {
      getInfo(setBio, setName, setEmail, setProfilePic);
      // t = false;
  } 

  // if(props.navigation.getParam('name') != null) {
  //   setName(props.navigation.getParam('name'));
  // }
  // if(props.navigation.getParam('bio') != null) {
  //   setBio(props.navigation.getParam('bio'));
  // }
  // if(props.navigation.getParam('profilePic') != null) {
  //   setProfilePic(props.navigation.getParam('profilePic'));
  // }

  return (
    <>
      <Spacer>
        <Button title="Sign Out" onPress={signout} />
      </Spacer>
      <TouchableOpacity
                onPress={() => { props.navigation.navigate('EditAccount', {bio: bio, name: name, profilePic: profilePic, func: update})
                }}
            >
                <Text>edit screen</Text>
      </TouchableOpacity>
    
        <View >
            <Image style={{ width: 200, height: 200 }} source={profilePic}/>
            <Text>Name: {name}</Text>
            <Text>Bio: {bio}</Text>
            
            <Spacer/>
        </View>
      {/* <Edit/> */}
      {/* <ImagePick/> */}
    </>
  );
};

const getInfo = async (setBio, setName, setEmail, setProfilePic) => {
  var imageURL = false;
  const uid = await AsyncStorage.getItem("token");
  const userRef = firebase.firestore().collection("users");
  var storageRef = firebase.storage().ref();

  firebase.firestore().collection("users").doc(uid).get()
  .then((doc) => {
      console.log(doc.data());
      setBio(doc.data().bio);
      setName(doc.data().fullName);
      setEmail(doc.data().email);
      imageURL = doc.data().pic;
  }).then(() => {
      if(imageURL) {
          storageRef.child("profile_pictures/" + uid + '.jpg').getDownloadURL()
          .then((url) => {
              setProfilePic({uri: url});
              console.log("url is " + url);
          });
      }
  })
  .catch((error) => {
      console.error("Error fetching document: ", error);
  });
  // firebase.firestore().collection(`reels/${uid}`).get().then(function(snapshot) {
  //     if (snapshot.exists()) {
  //       console.log(snapshot.val());
  //       temp = snapshot.val().bio;
  //     }
  //     else {
  //       console.log("No data available");
  //     }
  // }).then((docRef) => {
  //     console.log("fetcbed Bio. ID: ", docRef.id);
  // }).catch((error) => {
  //     console.error("Error fetching document: ", error);
  // });
  return temp;
};

const editInfo = async (name, bio) => {
  
  const uid = await AsyncStorage.getItem("token");
  // const userRef = firebase.firestore().collection("users");
  firebase.firestore().collection("users").doc(uid).update({
      bio: bio,
      fullName: name,
  })
  .then(() => {
      console.log("Edited Bio.") ;
  }).catch((error) => {
      console.error("Error editing document: ", error);
  });
  return;
};

const styles = StyleSheet.create({
  textInput: {
   color: 'black',
  },
});

export default AccountScreen;
