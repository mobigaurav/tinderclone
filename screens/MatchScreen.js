import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";

const MatchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { loggedInProfile, profile } = route.params;
  return (
    <View style={[tw`h-full bg-red-500 pt-20`, { opacity: 0.9 }]}>
      <View style={tw`justify-center px-10 pt-20`}>
        <Image style={tw`h-20 w-full`} source={{ uri: "https://links.papareact.com/mg9" }} />
      </View>
      <Text style={tw`text-white text-center mt-5`}>
        You and {profile.displayName} have liked each other
      </Text>
      <View style={tw`flex-row justify-evenly mt-5`}>
        <Image source={{ uri: profile.photoURL }} style={tw`w-20 h-20 rounded-full`} />
        <Image source={{ uri: loggedInProfile.photoURL }} style={tw`w-20 h-20 rounded-full`} />
      </View>

      <TouchableOpacity 
      style={tw`bg-white m-5 px-10 py-8 rounded-full mt-20`}
        onPress={() => { 
            navigation.goBack();
            navigation.navigate("Chat");
        }}
      >
        <Text style={tw`text-center`}>Send a Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchScreen;

const styles = StyleSheet.create({});
