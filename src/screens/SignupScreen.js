import React, { useContext } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { NavigationEvents } from "react-navigation";
import { Context as AuthContext } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";

const SignupScreen = ({ navigation }) => {
  const { state, signup, clearErrorMessage } = useContext(AuthContext);

  return (
    <KeyboardAvoidingView
      style={styles.background}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <NavigationEvents onWillFocus={clearErrorMessage} />
        <AuthForm
          headerText="Sign Up"
          errorMessage={state.errorMessage}
          submitButtonText="Sign Up"
          onSubmit={signup}
          isSignUp
        />
        <NavLink
          routeName="Signin"
          text="Already have an account?"
          linkText="Sign in"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

SignupScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  background: {
    height: "100%",
    backgroundColor: "#5c33ff",
  },
});

export default SignupScreen;
