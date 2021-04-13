import React, { useContext,useState } from "react";
import {StatusBar, Text, View, StyleSheet, TextInput, 
  TouchableOpacity, Image, Linking, 
  Dimensions, ScrollViewComponent} from 'react-native' 
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
  const [facebook, setFacebook] = useState(""); 
  const [tiktok, setTiktok] = useState(""); 
  const [instagram, setInstagram] = useState(""); 
  const [profilePic, setProfilePic] = useState({uri: ""}); 

  const update = () => {
    getInfo(setBio, setName, setEmail, setProfilePic, setFacebook, setTiktok, setInstagram);
  }

  if(email == "") {
      getInfo(setBio, setName, setEmail, setProfilePic, setFacebook, setTiktok, setInstagram);
  } 

  return (
    <View style={{flex: 1,
    flexDirection: 'column',
    // position: 'absolute',
    zIndex: 0,
    height: "100%",
    backgroundColor: "white",
    height: "100%",
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    overflow: "scroll"}}>
      <View style={{backgroundColor: '#7D5BFC', zIndex: 1, position: "absolute", height: 175, width: '100%'}}>
      {/* <Spacer>
        <Button title="Sign Out" onPress={signout} />
      </Spacer> */}
      
      <TouchableOpacity
                style={{marginTop: 32}}
                onPress={() => { 
                                props.navigation.navigate('EditAccount', 
                                {bio: bio, 
                                  name: name, 
                                  profilePic: profilePic, 
                                  facebook: facebook, 
                                  instagram: instagram,
                                  tiktok: tiktok,
                                  func: update})
                }}
            >
                <Text>edit screen</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.container}>
      <View style={{height: 75}}></View>
      <Image style={{ width: 200, 
                height: 200, 
                borderBottomLeftRadius: 100,
                borderBottomRightRadius: 100,
                borderTopRightRadius: 100,
                borderTopLeftRadius: 100,
                zIndex: 1,}} 
                source={profilePic}/>
                <Text>Name: {name}</Text>
            <Text>Bio: {bio}</Text>
            <View style={styles.inline}>
            <TouchableOpacity
                onPress={() => {
                  if(facebook != "") {
                    Linking.openURL(facebook);
                 }
                }}
            >
              <Text>facebook    </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                  if(instagram != "") {
                    Linking.openURL(instagram);
                  }
                }}
            >
              <Text>instagram    </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                  if(tiktok != "") {
                    Linking.openURL(tiktok);
                  }
                }}
            >
              <Text>tiktok</Text>
            </TouchableOpacity>
            </View>
      </View>
            <Spacer/>
      {/* <Edit/> */}
      {/* <ImagePick/> */}
    </View>
  );
};

AccountScreen.navigationOptions = () => {
  return {
    header: () => true
  };
};

const getInfo = async (setBio, setName, setEmail, setProfilePic, setFacebook, setTiktok, setInstagram) => {
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
      setFacebook(doc.data().facebook);
      setTiktok(doc.data().tiktok);
      setInstagram(doc.data().instagram);
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
  return temp;
};


const styles = StyleSheet.create({
  textInput: {
   color: 'black',
  },
  imageCenter: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  container: {
    justifyContent: 'center',
    alignItems: 'center'
    // borderTopColor: "blue",
    // borderTopWidth: SCREEN_HEIGHT / 1100
  },
  topContainer:{
    flex:1,
    backgroundColor: 'blue',    
  },
  bottomContainer:{
    flex:1,
    backgroundColor: 'white'

},
  inline: {
    flexDirection:'row',
    flexWrap:'wrap'
  }
});

export default AccountScreen;
