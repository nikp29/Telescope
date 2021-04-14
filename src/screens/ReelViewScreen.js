import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import ReelView from "../components/ReelView";

const ReelViewScreen = (props) => {
  const { data } = props.navigation.state.params;

  return (
    <>
      <ReelView
        url={data.youtube_id}
        tags={data.tags}
        description={data.description}
        reel_uid={data.user}
        id={data.id}
        showComments={true}
        autoplay={true}
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

ReelViewScreen.navigationOptions = () => {
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

export default ReelViewScreen;
