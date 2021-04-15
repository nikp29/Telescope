import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Keyboard
} from "react-native";
import { Button, Input } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import ImagePick from "../components/ImagePick";
import InputField from "../components/InputField";
import { Context as AuthContext } from "../context/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const AccountInfo = ({ route, navigation }) => {
  const [bio, setBio] = useState(navigation.getParam("bio"));
  const [name, setName] = useState(navigation.getParam("name"));
  const [tiktok, setTiktok] = useState(navigation.getParam("tiktok"));
  const [youtube, setYoutube] = useState(navigation.getParam("youtube"));
  const [instagram, setInstagram] = useState(navigation.getParam("instagram"));
  const [profilePic, setProfilePic] = useState(
    navigation.getParam("profilePic")
  );
  const { signout } = useContext(AuthContext);
  

  return (
    <View
      style={{backgroundColor: "white", height: "100%", width: "100%", alignItems: "center"}}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{ zIndex: 2 }}
          onPress={() => {
            navigation.goBack(null);
          }}
          style={styles.backContainer}
        >
          <Text style={styles.uploadText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ zIndex: 2 }}
          onPress={signout}
          style={styles.backContainer}
        >
          <Text style={styles.uploadText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    <KeyboardAwareScrollView style={styles.container} resetScrollToCoords={{ x: 0, y: 0 }}>
      <View
        style={{alignItems: "center"}}
      >
        <Image style={{ width: 100, height: 100, borderRadius: 100 }} source={profilePic} />
        <ImagePick setURL={setProfilePic} />
      </View>
      <InputField
        name="Name"
        value={name}
        setValue={setName}
      />
      <InputField
        name="Bio"
        value={bio}
        setValue={setBio}
      />
      <InputField
        name="YouTube"
        value={youtube}
        setValue={setYoutube}
      />
      <InputField
        name="Instagram"
        value={instagram}
        setValue={setInstagram}
      />
      <InputField
        name="TikTok"
        value={tiktok}
        setValue={setTiktok}
      />
      </KeyboardAwareScrollView>
      <View
        styles={{ alignContent: "center", width: "100%"}}
      >
        <TouchableOpacity
          onPress={() => {
            const temp = navigation.getParam("func");
            editInfo(name, bio, youtube, tiktok, instagram)
              .then(() => {
                temp();
              })
              .then(() => {
                navigation.navigate("ViewAccount", {
                  bio: bio,
                  name: name,
                  profilePic: profilePic,
                });
              });
          }}
          style={styles.button}
        >
          <Text
            style={styles.buttonStyle}
          >Finish Editing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getInfo = async (setBio, setName, setProfilePic) => {
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

AccountInfo.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const editInfo = async (name, bio, f, t, i) => {
  const uid = await AsyncStorage.getItem("token");
  // const userRef = firebase.firestore().collection("users");
  firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .update({
      bio: bio,
      fullName: name,
      youtube: f,
      tiktok: t,
      instagram: i,
    })
    .catch((error) => {
      console.error("Error editing document: ", error);
    });
  return;
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    width: "100%"
    // backgroundColor: "white",
    // alignItems: "center",
    // width: "100%"
  },
  textInput: {
    color: "black",
  },
  buttonStyle: {
    color: "white",
    fontFamily: "Raleway-SemiBold",
    fontSize: 18,
  },
  button: {
    width: 150,
    backgroundColor: "#5C33FF",
    padding: 16,
    borderRadius: 25,
    marginTop: 16,
    alignItems: "center"
  },
  backContainer: {
    padding: 8,
    marginLeft: 8,
  },
  uploadText: {
    color: "#5C33FF",
    fontFamily: "Raleway-Bold",
    fontSize: 18,
  },
  topBar: {
    position: "absolute",
    top: 0,
    paddingTop: 45,
    backgroundColor: "white",
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    
  },
});

export default AccountInfo;
