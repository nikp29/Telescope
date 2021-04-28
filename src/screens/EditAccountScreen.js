import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { Button, Input } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import ImagePick from "../components/ImagePick";
import InputField from "../components/InputField";
import { Context as AuthContext } from "../context/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { navigate } from "../navigationRef";

const AccountInfo = ({ route, navigation }) => {
  const [bio, setBio] = useState(navigation.getParam("bio"));
  const [name, setName] = useState(navigation.getParam("name"));
  const [tiktok, setTiktok] = useState(navigation.getParam("tiktok"));
  const [youtube, setYoutube] = useState(navigation.getParam("youtube"));
  const [instagram, setInstagram] = useState(navigation.getParam("instagram"));
  const updateList = navigation.getParam("func2");
  const [profilePic, setProfilePic] = useState(
    navigation.getParam("profilePic")
  );
  var expList = navigation.getParam("expList")
  const { signout } = useContext(AuthContext);

  return (
    <View
      style={{
        backgroundColor: "white",
        height: "100%",
        width: "100%",
        // alignItems: "center",
      }}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          // style={{ zIndex: 2 }}
          onPress={() => {
            updateList();
            navigation.goBack(null);
            console.log("going back");
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
      <KeyboardAwareScrollView
        style={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            style={{ width: 100, height: 100, borderRadius: 100 }}
            source={profilePic}
          />
          <ImagePick setURL={setProfilePic} />
          <TouchableOpacity
            onPress={() => {
                  navigate("EditExp", {
                    expList: expList,
                });
            }}
            style={styles.buttonSmall}
          >
            <Text style={styles.buttonStyleSmall}>Edit Experience</Text>
          </TouchableOpacity>
        </View>
        <InputField name="Name" value={name} setValue={setName} />
        <InputField name="Bio" value={bio} setValue={setBio} />
        <InputField name="YouTube" value={youtube} setValue={setYoutube} />
        <InputField
          name="Instagram"
          value={instagram}
          setValue={setInstagram}
        />
        <InputField name="TikTok" value={tiktok} setValue={setTiktok} />
      </KeyboardAwareScrollView>
      <View style={{ flexDirection: "row",
          justifyContent: "space-around" }}>
          <TouchableOpacity
            onPress={() => {
              editInfo(name, bio, youtube, tiktok, instagram)
                .then(() => {
                  console.log("hi");
                })
                .then(() => {
                  updateList();
                  navigate("ViewAccount", {
                    bio: bio,
                    name: name,
                    profilePic: profilePic,
                  });
                });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonStyle}>Finish Editing</Text>
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

  return;
};

AccountInfo.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const editInfo = async (name, bio, f, t, i) => {
  const uid = await AsyncStorage.getItem("token");
  // const userRef = firebase.firestore().collection("users");
  const userDoc = firebase.firestore().collection("users").doc(uid);
  if (bio)
    await userDoc
      .update({
        bio: bio,
      })
      .catch((error) => {
        console.error("Error editing document: ", error);
      });
  if (name){
    console.log("changing name");
    await userDoc
      .update({
        fullName: name,
      })
      .catch((error) => {
        console.error("Error editing document: ", error);
      });
    }
  if (f)
    await userDoc
      .update({
        youtube: f,
      })
      .catch((error) => {
        console.error("Error editing document: ", error);
      });
  if (t)
    await userDoc
      .update({
        tiktok: t,
      })
      .catch((error) => {
        console.error("Error editing document: ", error);
      });
  if (i)
    await userDoc
      .update({
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
    width: "100%",
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
    marginTop: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  backContainer: {
    padding: 8,
    marginLeft: 8,
    // backgroundColor: "orange"
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
    // backgroundColor: "white",
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 2
  },
  buttonStyleSmall: {
    color: "white",
    fontFamily: "Raleway-SemiBold",
    fontSize: 14,
  },
  buttonSmall: {
    width: 180,
    backgroundColor: "#5C33FF",
    padding: 5,
    borderRadius: 25,
    marginTop: 10,
    alignItems: "center"
  }
});

export default AccountInfo;
