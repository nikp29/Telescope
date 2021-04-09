import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Text } from "react-native-elements";

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
    <View style={styles.viewContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>telescope</Text>
        <Text style={styles.title2}>.</Text>
      </View>
      <Text style={styles.headerText}>{headerText}</Text>
      {isSignUp ? (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="none"
              autoCorrect={false}
              onPress={() => Keyboard.dismiss()}
            />
          </View>
        </>
      ) : null}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onPress={() => Keyboard.dismiss()}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          blurOnSubmit={true}
          onPress={() => Keyboard.dismiss()}
          onSubmitEditing={() => {
            Keyboard.dismiss();
            onSubmit({ email, password });
          }}
        />
      </View>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      {isSignUp ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => onSubmit({ email, password, fullName })}
        >
          <Text style={styles.buttonStyle}>{submitButtonText}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => onSubmit({ email, password })}
        >
          <Text style={styles.buttonStyle}>{submitButtonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: "#FFD770",
    marginLeft: 15,
    marginTop: 15,
    fontFamily: "Raleway-Bold",
  },
  title: {
    fontFamily: "Raleway-ExtraBold",
    color: "#FFD770",
    fontSize: 45,
  },
  title2: {
    fontFamily: "Raleway-ExtraBold",
    color: "white",
    fontSize: 45,
  },
  titleContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 18,
    fontFamily: "Raleway-Regular",
  },
  inputContainer: {
    padding: 24,
    backgroundColor: "white",
    width: "80%",
    borderRadius: 16,
    marginTop: 32,
  },
  viewContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 25,
    marginTop: 32,
  },
  buttonStyle: {
    color: "#5C33FF",
    fontFamily: "Raleway-SemiBold",
    fontSize: 18,
  },
  headerText: {
    width: "100%",
    textAlign: "left",
    paddingLeft: "10%",
    fontFamily: "Raleway-Bold",
    fontSize: 28,
    color: "white",
    marginTop: 32,
    marginBottom: -16,
  },
});

export default AuthForm;
