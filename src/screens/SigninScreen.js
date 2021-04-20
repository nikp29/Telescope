import React, { useContext, useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { NavigationEvents } from "react-navigation";
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";
import { Context } from "../context/AuthContext";

const SigninScreen = () => {
  const { state, signin, clearErrorMessage } = useContext(Context);
  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;
  const [fadeAnim] = useState(new Animated.Value(1));
  const [curve] = useState(new Animated.Value(0));
  const [margin1] = useState(new Animated.Value(0));
  const [zForm, setZForm] = useState(-1);

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
      }).start();
      Animated.timing(curve, {
        toValue: 25,
        duration: 750,
      }).start();
      Animated.timing(margin1, {
        toValue: -height / 4.5,
        duration: 1000,
      }).start();
      setTimeout(() => {
        setZForm(1);
      }, 1000);
    }, 100);
    return () => {
      null;
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        height: height,
        backgroundColor: "#5C33FF",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={{
          marginTop: margin1,
          height: "51%",
          width: width,
          overflow: "hidden",
          borderRadius: curve,
          zIndex: 2,
        }}
      >
        <Image
          style={{
            height: height,
            width: width,
          }}
          source={require("../../assets/splash.png")}
        />
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          opacity: fadeAnim,
          // overflow: "hidden",
          // zindex:,
          // flex: 1,
        }}
      >
        <Image
          style={{
            zIndex: 0,
            position: "absolute",
            height: height,
            width: "100%",
            // top: 0, left: 0
            // overflow:"hidden"
          }}
          source={require("../../assets/splash_no_text.png")}
        />
      </Animated.View>
      <View
        style={{
          width: "80%",
          marginTop: Platform.OS === "ios" ? 25 : 50,
          height: "100%",
          backgroundColor: "#5C33FF",
          position: "absolute",
          zIndex: zForm,
        }}
      >
        <View style={styles.container}>
          <NavigationEvents onWillFocus={clearErrorMessage} />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
          >
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
          </KeyboardAvoidingView>
        </View>
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
    width: "80%",
    marginTop: 50,
    height: "100%",
    backgroundColor: "#5C33FF",
    position: "absolute",
    // zIndex: -1
  },
});

export default SigninScreen;
