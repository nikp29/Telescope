import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Host } from "react-native-portalize";

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
      Account: AccountScreen,
    }),
  },
  { initialRouteName: "loginFlow" }
);

const App = createAppContainer(switchNavigator);

export default () => {
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
