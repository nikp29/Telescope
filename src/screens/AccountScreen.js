import React, { useContext,useState, useEffect } from "react";
import {StatusBar, Text, View, StyleSheet, TextInput, 
  TouchableOpacity, Image, Linking, 
  Dimensions, ScrollViewComponent,
  FlatList} from 'react-native' 
import Spacer from "../components/Spacer";
import { Context as AuthContext } from "../context/AuthContext";
import { Button, Input } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import { LinearGradient } from "expo-linear-gradient";
import ReelFeedCard from "../components/ReelFeedCard";


const AccountScreen = (props) => {
  const { signout } = useContext(AuthContext);
  const [bio, setBio] = useState(""); 
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [facebook, setFacebook] = useState(""); 
  const [tiktok, setTiktok] = useState(""); 
  const [instagram, setInstagram] = useState(""); 
  const [profilePic, setProfilePic] = useState({uri: ""}); 
  const [reelList, setReelList] = useState([]);
  // useEffect(() => {
  //   getInfo(setBio, setName, setEmail, setProfilePic, setFacebook, setTiktok, setInstagram);
  // });
  const update = () => {
    getInfo(setBio, setName, setEmail, setProfilePic, setFacebook, setTiktok, setInstagram);
  }

  if(email == "") {
      getInfo(setBio, setName, setEmail, setProfilePic, setFacebook, setTiktok, setInstagram);
      getReelList(setReelList);
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
      <View style={{zIndex: 1, position: "absolute", height: 212.5, width: '100%'}}>
                      
        <LinearGradient
          colors={["#ffffff", "#7D5BFC"]}
          style={{
            height: 212.5, 
            width: '100%',
            borderBottomLeftRadius: 25, 
            borderBottomRightRadius: 25
          }}
          
        >
          <View
            style={{flexDirection: "row"}}
          >
            <View
              style={{width: "85%",
            }}
            ></View>
          <TouchableOpacity
                    style={{width: 40, marginTop: 50, marginRight: 20, alignItems: "flex-end"}}
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
            <Image
              source={require("../icons/settings.png")}
              style={styles.icon}
            />

          </TouchableOpacity>
          </View>
      </LinearGradient>
      </View>
      <View>
        <View style={{height: 125}}></View>
        <View
          style={{alignItems: "center"}}>
        <Image style={{ width: 175, 
                height: 175, 
                borderBottomLeftRadius: 100,
                borderBottomRightRadius: 100,
                borderTopRightRadius: 100,
                borderTopLeftRadius: 100,
                zIndex: 1,
                borderColor: 'white',
                borderWidth: 5,
              }} 
                source={profilePic}
        />
        </View>
        <View
          style={{alignItems: "center"}}>
            <Text style={styles.name}>{name}</Text>

            <Text style={styles.bio}>{bio}</Text>
            <Spacer></Spacer>
        </View>


            <View style={styles.inline}>
                <TouchableOpacity
                    onPress={() => {
                      if(facebook != "") {
                        Linking.openURL(facebook);
                    }
                    }}
                >
                  <Image
                    source={require("../icons/youtube.png")}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                      if(instagram != "") {
                        Linking.openURL(instagram);
                      }
                    }}
                >
                  <Image
                    source={require("../icons/instagram.png")}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                      if(tiktok != "") {
                        Linking.openURL(tiktok);
                      }
                    }}
                >
                  <Image
                    source={require("../icons/tik-tok.png")}
                    style={styles.icon}
                  />
                </TouchableOpacity>
            </View>
      </View>
      <View
        style={{
          width: "90%"
        }}
      >
        <Text
          style={styles.reels}
        >Reels</Text>
            <FlatList
            showsVerticalScrollIndicator={false}
            data={reelList.slice(0, reelList.length >= 3 ? 3 : reelList.length)}
            keyExtractor={(data) => data.id}
            renderItem={({ item }) => {
              console.log("item is " +  item);
              return renderReelFeedView(item);
            }}
          />
      </View>
    </View>
  );
};

AccountScreen.navigationOptions = () => {
  return {
    header: () => true
  };
};

const renderReelFeedView = (data) => {
  return (
    <ReelFeedCard
      title={data.title}
      upvotes={data.upvotes}
      image_url={data.thumbnail}
      id={data.id}
      data={data}
    />
  );
};

const getInfo = async (setBio, setName, setEmail, 
                      setProfilePic, setFacebook, setTiktok, 
                      setInstagram) => {
  var imageURL = false;
  const uid = await AsyncStorage.getItem("token");
  const userRef = firebase.firestore().collection("users");
  var storageRef = firebase.storage().ref();

  firebase.firestore().collection("users").doc(uid).get()
  .then((doc) => {
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
          });
      }
  })
  .catch((error) => {
      console.error("Error fetching document: ", error);
  });
  return temp;
};

const getReelList = async (setReelList) => {
  console.log("getting reel list");
  const uid = await AsyncStorage.getItem("token");
  let userReelsRef = firebase.firestore().collection("users/" + uid + "/reels");
  let reelsRef = firebase.firestore().collection("reels");
  let reelList_ = [];
  let reel_id = "";
  userReelsRef.get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      reel_id = doc.data().reelid;
      console.log("reel id is" + reel_id);
      reelsRef.doc(reel_id).get().then((doc) => {
        let data_ = doc.data();
        data_["id"] = doc.id;
        reelList_.push(data_);
        console.log("data read in is " + data_);
      });
    })
  }).then(() => {
    setReelList(reelList_);
  })
  .catch((error) => {
        console.log(error.message);
  });
};


const styles = StyleSheet.create({
  textInput: {
   color: 'black',
  },
  imageCenter: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  inline: {
      flexDirection:'row',
      flexWrap:'wrap',
      justifyContent: 'space-around',
      alignItems: "center"
  },
  name: {
    fontFamily: 'Raleway',
    fontSize: 32,
    fontWeight: "bold"
  },
  bio: {
    fontFamily: 'Raleway',
    fontSize: 16,
    color: '#545454',
    fontWeight: "normal"
  },
  reels: {
    fontFamily: 'Raleway',
    fontSize: 14,
    fontWeight: "normal"
  },
  icon: {
    height: 20,
    width: 20
  }
});

export default AccountScreen;
