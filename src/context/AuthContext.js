import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from "./createDataContext";
import { navigate } from "../navigationRef";
import { firebase } from "../firebase/config.js";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signout":
      return { token: null, errorMessage: "" };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    dispatch({ type: "signin", payload: token });
    navigate("Today");
  } else {
    navigate("Signup");
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const signup = (dispatch) => async ({ email, password, fullName }) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((response) => {
      const uid = response.user.uid;
      const data = {
        id: uid,
        email,
        fullName,
        bio: "",
        pic: false,
        youtube: "",
        instagram: "",
        tiktok: "",
      };
      const usersRef = firebase.firestore().collection("users");
      usersRef
        .doc(uid)
        .set(data)
        .then(() => {
          AsyncStorage.setItem("token", uid);
          dispatch({ type: "signin", payload: data });
          navigate("Today");
        })
        .catch((error) => {
          dispatch({
            type: "add_error",
            payload: error.message,
          });
        });
    })
    .catch((error) => {
      dispatch({
        type: "add_error",
        payload: error.message,
      });
    });
};

const signin = (dispatch) => async ({ email, password }) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      const uid = response.user.uid;
      const usersRef = firebase.firestore().collection("users");
      usersRef
        .doc(uid)
        .get()
        .then((firestoreDocument) => {
          if (!firestoreDocument.exists) {
            dispatch({
              type: "add_error",
              payload: "User does not exist",
            });
            return;
          }
          const data = firestoreDocument.data();
          dispatch({ type: "signin", payload: data });
          AsyncStorage.setItem("token", uid);
          navigate("Today");
        })
        .catch((error) => {
          dispatch({
            type: "add_error",
            payload: error.message,
          });
        });
    })
    .catch((error) => {
      dispatch({
        type: "add_error",
        payload: error.message,
      });
    });
};

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
  navigate("loginFlow");
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: "" }
);
