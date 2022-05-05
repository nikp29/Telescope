import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
  ScrollView
} from "react-native";
import { Button, Input } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from "../firebase/config.js";
import ImagePick from "../components/ImagePick";
import InputField from "../components/InputField";
import { Context as AuthContext } from "../context/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { navigate } from "../navigationRef";
import ExperienceCard from "../components/ExperienceCard";
import Icon from "react-native-vector-icons/FontAwesome";

const EditExp = ({ route, navigation }) => {
  const [expList, setExpList] = useState(navigation.getParam("expList"));
  const [newTitle, setTitle] = useState("");
  const [newDescription, setDescription] = useState("");
  const [addExp, setAddExp] = useState(false);

  return (
    <View
      style={{
        backgroundColor: "white",
        height: "100%",
        width: "100%",
        alignItems: "center",
      }}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          // style={{ zIndex: 2 }}
          onPress={() => {
            navigation.goBack(null);
            console.log("going back");
          }}
          style={styles.backContainer}
        >
          <Text style={styles.uploadText}>Back</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        style={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        <View
          style={{width: "100%",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 20
        }}
        >
          {!addExp && (<TouchableOpacity
            onPress={() => {
              setAddExp(true);
            }}
            style={styles.button}
          >
            <Text style={styles.buttonStyle}>Add</Text>
          </TouchableOpacity>)}
        </View>

        {addExp && (<View
        >
          <InputField name="Title" value={newTitle} setValue={setTitle} />
          <InputField name="Description" value={newDescription} setValue={setDescription} />
        </View>)}

        {addExp && (
        <View
            style={{
              flexDirection: "row",
          justifyContent: "space-around"}}
          >
            <TouchableOpacity
              onPress={() => {
                addNewExp(newTitle, newDescription, setExpList, expList).then(() => {
                  setTitle("");
                  setDescription("");
                });
                setAddExp(false);
              }}
              style={styles.button}
            >
              <Text style={styles.buttonStyle}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAddExp(false);
                setTitle("");
                setDescription("");
              }}
              style={styles.button}
            >
              <Text style={styles.buttonStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>)}
          <ScrollView
            style={{ height: "100%", width: "100%" }}
            showsVerticalScrollIndicator={false}
          >
            <View
            style={{
              borderColor: "#86878B",
              borderTopWidth: expList.length == 0 ? 0: 0.4
            }}
            ></View>
            <FlatList
              data={expList}
              keyExtractor={(data) => data.id}
              renderItem={({ item }) => {
                return renderExpView(item, setExpList, expList);
              }}
            />
          </ScrollView>
      </KeyboardAwareScrollView>
      <View styles={{ alignContent: "", width: "100%" }}>
        <TouchableOpacity
          onPress={() => {
            // editInfo(name, bio, youtube, tiktok, instagram)
            //   .then(() => {
                navigate("EditAccount");
              // });
          }}
          style={styles.button}
        >
          <Text style={styles.buttonStyle}>Finish Editing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


EditExp.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const renderExpView = (data, setExpList, expList) => {
  return (
    <View
      style={{
      flexDirection: "row",
      alignItems: "center",
      borderColor: "#86878B",
      borderBottomWidth: 0.4}}
    >
      <View
      style={{width: "70%",
              margin: 20,
              marginRight: "9%",
            }}
      >
    <ExperienceCard
      title={data.title}
      description={data.description}
    />
    </View>
    <TouchableOpacity
      onPress={() => {
        deleteExp(data.id, setExpList, expList);
      }}
    >
    <Icon
      name={"trash"}
      size={30}
      color={"#5C33FF"}
    />
    </TouchableOpacity>
    </View>
  );
};

const addNewExp = async (newTitle, newDescription, setExpList, expList) => {
  if(newTitle == "") {
    return;
  }
  console.log('add exp test');
  const uid = await AsyncStorage.getItem("token");
  const expRef = firebase.firestore().collection("users").doc(uid).collection("experiences");
  expRef.add({
    title: newTitle,
    description: newDescription
  })
  .then((docRef) => {
    console.log('exp id is ' + docRef.id);
    let data_ = {
      title: newTitle,
      description: newDescription
    };
    data_["id"] = docRef.id;
    setExpList([data_, ...expList]);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });
}

const deleteExp = async (expId, setExpList, expList) => {
  const uid = await AsyncStorage.getItem("token");
  const expRef = firebase.firestore().collection("users").doc(uid).collection("experiences");
  let expList_ = [];
  expRef.doc(expId).delete().then(() => {
    for(let i=0; i<expList.length; i++) {
      if(expList[i]["id"] != expId) {
        expList_.push(expList[i]);
      }
    }
    setExpList(expList_);
  })
  .catch((error) => {
    console.error("Error removing document: ", error);
  });
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    width: "100%",
    // height: "100%"
    // backgroundColor: "white",
    // alignItems: "center",
    // width: "100%"
  },
  textInput: {
    marginTop: 100,
    color: "black",
  },
  buttonStyle: {
    color: "white",
    fontFamily: "Raleway-SemiBold",
    fontSize: 18,
  },
  button: {
    width: 150,
    backgroundColor: "#5C33FF",
    padding: 16,
    borderRadius: 25,
    marginTop: 16,
    alignItems: "center",
  },
  backContainer: {
    padding: 8,
    marginLeft: 8,
    // backgroundColor: "orange"
  },
  uploadText: {
    color: "#5C33FF",
    fontFamily: "Raleway-Bold",
    fontSize: 18,
  },
  topBar: {
    position: "absolute",
    top: 0,
    paddingTop: 45,
    backgroundColor: "white",
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 2
  },
  input: {
    fontSize: 15,
    fontFamily: "Raleway-Regular",
    padding: 16,
  },
  inputContainer: {
    backgroundColor: "rgba(255, 215, 112, 0.7)",
    width: "80%",
    borderRadius: 12,
    marginTop: 32,
  },
  buttonStyleSmall: {
    color: "white",
    fontFamily: "Raleway-SemiBold",
    fontSize: 12,
  },
  buttonSmall: {
    width: 75,
    backgroundColor: "#5C33FF",
    padding: 5,
    borderRadius: 15,
    marginRight: 16,
    marginLeft: 0,
    alignItems: "center",
  }
});

export default EditExp;
