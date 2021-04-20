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
import DiscussionFeedCard from "../components/DiscussionFeedCard";
import { navigate } from "../navigationRef";
import Icon from "react-native-vector-icons/FontAwesome";

const DiscussionFeed = (props) => {
  const [initialGet, setInitialGet] = useState(false);
  const [discussionList, setDiscussionList] = useState([]);

  if (initialGet == false) {
    setInitialGet(true);
    getDiscussions(setDiscussionList);
  }
  return (
    <>
      <NavigationEvents
        onWillFocus={(payload) => getDiscussions(setDiscussionList)}
      />
      <ScrollView style={{ backgroundColor: "white" }}>
        <Spacer>
          {discussionList.length != 0 ? (
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
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{ zIndex: 2 }}
          onPress={() => {
            navigate("UploadDiscussion");
          }}
          style={styles.uploadContainer}
        >
          <Text style={styles.uploadText}>Create</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

DiscussionFeed.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const getDiscussions = async (setDiscussionList) => {
  let discussRef = firebase.firestore().collection("discussions");
  let discussionList_ = [];
  discussRef
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data_ = doc.data();
        data_["id"] = doc.id;
        discussionList_.push(data_);
      });
      setDiscussionList(discussionList_);
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const renderReelFeedView = (data) => {
  return (
    <DiscussionFeedCard
      title={data.title}
      description={data.description}
      upvotes={data.upvotes}
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
  topBar: {
    position: "absolute",
    top: 0,
    paddingTop: 45,
    backgroundColor: "white",
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  uploadContainer: {
    padding: 8,
    marginRight: 8,
  },
  uploadText: {
    color: "#5C33FF",
    fontFamily: "Raleway-Bold",
    fontSize: 18,
  },
});

export default DiscussionFeed;
