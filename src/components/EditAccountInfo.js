import React, {useState} from 'react'
import {Text, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native' 
import { Button, Input } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import Spacer from "./Spacer";
import { set } from 'react-native-reanimated';

var t = true;

const EditAccountInfo = () => {
    const [bio, setBio] = useState(); 
    const [edit, setEdit] = useState(false);
    const [editText, setEditText] = useState("Edit Profile");
    if(t) {
        getBio(setBio);
        t = false;
    }

    return (
        <View>
            <TextInput
                style={styles.textInput}
                label="bioText"
                value={bio}
                onChange={newValue => {setBio(newValue.nativeEvent.text);}}
                placeholder={"bio"}
                autoCapitalize="none"
                autoCorrect={false}
                editable={edit}
            />

            <TouchableOpacity
                onPress={() => {
                    editBio(bio);
                    // addComment(id, description);
                }}
            >
                <Text>Edit Bio</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    if(!edit) {
                        setEditText("Finish Editing");
                        setEdit(!edit);
                    } else {
                        setEditText("Edit Profile");
                        setEdit(!edit);
                    }
                    // addComment(id, description);
                }}
            >
                <Text>{editText}</Text>
            </TouchableOpacity>
            <Spacer/>
            <View>
                {/* <Text>Bio: {bio}</Text> */}
            </View>
        </View>
    );
};

const getBio = async (setBio) => {
    var temp = "";
    const uid = await AsyncStorage.getItem("token");
    const userRef = firebase.firestore().collection("users");
    firebase.firestore().collection("users").doc(uid).get()
    .then((doc) => {
        console.log(doc.data());
        temp = doc.data().bio;
        setBio(temp);
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

const editBio = async (description) => {
    console.log("description" +description);
    
    const uid = await AsyncStorage.getItem("token");
    // const userRef = firebase.firestore().collection("users");
    firebase.firestore().collection("users").doc(uid).update({
        bio: description
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

export default EditAccountInfo;