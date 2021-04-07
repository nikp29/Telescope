import React, {useState} from "react";
import { View, StyleSheet, Text, TextInput, FlatList } from "react-native";
import { Button, Input } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import { firebase } from "../firebase/config.js";
import Spacer from "./Spacer.js";

const CommentScreen = ({reel_id}) => {
    const id = reel_id;
    const [desc, setDesc] = useState("");
    var description = "";
    
    var get = false;
    // console.log(route.params);
    // const reel_id = id;
  return (
    <View>
        <TextInput
            label="comment"
            value={desc}
            onChange={newValue => {setDesc(newValue);
                    description = newValue.nativeEvent.text 
                    console.log(description)}}
            placeholder={"description"}
            autoCapitalize="none"
            autoCorrect={false}
        />
        <TouchableOpacity
            onPress={() => {
                addComment(id, description);
                setDesc("");
            }}
        >
            <Text>Post Comment</Text>
        </TouchableOpacity>
        <Spacer/>
        <View>
            <Text>Comments</Text>
        </View>

    </View>
  );
};


const addComment = async (reel_id, description) => {
    console.log("add to " + reel_id);
    console.log(description);
    if(description == "") {
        console.log("empty")
        return;
    }
    console.log(description);
    const uid = await AsyncStorage.getItem("token");
    const reelsRef = firebase.firestore().collection("reels");
    firebase.firestore().collection(`reels/${reel_id}/comments`).add({
        user: uid,
        description: description
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
    return;
};

const styles = StyleSheet.create({});

export default CommentScreen;
