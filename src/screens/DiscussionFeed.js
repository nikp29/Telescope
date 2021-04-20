import React, { useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
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
import { navigate } from "../navigationRef";
import Icon from "react-native-vector-icons/FontAwesome";

const DiscussionFeed = (props) => {
  const [initialGet, setInitialGet] = useState(false);
  const [discussionList, setDiscussionList] = useState([]);

  if (initialGet == false) {
    setInitialGet(true);
    getDiscussions(setDiscussionList);
  }
  if (!loaded) {
    return null;
  }
  return (
    <>
      <NavigationEvents
        onWillFocus={(payload) => getDiscussions(setDiscussionList)}
      />
      <ScrollView style={{ backgroundColor: "white" }}>
        <Spacer>
          {reelList.length != 0 ? (
            <Text style={styles.header}>Discussions</Text>
          ) : null}

          <FlatList
            showsVerticalScrollIndicator={false}
            data={discussionList}
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

const getDiscussions = async (setDiscussionList) => {
  let discussRef = firebase.firestore().collection("discussions");
  let reelList_ = [];
  discussRef
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data_ = doc.data();
        data_["id"] = doc.id;
        reelList_.push(data_);
      });
      setDiscussionList(reelList_);
    })
    .catch((error) => {
      console.log(error.message);
    });
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
});

export default DiscussionFeed;
