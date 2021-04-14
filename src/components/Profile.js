import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  FlatList,
  ScrollView,
} from "react-native";
import Spacer from "../components/Spacer";
import { LinearGradient } from "expo-linear-gradient";
import ReelFeedCard from "../components/ReelFeedCard";

const Profile = ({
  isOwn,
  reelList,
  update,
  bio,
  name,
  profilePic,
  facebook,
  instagram,
  tiktok,
  navigation,
  prevPath,
}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        zIndex: 0,
        height: "100%",
        backgroundColor: "white",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <View
        style={{
          zIndex: 0,
          position: "absolute",
          height: 212.5,
          width: "100%",
        }}
      >
        <LinearGradient
          colors={["#ffffff", "#7D5BFC"]}
          style={{
            height: 212.5,
            width: "100%",
            borderRadius: 25,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
          }}
        >
          {!isOwn && (
            <View style={styles.topBar}>
              <TouchableOpacity
                style={{ zIndex: 2 }}
                onPress={() => {
                  navigation.goBack(null);
                }}
                style={styles.backContainer}
              >
                <Text style={styles.uploadText}>Back</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ flexDirection: "row-reverse" }}>
            {isOwn && (
              <TouchableOpacity
                style={{
                  width: 40,
                  marginTop: 50,
                  marginRight: 20,
                  alignItems: "flex-end",
                }}
                onPress={() => {
                  navigation.navigate("EditAccount", {
                    bio: bio,
                    name: name,
                    profilePic: profilePic,
                    facebook: facebook,
                    instagram: instagram,
                    tiktok: tiktok,
                    func: update,
                  });
                }}
              >
                <Image
                  source={require("../icons/settings.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>
      <View>
        <View style={{ height: 125 }}></View>
        <View style={{ alignItems: "center" }}>
          <Image
            style={{
              width: 175,
              height: 175,
              borderBottomLeftRadius: 100,
              borderBottomRightRadius: 100,
              borderTopRightRadius: 100,
              borderTopLeftRadius: 100,
              zIndex: 1,
              borderColor: "white",
              borderWidth: 5,
            }}
            source={profilePic}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.name}>{name}</Text>

          <Text style={styles.bio}>{bio}</Text>
          <Spacer></Spacer>
        </View>

        <View style={styles.inline}>
          <TouchableOpacity
            onPress={() => {
              if (facebook != "") {
                Linking.openURL(facebook);
              }
            }}
          >
            <Image
              source={require("../icons/youtube.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (instagram != "") {
                Linking.openURL(instagram);
              }
            }}
          >
            <Image
              source={require("../icons/instagram.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (tiktok != "") {
                Linking.openURL(tiktok);
              }
            }}
          >
            <Image
              source={require("../icons/tik-tok.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.reels}>Reels</Text>
      <ScrollView
        style={{ height: "100%", width: "90%" }}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={reelList}
          keyExtractor={(data) => data.id}
          renderItem={({ item }) => {
            console.log("item is " + item);
            return renderReelFeedView(item);
          }}
        />
      </ScrollView>
    </View>
  );
};

const renderReelFeedView = (data) => {
  return (
    <ReelFeedCard
      title={data.title}
      upvotes={data.upvotes}
      image_url={data.thumbnail}
      id={data.id}
      data={data}
    />
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: "absolute",
    top: 0,
    paddingTop: 45,
    backgroundColor: "rgba(0,0,0,0)",
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    color: "black",
  },
  imageCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  inline: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
  },
  name: {
    fontFamily: "Raleway-Bold",
    fontSize: 32,
  },
  bio: {
    fontFamily: "Raleway-Regular",
    fontSize: 16,
    color: "#545454",
  },
  reels: {
    fontFamily: "Raleway-Regular",
    fontSize: 14,
    textAlign: "left",
    width: "90%",
  },
  icon: {
    height: 20,
    width: 20,
  },
  backContainer: {
    padding: 8,
    marginLeft: 8,
  },
  uploadText: {
    color: "#5C33FF",
    fontFamily: "Raleway-Bold",
    fontSize: 18,
  },
});

export default Profile;
