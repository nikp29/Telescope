import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import ReelView from "../components/ReelView";
import { navigate } from "../navigationRef";
import { firebase } from "../firebase/config.js";
import shuffle from "shuffle-array";
import Carousel from "react-native-snap-carousel";
import moment from "moment";

const ExploreFeed = () => {
  const [current, setCurrent] = useState(0);
  const [reelList, setReelList] = useState([]);
  const caroselRef = useRef(null);
  useEffect(() => {
    getReels(setReelList);
    return () => {
      null;
    };
  }, []);
  let display_array = [];
  if (reelList.length != 0) {
    display_array = reelList.slice(
      current == 0 ? 0 : current - 1,
      current + 1 == reelList.length ? reelList.length : current + 1
    );
  }
  return (
    <View style={styles.container}>
      <Carousel
        style={{ backgroundColor: "black" }}
        layout={"default"}
        ref={caroselRef}
        data={reelList}
        sliderHeight={Dimensions.get("window").height - 82}
        sliderWidth={Dimensions.get("window").width}
        itemWidth={Dimensions.get("window").width}
        itemHeight={Dimensions.get("window").height - 82}
        vertical={true}
        renderItem={({ item, index }) => {
          console.log(index);
          return (
            <View
              style={{
                height: Dimensions.get("window").height - 82,
                backgroundColor: "black",
                width: Dimensions.get("window").width,
              }}
            >
              <ReelView
                url={item.youtube_id}
                tags={item.tags}
                description={item.description}
                reel_uid={item.user}
                id={item.id}
                showComments={true}
                height={Dimensions.get("window").height - 82}
                autoplay={index == current}
              />
            </View>
          );
        }}
        onSnapToItem={(index) => setCurrent(index)}
      />
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={(event) => {}}>
          <Text style={styles.tabActive}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(event) => {
            navigate("ThisWeek");
          }}
          onSwiped={(cardIndex) => {
            setCurrent(cardIndex);
          }}
        >
          <Text style={styles.tab}>This Week</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getReels = async (setReelList) => {
  let reelsRef = firebase.firestore().collection("reels");
  let reelList_ = [];
  await reelsRef
    .orderBy("upvotes", "desc")
    .where("daystamp", "==", getDaystamp(moment()))
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("hi");
        let data_ = doc.data();
        data_["id"] = doc.id;
        reelList_.push(data_);
      });
      console.log(reelList_);
      setReelList(shuffle(reelList_));
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const getDaystamp = (moment_) => {
  // get unix days since jan 1st 1970
  return Math.floor(moment_.unix().valueOf() / 86400);
};

ExploreFeed.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: "100%",
    backgroundColor: "black",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    paddingTop: 60,
    justifyContent: "space-around",
    opacity: 50,
    backgroundColor: "rgba(0,0,0,0)",
    paddingBottom: 8,
  },
  tab: {
    fontFamily: "Raleway",
    fontWeight: "400",
    fontSize: 25,
    color: "rgba(255, 255, 255, 0.3)",
  },
  tabActive: {
    fontFamily: "Raleway",
    fontWeight: "400",
    fontSize: 25,
    color: "white",
  },
});

export default ExploreFeed;
