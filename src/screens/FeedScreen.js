import React, { useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { NavigationEvents } from "react-navigation";
import Spacer from "../components/Spacer";
import { firebase } from "../firebase/config.js";
import moment from "moment";
import ReelFeedCard from "../components/ReelFeedCard";

const ReelScreen = (props) => {
  const [isWeek, setIsWeek] = useState(true);
  const [initialGet, setInitialGet] = useState(false);
  const [loaded] = useFonts({
    Raleway: require("../../assets/Raleway-Bold.ttf"),
    RalewayExtraBold: require("../../assets/Raleway-ExtraBold.ttf"),
  });
  const [reelList, setReelList] = useState([]);

  if (initialGet == false) {
    setInitialGet(true);
    getReelList(setReelList, 3, true);
  }
  if (!loaded) {
    return null;
  }
  return (
    <>
      <NavigationEvents
        onWillFocus={(payload) => getReelList(setReelList, 3, true)}
      />
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={async (event) => {
            // if (isWeek == true) {
            //   await setIsWeek(false);
            //   getReelList(setReelList, numDisplayed, false);
            // }
          }}
        >
          <Text style={isWeek ? styles.tab : styles.tabActive}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async (event) => {
            // if (isWeek == false) {
            //   await setIsWeek(true);
            //   getReelList(setReelList, numDisplayed, true);
            // }
          }}
        >
          <Text style={isWeek ? styles.tabActive : styles.tab}>This Week</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Spacer>
          {reelList.length != 0 ? (
            <Text style={styles.header}>Top 3</Text>
          ) : null}

          <FlatList
            showsVerticalScrollIndicator={false}
            data={reelList.slice(0, reelList.length >= 3 ? 3 : reelList.length)}
            keyExtractor={(data) => data.id}
            renderItem={({ item }) => {
              return renderReelFeedView(item);
            }}
          />
          {reelList.length > 3 ? (
            <View
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                marginBottom: 32,
              }}
            />
          ) : null}
          <FlatList
            showsVerticalScrollIndicator={false}
            data={reelList.slice(reelList.length >= 3 ? 3 : reelList.length)}
            keyExtractor={(data) => data.id}
            renderItem={({ item }) => {
              return renderReelFeedView(item);
            }}
          />
        </Spacer>
      </ScrollView>
    </>
  );
};

ReelScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const getReelList = async (setReelList, numDisplayed, isWeek) => {
  let reelsRef = firebase.firestore().collection("reels");
  let reelList_ = [];
  if (isWeek) {
    reelsRef
      .orderBy("upvotes", "desc")
      .where("weekstamp", "==", getWeekstamp(moment()))
      .orderBy("timestamp", "desc")
      .limit(numDisplayed)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data_ = doc.data();
          data_["id"] = doc.id;
          reelList_.push(data_);
        });
        setReelList(reelList_);
      })
      .catch((error) => {
        console.log(error.message);
      });
  } else {
    reelsRef
      .orderBy("upvotes", "desc")
      .where("daystamp", "==", getDaystamp(moment()))
      .orderBy("timestamp", "desc")
      .limit(numDisplayed)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data_ = doc.data();
          data_["id"] = doc.id;
          reelList_.push(data_);
        });
        setReelList(reelList_);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
};

const getDaystamp = (moment_) => {
  // get unix days since jan 1st 1970
  return Math.floor(moment_.unix().valueOf() / 86400);
};

const getWeekstamp = (moment_) => {
  // get unix weeks since dec 29 monday 1969
  return Math.floor((Math.floor(moment_.unix().valueOf() / 86400) - 4) / 7);
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
    fontFamily: "Raleway",
    fontWeight: "400",
    fontSize: 25,
    color: "#ccc0ff",
  },
  tabActive: {
    fontFamily: "Raleway",
    fontWeight: "400",
    fontSize: 25,
    color: "#5c33ff",
  },
  header: {
    fontSize: 30,
    fontFamily: "RalewayExtraBold",
    marginBottom: 16,
  },
});

export default ReelScreen;
