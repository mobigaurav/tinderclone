import { StyleSheet, Text, View } from "react-native";
import React from "react";
import tw from "twrnc";
const SenderMessage = ({ message }) => {
  console.log("SenderMessage", message);
  return (
    <View
      style={[
        tw`bg-purple-500 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2`,
        { alignSelf: "flex-start", marginLeft: "auto" },
      ]}
    >
      <Text style={tw`text-white`}>{message.message}</Text>
    </View>
  );
};

export default SenderMessage;

const styles = StyleSheet.create({});
