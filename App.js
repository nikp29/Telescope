import React, { useState } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Host } from "react-native-portalize";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import AccountScreen from "./src/screens/AccountScreen";
import ConfirmUploadScreen from "./src/screens/ConfirmUploadScreen";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ReelUploadScreen from "./src/screens/ReelUploadScreen";
import ReelViewScreen from "./src/screens/ReelViewScreen";
import FeedScreen from "./src/screens/FeedScreen";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { setNavigator } from "./src/navigationRef";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";

const switchNavigator = createSwitchNavigator(
  {
    ResolveAuth: ResolveAuthScreen,
    loginFlow: createStackNavigator(
      {
        Signin: SigninScreen,
        Signup: SignupScreen,
      },
      { initialRouteName: "Signin" }
    ),
    mainFlow: createBottomTabNavigator({
      reelFlow: createStackNavigator({
        FeedScreen: FeedScreen,
        ReelView: ReelViewScreen,
      }),
      ReelUploadFlow: createStackNavigator({
        ReelUpload: ReelUploadScreen,
        ConfirmUpload: ConfirmUploadScreen,
      }),
      Account: AccountScreen
    }),
  },
  { initialRouteName: "loginFlow" }
);

const fetchFonts = () => {
  return Font.loadAsync({
    "Raleway-Bold": require("./assets/Raleway-Bold.ttf"),
    "Raleway-ExtraBold": require("./assets/Raleway-ExtraBold.ttf"),
    "Raleway-SemiBold": require("./assets/Raleway-SemiBold.ttf"),
    "Raleway-Regular": require("./assets/Raleway-Regular.ttf"),
  });
};

const App = createAppContainer(switchNavigator);

export default () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  if (!dataLoaded) {
    return (
      <AppLoading
        onError={() => console.log("couldn't load fonts")}
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
      />
    );
  }
  return (
    <AuthProvider>
      <Host>
        <App
          ref={(navigator) => {
            setNavigator(navigator);
          }}
        />
      </Host>
    </AuthProvider>
  );
};
