import React, { useContext } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { NavigationEvents } from "react-navigation";
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";
import { Context } from "../context/AuthContext";

const SigninScreen = () => {
  const { state, signin, clearErrorMessage } = useContext(Context);

  return (
    <KeyboardAvoidingView
      style={styles.background}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <NavigationEvents onWillFocus={clearErrorMessage} />
        <AuthForm
          headerText="Sign In"
          errorMessage={state.errorMessage}
          onSubmit={signin}
          submitButtonText="Sign In"
          isSignUp={false}
        />
        <NavLink
          text="Dont have an account?"
          linkText="Sign up"
          routeName="Signup"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

SigninScreen.navigationOptions = {
  header: () => false,
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

export default SigninScreen;
