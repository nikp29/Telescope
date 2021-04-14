import React, { useState } from "react";
import { StyleSheet, View, TextInput, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text, Button, Input } from "react-native-elements";
import { Dimensions } from "react-native";

import Spacer from "./Spacer";
import { TouchableOpacity } from "react-native-gesture-handler";

const UploadForm = ({
  headerText,
  errorMessage,
  onSubmit,
  submitButtonText,
  setError,
  goBack,
}) => {
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const uploadReel = () => {
    // hi jared
    const youtubeRegex = /(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'<> #]+)/;
    if (youtubeRegex.test(url)) {
      if (description.length >= 0) {
        setError("");
        const matches = tags
          ? tags.match(/#(\w+)/g).map((item) => {
              return item.substr(1);
            })
          : [];
        onSubmit({
          url: youtubeRegex.exec(url)[1],
          tags: matches,
          setError,
          description,
        });
      } else {
        setError("Description must be between 2 and 40 characters");
      }
    } else {
      setError("Invalid youtube url");
    }
  };

  return (
    <>
      <KeyboardAwareScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        <Text style={styles.title}>{headerText}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder={"Insert Youtube link"}
            autoCapitalize="none"
            autoCorrect={false}
            onPress={() => Keyboard.dismiss()}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tags #hashtag1 #hashtag2..."
            value={tags}
            onChangeText={setTags}
            autoCapitalize="none"
            autoCorrect={false}
            onPress={() => Keyboard.dismiss()}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputMulti}
            placeholder="Write a description"
            value={description}
            onChangeText={setDescription}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            returnKeyType="done"
            // textAlignVertical
            blurOnSubmit={true}
            onPress={() => Keyboard.dismiss()}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              uploadReel();
            }}
          />
        </View>
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
      </KeyboardAwareScrollView>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{ zIndex: 2 }}
          onPress={() => {
            uploadReel();
          }}
          style={styles.uploadContainer}
        >
          <Text style={styles.uploadText}>{submitButtonText}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginLeft: 15,
    marginTop: 15,
  },
  inputContainer: {
    backgroundColor: "rgba(255, 215, 112, 0.7)",
    width: "80%",
    borderRadius: 16,
    marginTop: 32,
  },
  input: {
    fontFamily: "Raleway-Regular",
    fontSize: 18,
    padding: 24,
  },
  inputMulti: {
    fontFamily: "Raleway-Regular",
    fontSize: 18,
    maxHeight: 90,
    padding: 24,
    paddingTop: 24,
  },
  title: {
    width: "100%",
    textAlign: "left",
    paddingLeft: "10%",
    fontFamily: "Raleway-Bold",
    fontSize: 28,
    color: "#5C33FF",
    paddingTop: 180,
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

export default UploadForm;
