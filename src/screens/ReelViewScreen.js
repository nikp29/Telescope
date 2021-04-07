import React, { useState, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import YoutubePlayer from "react-native-youtube-iframe";
import { Modalize } from "react-native-modalize";
import { Host, Portal } from "react-native-portalize";

const ReelViewScreen = (props) => {
  const { data } = props.navigation.state.params;
  const [status, setStatus] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");

  const modalizeRef = useRef(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };
  return (
    <>
      <Text style={{ fontSize: 48 }}>{data.title}</Text>
      <YoutubePlayer
        videoId={data.youtube_id}
        play={true} // control playback of video with true/false
        onReady={() => setReady(true)}
        onChangeState={(e) => setStatus(e)}
        height={219}
        forceAndroidAutoplay
      />
      <Text>{data.description}</Text>
      <TouchableOpacity onPress={onOpen}>
        <Text>Comments</Text>
      </TouchableOpacity>

      <Portal>
        <Modalize
          ref={modalizeRef}
          FooterComponent={
            <Input
              secureTextEntry
              label="Password"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
          }
        >
          <Text>Comments</Text>
        </Modalize>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({});

export default ReelViewScreen;
