import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { NavigationEvents } from "react-navigation";
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";
import { Context } from "../context/AuthContext";

const SigninScreen = () => {
  const { state, signin, clearErrorMessage } = useContext(Context);

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <NavigationEvents onWillFocus={clearErrorMessage} />
        <AuthForm
          headerText="Sign In to Your Account"
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
    </View>
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
