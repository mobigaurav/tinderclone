import { StyleSheet, Text, View } from "react-native";
import React, { useContext, createContext, useState, useEffect, useMemo } from "react";
import {
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");



  GoogleSignin.configure({
    // It is mandatory to call this method before attempting to call signIn()
    iosClientId:
      "",
    webClientId:
      "",
    scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    hostedDomain: "", // specifies a hosted domain restriction
    forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    accountName: "", // [Android] specifies an account name on the device that should be used
    googleServicePlistPath: "", // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    openIdRealm: "", // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
    profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
    loginHint: "", // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. The Google Sign-In button will be hidden if a login hint is provided and does not match the signed in user.
  });

  useEffect(
    () => 
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // No user is signed in.
        setUser(null);
      }
      setLoadingInitial(false);
    }),[]
  );

  const logout = async () => {
    setLoading(true);
    await auth.signOut().catch((error) => {
      console.log('error in logout', error);
      setError(error);
    }).finally(() => {
      setLoading(false);
    })
  }

  const signInwithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      //console.log("Has play services");
      await GoogleSignin.signIn().then((userInfo) => {
       // console.log("userInfo", userInfo);
         //setState({ userInfo, error: undefined });
      // Build Firebase credential with the Google ID token.
      //console.log("userInfo", userInfo);
      const idToken = userInfo["idToken"];
      const credential = GoogleAuthProvider.credential(idToken);

      // Sign in with credential from the Google user.
      signInWithCredential(auth, credential).catch((error) => {
        //console.log("error", error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The credential that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {
        setLoading(false);
      });
     
    } catch (error) {
      setLoading(false);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };

  const memoedValue = useMemo(() => {
    return {
      user,
      loading,
      error,
      logout,
      signInwithGoogle,
    };
  }, [user, loading, error]);

  return (
    <AuthContext.Provider
      value={memoedValue}
    >
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
