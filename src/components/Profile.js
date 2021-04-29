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
import ExperienceCard from "../components/ExperienceCard";
import Icon from "react-native-vector-icons/FontAwesome";

const Profile = ({
  isOwn,
  expList,
  reelList,
  update,
  updateMin,
  bio,
  name,
  profilePic,
  youtube,
  instagram,
  tiktok,
  navigation,
  prevPath,
}) => {
  const [showExp, setShowExp] = useState(false);
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
                    youtube: youtube,
                    instagram: instagram,
                    tiktok: tiktok,
                    func: update,
                    func2: updateMin,
                    expList: expList,
                  });
                }}
              >
                <Icon name={"cog"} size={23} />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>
      <View style={{ alignItems: "center" }}>
        <View style={{ height: 125 }}></View>
        <View style={{ alignItems: "center", width: "100%" }}>
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
        </View>

        <View style={styles.inline}>
          {youtube != "" && (
            <TouchableOpacity
              onPress={() => {
                if (youtube != "") {
                  Linking.openURL("https://www.youtube.com/user/" + youtube);
                }
              }}
            >
              <Image
                source={require("../../assets/icons/youtube.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              if (instagram != "") {
                Linking.openURL("https://www.instagram.com/" + instagram);
              }
            }}
          >
            <Image
              source={require("../../assets/icons/instagram.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (tiktok != "") {
                Linking.openURL("https://tiktok.com/@" + tiktok);
              }
            }}
          >
            <Image
              source={require("../../assets/icons/tik-tok.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: "90%",
          flexDirection: "row",
          marginBottom: 20,
          marginTop: 24,
        }}
      >
        <TouchableOpacity
          style={{ marginRight: 5 }}
          onPress={() => {
            setShowExp(false);
          }}
        >
          <Text
            style={{
              fontFamily: "Raleway-Bold",
              fontSize: 20,
              textAlign: "left",
              // width: "90%",
              color: showExp ? "#86878B" : "black",
            }}
          >
            Reels
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginLeft: 5 }}
          onPress={() => {
            setShowExp(true);
          }}
        >
          <Text
            style={{
              fontFamily: "Raleway-Bold",
              fontSize: 20,
              textAlign: "left",
              // width: "90%",
              color: showExp ? "black" : "#86878B",
            }}
          >
            Experience
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{
          height: "100%",
          width: showExp ? "100%" : "95%",
        }}
        showsVerticalScrollIndicator={false}
      >
        {!showExp && (
          <FlatList
            data={reelList}
            keyExtractor={(data) => data.id}
            renderItem={({ item }) => {
              return renderReelFeedView(item);
            }}
          />
        )}
        {showExp && (
          <FlatList
            data={expList}
            keyExtractor={(data) => data.id}
            renderItem={({ item }) => {
              return renderExpView(item);
            }}
          />
        )}
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

const renderExpView = (data) => {
  return (
    <View
      style={{
        borderColor: "#86878B",
        borderTopWidth: 0.4,
        borderBottomWidth: 0.4,
      }}
    >
      <ExperienceCard title={data.title} description={data.description} />
    </View>
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
    marginTop: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    // alignItems: "center",
    width: "50%",
    // borderWidth: 10,
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
  selected: {
    fontFamily: "Raleway-Bold",
    fontSize: 20,
    textAlign: "left",
    // width: "90%",
    color: "black",
  },
  notSelected: {
    fontFamily: "Raleway-Bold",
    color: "#86878B",
    fontSize: 20,
    textAlign: "left",
    // width: "90%"
  },
  icon: {
    height: 20,
    width: 20,
    marginLeft: 10,
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
