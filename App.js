import React, { useState } from "react";
import { Platform } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Host } from "react-native-portalize";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import AccountScreen from "./src/screens/AccountScreen";
import EditAccountScreen from "./src/screens/EditAccountScreen";
import ConfirmUploadScreen from "./src/screens/ConfirmUploadScreen";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ReelUploadScreen from "./src/screens/ReelUploadScreen";
import ReelViewScreen from "./src/screens/ReelViewScreen";
import DiscussionFeed from "./src/screens/DiscussionFeed";
import DiscussionUploadScreen from "./src/screens/DiscussionUploadScreen";
import DiscussionViewScreen from "./src/screens/DiscussionViewScreen";
import FeedScreen from "./src/screens/FeedScreen";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { setNavigator } from "./src/navigationRef";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import ExploreFeedScreen from "./src/screens/ExploreFeed";
import Icon from "react-native-vector-icons/FontAwesome";
import ProfileScreen from "./src/screens/ProfileScreen";
import SearchScreen from "./src/screens/SearchScreen";
import EditExpScreen from "./src/screens/EditExperienceScreen";

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
    mainFlow: createBottomTabNavigator(
      {
        reelFlow: {
          screen: createSwitchNavigator({
            ThisWeek: createStackNavigator({
              FeedScreen: FeedScreen,
              ProfileView: ProfileScreen,
              ReelView: ReelViewScreen,
            }),
            Today: createStackNavigator({
              Explore: ExploreFeedScreen,
              ProfileView: ProfileScreen,
              ReelView: ReelViewScreen,
            }),
            Search: createStackNavigator({
              Results: SearchScreen,
              ProfileView: ProfileScreen,
              ReelView: ReelViewScreen,
            }),
            // ProfileView: ProfileScreen
          }),
          navigationOptions: {
            tabBarLabel: "",
            tabBarIcon: ({ tintColor }) => (
              <Icon name="film" color={tintColor} size={29} />
            ),
          },
        },
        ReelUploadFlow: {
          screen: createStackNavigator({
            ReelUpload: ReelUploadScreen,
            ConfirmUpload: ConfirmUploadScreen,
          }),
          navigationOptions: {
            tabBarLabel: "",
            tabBarIcon: ({ tintColor }) => (
              <Icon name="plus-square" color={tintColor} size={29} />
            ),
          },
        },
        discussionFlow: {
          screen: createStackNavigator({
            DiscussionFeed: DiscussionFeed,
            UploadDiscussion: DiscussionUploadScreen,
            DiscussionView: DiscussionViewScreen,
            ProfileView: ProfileScreen,
          }),
          navigationOptions: {
            tabBarLabel: "",
            tabBarIcon: ({ tintColor }) => (
              <Icon name="comments" color={tintColor} size={29} />
            ),
          },
        },
        accountFlow: {
          screen: createStackNavigator({
            ViewAccount: AccountScreen,
            ReelView: ReelViewScreen,
            EditAccount: EditAccountScreen,
            EditExp: EditExpScreen,
          }),
          navigationOptions: {
            tabBarLabel: "",
            tabBarIcon: ({ tintColor }) => (
              <Icon name="user" color={tintColor} size={29} />
            ),
          },
        },
      },
      {
        tabBarOptions: {
          showLabel: false,
          activeTintColor: "#FFFFFF",
          style: {
            backgroundColor: "#5C33FF",
            height: Platform.OS === "ios" ? 48 : 60, //was 48
            paddingBottom: Platform.OS === "ios" ? 26 : 10, //was 26
          },
        },
      }
    ),
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
