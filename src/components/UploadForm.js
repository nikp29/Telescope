import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, Button, Input } from "react-native-elements";
import Spacer from "./Spacer";

const UploadForm = ({
  headerText,
  errorMessage,
  onSubmit,
  submitButtonText,
  setError,
}) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  return (
    <>
      <Spacer>
        <Text h3>{headerText}</Text>
      </Spacer>
      <Input
        label="Youtube Video Link"
        value={url}
        onChangeText={setUrl}
        placeholder={"https://youtu.be/<videoid>"}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Spacer />
      <Input
        label="Title"
        value={title}
        onChangeText={setTitle}
        autoCapitalize="words"
        autoCorrect={false}
        placeholder={"Your title here"}
      />
      <Spacer />
      <Input
        secureTextEntry
        label="Tags"
        value={tags}
        onChangeText={setTags}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <Spacer>
        <Button
          title={submitButtonText}
          onPress={() => {
            const youtubeRegex = new RegExp(
              "^(https?://)?(www.youtube.com|youtu.?be)/.+$"
            );
            if (youtubeRegex.test(url)) {
              if (title.length >= 2 && title.length <= 40) {
                setError("");
                onSubmit({ url, title, tags, setError });
              } else {
                setError("Title must be between 2 and 40 characters");
              }
            } else {
              setError("Invalid youtube url");
            }
          }}
        />
      </Spacer>
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
});

export default UploadForm;
