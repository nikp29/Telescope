import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  Animated,
  TextInput,
  FlatList,
  Keyboard
} from "react-native";
import { NavigationEvents } from "react-navigation";
import ReelView from "../components/ReelView";
import { navigate } from "../navigationRef";
import { firebase } from "../firebase/config.js";
import shuffle from "shuffle-array";
import Carousel from "react-native-snap-carousel";
import moment from "moment";
import { useFonts } from "expo-font";
import Icon from "react-native-vector-icons/FontAwesome";
import InputField from "../components/InputField";
import ReelFeedCard from "../components/ReelFeedCard"
import ProfileCard from "../components/ProfileCard"


const SearchScreen = (props) => {

    const [reelList, setReelList] = useState([]);
    const [profileList, setProfileList] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <View
        style={{
          flex: 1,
          // flexDirection: "column",
          zIndex: 0,
          height: "100%",
          backgroundColor: "white",
          // flexDirection: "column",
          // alignItems: "center",
        }}
        >
            <View style={styles.tabBar}>
                <TouchableOpacity 
                    onPress={(event) => {
                        navigate("Today");
                    }}>
                <Text style={styles.tab}>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={(event) => {
                    navigate("ThisWeek");
                }}
                >
                <Text style={styles.tab}>Leaderboard</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={{marginTop: 5}}
                onPress={(event) => {
                    navigate("Search");
                }}
                onSwiped={(cardIndex) => {
                    setCurrent(cardIndex);
                }}
                >
                <Icon
                    name={"search"}
                    size={25}
                    color={ "#5c33ff"}
                />
                </TouchableOpacity>
            </View>
            <View
        style={{
          flex: 1,
          // flexDirection: "column",
          zIndex: 0,
          height: "100%",
          backgroundColor: "white",
          // flexDirection: "column",
          // alignItems: "center",
        }}
        >
            <View
                style={styles.container}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                    style={styles.input}
                    placeholder="Search"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="search"
                    onSubmitEditing={() => {
                        Keyboard.dismiss();
                        search(setReelList, setProfileList, setLoading, searchTerm);
                        // getReels(setReelList, setLoading, searchTerm);
                    }}
                    onPress={() => Keyboard.dismiss()}
                    onSubmit
                    />
                </View>
                </View>
                <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                >
                    {/* <ScrollView
                        style={{ height: "100%", width: "90%" }}
                        showsVerticalScrollIndicator={false}
                    > */}
                        <FlatList
                            data={profileList}
                            keyExtractor={(data) => data.id}
                            renderItem={({ item }) => {
                                return renderProfileFeed(item);
                            }}
                        />
                        <FlatList
                            data={reelList}
                            keyExtractor={(data) => data.id}
                            renderItem={({ item }) => {
                                return renderReelFeedView(item);
                            }}
                        />
                {/* </ScrollView> */}
            </ScrollView>
            </View>
        </View>
    );
};

const renderReelFeedView = (data) => {
    return (
      <View
      style={{marginLeft: 20, marginRight: 20}}
      >
      <ReelFeedCard
        title={data.title}
        upvotes={data.upvotes}
        image_url={data.thumbnail}
        id={data.id}
        data={data}
      />
      </View>
    );
  };

const renderProfileFeed = (data) => {
    return (
      <View
      style={{margin: 20, marginTop: 0}}
      >
      <ProfileCard
        uid={data.id}
        name={data.fullName}
        bio={data.bio}
        imageURL={data.pic}
      ProfileCard/>
      </View>
    );
  };

const getReels = async (setReelList, setLoading, searchTerm) => {
    let reelsRef = firebase.firestore().collection("reels");
    let reelList_ = [];
    console.log("getting reels");
    await reelsRef
    //   .orderBy("num_upvotes", "desc")
      .where("tags", "array-contains", searchTerm)
    //   .orderBy("timestamp", "desc")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data_ = doc.data();
          data_["id"] = doc.id;
          reelList_.push(data_);
            console.log(data_.id);
        });
        setReelList(reelList_);
          setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


const getProfiles = async (setProfileList, setLoading, searchTerm) => {
    let usersRef = firebase.firestore().collection("users");
    let userList = [];
    console.log("getting profiles " + searchTerm);
    await usersRef
      .where("fullName", "==", searchTerm)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data_ = doc.data();
          data_["id"] = doc.id;
          userList.push(data_);
            console.log(doc.id);
        });
        setProfileList(userList);
          setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

const search = async (setReelList, setProfileList, setLoading, searchTerm) => {
  if(searchTerm.length <= 1) {
    return;
  }
  if(searchTerm[0] == "@") {
    setReelList([]);
    getProfiles(setProfileList, setLoading, searchTerm.slice(1));
    return;
  }
  if(searchTerm[0] == "#") {
    setProfileList([]);
    getReels(setReelList, setLoading, searchTerm.slice(1));
    return;
  }
  getProfiles(setProfileList, setLoading, searchTerm);
  getReels(setReelList, setLoading, searchTerm);
}

SearchScreen.navigationOptions = () => {
    return {
      header: () => false,
    };
  };

const styles = StyleSheet.create({
    tabBar: {
      paddingHorizontal: 16,
      flexDirection: "row",
      paddingTop: 60,
      justifyContent: "space-around",
      opacity: 50,
      backgroundColor: "white",
      paddingBottom: 8,
    },
    tab: {
      fontFamily: "Raleway-Bold",
      fontWeight: "400",
      fontSize: 25,
      color: "#ccc0ff",
    },
    tabActive: {
      fontFamily: "Raleway-Bold",
      fontWeight: "400",
      fontSize: 25,
      color: "#5c33ff",
    },
    header: {
      fontSize: 30,
      fontFamily: "RalewayExtraBold",
      marginBottom: 16,
    },
    input: {
        fontSize: 15,
        fontFamily: "Raleway-Regular",
        padding: 5,
        paddingLeft: 10
    },
    inputContainer: {
        backgroundColor: "rgba(255, 215, 112, 0.7)",
        width: "80%",
        borderRadius: 6,
        marginTop: 16,
        marginBottom: 16
    },
    container: {
        alignItems: "center",
        backgroundColor: "white",
        // height:"100%"
    },
    scrollContainer: {
        // alignItems: "center",
        backgroundColor: "white",
        height: "100%",
        // width: "90%"
    }
      
  });  

export default SearchScreen;




