import React, {useState} from 'react'
import {Text, View, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native' 
import { Button, Input } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
// import Spacer from "./Spacer";
import ImagePick from "../components/ImagePick";

var t = false;


const AccountInfo = ({route, navigation}) => {
    const [bio, setBio] = useState(navigation.getParam('bio')); 
    const [name, setName] = useState(navigation.getParam('name'));
    const [tiktok, setTiktok] = useState(navigation.getParam('tiktok'));
    const [facebook, setFacebook] = useState(navigation.getParam('facebook'));
    const [instagram, setInstagram] = useState(navigation.getParam('instagram')); 
    const [profilePic, setProfilePic] = useState(navigation.getParam('profilePic')); 
    if(t) {
        getInfo(setBio, setName, setProfilePic)
        .then(() => {

        });
        t = false;
    }
    
    return (
        <View 
        style={{marginTop: 32}}>
            <Image style={{ width: 200, height: 200 }} source={profilePic}/>
            
            <TextInput
                style={styles.textInput}
                value={name}
                onChange={newValue => {setName(newValue.nativeEvent.text);
                console.log(name)}}
                placeholder={"Name"}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.textInput}
                value={bio}
                onChange={newValue => {setBio(newValue.nativeEvent.text);}}
                placeholder={"Bio"}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.textInput}
                value={facebook}
                onChange={newValue => {setFacebook(newValue.nativeEvent.text);}}
                placeholder={"facebook url"}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.textInput}
                value={tiktok}
                onChange={newValue => {setTiktok(newValue.nativeEvent.text);}}
                placeholder={"tiktok url"}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.textInput}
                value={instagram}
                onChange={newValue => {setInstagram(newValue.nativeEvent.text);}}
                placeholder={"instagram url"}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {/* <Spacer/> */}
            <TouchableOpacity
                onPress={() => {
                        const temp = navigation.getParam('func');
                        editInfo(name, bio, facebook, tiktok, instagram).then(()=> {
                            temp();                        
                        }).then(()=> {
                            navigation.navigate('ViewAccount', {bio: bio, name: name, profilePic: profilePic});
                        });
                }}
            >
                <Text>Finish Editing</Text>
            </TouchableOpacity>
            <ImagePick
                setURL = {setProfilePic}
            />
        </View>
    );
};

const getInfo = async (setBio, setName, setProfilePic) => {
    var imageURL = false;
    const uid = await AsyncStorage.getItem("token");
    const userRef = firebase.firestore().collection("users");
    var storageRef = firebase.storage().ref();

    firebase.firestore().collection("users").doc(uid).get()
    .then((doc) => {
        console.log(doc.data());
        setBio(doc.data().bio);
        setName(doc.data().fullName);
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

AccountInfo.navigationOptions = () => {
    return {
      header: () => false
    };
  };

const editInfo = async (name, bio, f, t, i) => {
    
    const uid = await AsyncStorage.getItem("token");
    // const userRef = firebase.firestore().collection("users");
    firebase.firestore().collection("users").doc(uid).update({
        bio: bio,
        fullName: name,
        facebook: f,
        tiktok: t,
        instagram: i
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

