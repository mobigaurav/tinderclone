import {
  TouchableOpacity,
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  Touchable,
  View,
} from "react-native";
import React, { useLayoutEffect } from "react";
import useAuth from "../hooks/useAuth";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";

const LoginScreen = () => {
  //const { signInwithGoogle } = useAuth();
  const { user, signInwithGoogle, loading } = useAuth();
  const navigation = useNavigation();
 
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <View style={tw`flex-1`}>
      {/* <Text>{loading? "loading...":"Login to the app"}</Text>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signInwithGoogle}
      /> */}
      <ImageBackground
        resizeMode="cover"
        style={tw`flex-1`}
        source={{ uri: "https://tinder.com/static/tinder.png" }}
      >
        <TouchableOpacity
          onPress={signInwithGoogle}
          style={[tw`absolute bottom-40 w-52 bg-white p-4 rounded-2xl`, { marginHorizontal: "25%" }]}
        >
          <Text style={tw`font-semibold text-center`}>Sign in & get swiping</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
