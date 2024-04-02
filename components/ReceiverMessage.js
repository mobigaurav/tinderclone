import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import tw from "twrnc";
const ReceiverMessage = ({ message }) => {
  console.log("ReceiverMessage", message);
  return (
    <View
      style={[
        tw`bg-red-500 rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2 ml-14`,
        { alignSelf: "flex-start" },
      ]}
    >
      <Image
        source={{ uri: message.photoURL }}
        style={tw`w-10 h-10 rounded-full absolute top-0 -left-14`}
      />
      <Text style={tw`text-white`}>{message.message}</Text>
    </View>
  );
};

export default ReceiverMessage;

const styles = StyleSheet.create({});
