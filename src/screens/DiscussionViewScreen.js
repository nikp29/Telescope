import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import DiscussionView from "../components/DiscussionView";

const DiscussionViewScreen = (props) => {
  const { data } = props.navigation.state.params;

  return (
    <>
      <DiscussionView
        description={data.title}
        description={data.description}
        discussion_uid={data.discussion_uid}
        id={data.id}
      />
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{ zIndex: 2 }}
          onPress={() => {
            props.navigation.goBack(null);
          }}
          style={styles.backContainer}
        >
          <Text style={styles.uploadText}>Back</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

DiscussionViewScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};
const styles = StyleSheet.create({
  topBar: {
    position: "absolute",
    top: 0,
    paddingTop: 45,
    backgroundColor: "white",
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uploadContainer: {
    padding: 8,
    marginRight: 8,
  },
  backContainer: {
    padding: 8,
    marginLeft: 8,
  },
  uploadText: {
    color: "#5C33FF",
    fontFamily: "Raleway-Bold",
    fontSize: 18,
  },
});

export default DiscussionViewScreen;
