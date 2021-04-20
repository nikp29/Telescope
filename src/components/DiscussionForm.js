import React, { useState } from "react";
import { StyleSheet, View, TextInput, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text } from "react-native-elements";
import { Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const DiscussionForm = ({
  headerText,
  errorMessage,
  onSubmit,
  submitButtonText,
  setError,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createDiscussion = () => {
    if (title.length > 0 && title.length <= 100) {
      if (description.length >= 1) {
        setError("");
        onSubmit({
          title,
          description,
          setError,
        });
      } else {
        setError("Description cannot be empty");
      }
    } else {
      setError("Title cannot be empty or longer than 100 characters");
    }
  };
  const makeAlert = () => {
    {
      Alert.alert("Create new discussion?", "", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => createDiscussion() },
      ]);
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
            value={title}
            onChangeText={setTitle}
            placeholder={"Discussion Title"}
            autoCapitalize="words"
            autoCorrect={false}
            onPress={() => Keyboard.dismiss()}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputMulti}
            placeholder="Discussion topic description"
            value={description}
            onChangeText={setDescription}
            autoCapitalize="sentences"
            autoCorrect={true}
            multiline
            returnKeyType="done"
            // textAlignVertical
            blurOnSubmit={true}
            onPress={() => Keyboard.dismiss()}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              makeAlert();
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
          onPress={() => makeAlert()}
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

export default DiscussionForm;
