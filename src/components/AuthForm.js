import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, Button, Input } from "react-native-elements";
import Spacer from "./Spacer";

const AuthForm = ({
  headerText,
  errorMessage,
  onSubmit,
  submitButtonText,
  isSignUp,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  return (
    <>
      <Spacer>
        <Text h3>{headerText}</Text>
      </Spacer>
      {isSignUp ? (
        <>
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Spacer />
        </>
      ) : null}
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Spacer />
      <Input
        secureTextEntry
        label="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <Spacer>
        {isSignUp ? (
          <Button
            title={submitButtonText}
            onPress={() => onSubmit({ email, password, fullName })}
          />
        ) : (
          <Button
            title={submitButtonText}
            onPress={() => onSubmit({ email, password })}
          />
        )}
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

export default AuthForm;
