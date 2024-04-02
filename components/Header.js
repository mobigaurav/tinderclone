import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export const Header = ({ title, callEnabled }) => {
  const navigation = useNavigation();
  return (
    <View style={tw`p-2 flex-row items-center justify-between`}>
      <View style={tw`flex flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
          <Ionicons name="chevron-back-outline" size={34} color="#FF5864" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold pl-2`}>{title}</Text>
      </View>
      {callEnabled && (
        <TouchableOpacity style={tw`p-2 rounded-full mr-4 bg-red-200`}>
          <Foundation name="telephone" size={24} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};

//export default Header;
