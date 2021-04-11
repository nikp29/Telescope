import moment from "moment";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const ReelView = ({ url, tags, thumbnail, description, username, uid }) => {
  const [status, setStatus] = useState(false);
  const [ready, setReady] = useState(false);
  const colors = [
    "rgba(196, 196, 196, 0.7)",
    "rgba(255, 215, 112, 0.7)",
    "rgba(92, 51, 255, 0.6)",
  ];
  return (
    <View style={styles.container}>
      <View style={styles.video}>
        <YoutubePlayer
          videoId={url}
          play={true} // control playback of video with true/false
          onReady={() => setReady(true)}
          onChangeState={(e) => setStatus(e)}
          height={201}
          forceAndroidAutoplay
        />
      </View>
      <View>
        <Text style={styles.username}>{username}</Text>
        {description != "" && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
      {tags != [] && (
        <FlatList
          horizontal
          style={styles.tags}
          data={tags}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const color = colors[tags.indexOf(item) % 3];
            console.log(color);
            return (
              <View
                style={{
                  padding: 8,
                  backgroundColor: color,
                  borderRadius: 8,
                  marginRight: 16,
                }}
              >
                <Text>{item}</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 16,
    paddingTop: 110,
  },
  video: {
    borderRadius: 8,
    overflow: "hidden",
  },
  username: {
    fontFamily: "Raleway-ExtraBold",
    fontSize: 26,
    marginTop: 8,
  },
  description: {
    fontFamily: "Raleway-Regular",
    fontSize: 14,
    marginTop: 8,
  },
  tags: {
    flexDirection: "column",
    width: "100%",
    marginTop: 8,
  },
});

export default ReelView;
