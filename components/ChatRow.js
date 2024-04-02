import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { onSnapshot, query, collection, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { getMatchedUserInfo } from "../lib/getMatchedUserInfo";

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
 
  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        limit(1),
        (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
      ),
    [matchDetails, db]
  );

  //console.log("matchedUserinfo", matchedUserInfo);

  return (
    <>
    <TouchableOpacity
      style={[
        tw`flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg`,
        styles.cardShadow,
      ]}
      onPress={() => {
       // console.log("navigating to messages")
        navigation.navigate("Messages", {
          matchDetails,
        });
      }}
    >
      <Image
        style={tw`h-20 w-20 rounded-full mr-4`}
        source={{ uri: matchedUserInfo?.photoURL }}
      />
      <View>
        <Text style={tw`text-lg font-semibold`}>
          {matchedUserInfo?.displayName}
        </Text>
        <Text>{lastMessage || "Say Hi"}</Text>
      </View>
    </TouchableOpacity>
    </>
  );
};

export default ChatRow;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
