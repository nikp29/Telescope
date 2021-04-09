import React, {useState} from 'react'
import {Text, View, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native' 
import { Button, Input } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import Spacer from "./Spacer";
import ImagePick from "./ImagePick";

var t = true;

const AccountInfo = () => {

    const [bio, setBio] = useState(""); 
    const [name, setName] = useState(""); 
    const [email, setEmail] = useState(""); 
    const [profilePic, setProfilePic] = useState({uri: ""}); 
    const [edit, setEdit] = useState(false);
    const [editText, setEditText] = useState("Edit Profile");

    if(t) {
        getInfo(setBio, setName, setEmail, setProfilePic);
        t = false;
        
    }
    
    return (
        <View >
            {/* <Text>Name: {name}</Text>
            <Text>Email: {email}</Text>
            <Text>Bio: {bio}</Text> */}
            <Image style={{ width: 200, height: 200 }} source={profilePic}/>
            <TextInput
                style={styles.textInput}
                label="bioText"
                value={name}
                onChange={newValue => {setName(newValue.nativeEvent.text);}}
                placeholder={"Name"}
                autoCapitalize="none"
                autoCorrect={false}
                editable={edit}
            />
            <TextInput
                style={styles.textInput}
                label="bioText"
                value={bio}
                onChange={newValue => {setBio(newValue.nativeEvent.text);}}
                placeholder={"Bio"}
                autoCapitalize="none"
                autoCorrect={false}
                editable={edit}
            />
            <Spacer/>
            <TouchableOpacity
                onPress={() => {
                    if(!edit) {
                        setEditText("Finish Editing");
                        setEdit(!edit);
                    } else {
                        setEditText("Edit Profile");
                        setEdit(!edit);
                    }
                    editInfo(name, bio);
                    // addComment(id, description);
                }}
            >
                <Text>{editText}</Text>
            </TouchableOpacity>
            <ImagePick
                setURL = {setProfilePic}
            />
        </View>
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

export default AccountInfo;

