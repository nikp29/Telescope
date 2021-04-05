import React, { useState } from "react";
import { ScrollView, StyleSheet, FlatList } from "react-native";
import { Text, Button, TouchableOpacity } from "react-native-elements";
import Spacer from "./Spacer";
import { firebase } from "../firebase/config.js";
import moment from "moment";
import ReelFeedView from "./ReelFeedView";

const Feed = ({ isWeek }) => {
  const [reelList, setReelList] = useState([]);
  const [numDisplayed, setNumDisplayed] = useState(5);
  if (reelList.length == 0) {
    getReelList(setReelList, numDisplayed, isWeek);
  }

  return (
    <ScrollView>
      <Spacer>
        <Text h3>Top 3</Text>

        <FlatList
          data={reelList}
          keyExtractor={(data) => data.id}
          renderItem={({ item }) => {
            return renderReelFeedView(item);
          }}
        />
        {reelList.length == numDisplayed ? (
          <Button
            onPress={() => {
              setNumDisplayed(numDisplayed + 5);
              getReelList(setReelList, numDisplayed, isWeek);
            }}
            title="Load more"
          />
        ) : null}
      </Spacer>
    </ScrollView>
  );
};

const getReelList = async (setReelList, numDisplayed, isWeek) => {
  let reelsRef = firebase.firestore().collection("reels");
  let reelList_ = [];
  reelsRef = reelsRef
    .orderBy("upvotes")
    .where(
      "daystamp",
      "==",
      isWeek ? getWeekstamp(moment()) : getDaystamp(moment())
    )
    .orderBy("timestamp")
    .limit(numDisplayed)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data_ = doc.data();
        data_["id"] = doc.id;
        reelList_.push(data_);
      });
      setReelList(reelList_);
      console.log(reelList_);
    })
    .catch((error) => {
      console.log(error.message);
    });
  //   console.log(reelListRef);
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
    <ReelFeedView
      title={data.title}
      upvotes={data.upvotes}
      image_url={data.thumbnail}
    />
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginLeft: 15,
    marginTop: 15,
  },
});

export default Feed;
