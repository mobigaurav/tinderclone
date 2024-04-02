import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import useAuth from "../hooks/useAuth";
import { useRoute } from "@react-navigation/native";
import { getMatchedUserInfo } from "../lib/getMatchedUserInfo";
import tw from "twrnc";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import { addDoc, serverTimestamp, collection, onSnapshot, orderBy,query } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { matchDetails } = params;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  useEffect(() => 
    onSnapshot(
        query(
        collection(db, 'matches', matchDetails.id, 'messages'), 
        orderBy('timestamp', 'asc')
        ), 
        (snapshot) => 
        setMessages(snapshot.docs.map((doc) => ({ 
            id: doc.id, 
            ...doc.data() 
        }))
        )
    ),

      [matchDetails, db]
  );

  //console.log('messages are', messages);
  //console.log('users are', user);

  const userName = getMatchedUserInfo(matchDetails?.users, user.uid).displayName;
  const sendMessage = () => {
    addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
        timestamp:serverTimestamp(),
        userId: user.uid,
        displayName: user.displayName,
        photoURL:matchDetails.users[user.uid].photoURL,
        message: input,
    })
    setInput("");
  };
  return (
    <SafeAreaView style={tw`flex-1`}>
      <Header
        title={userName}
        callEnabled
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <FlatList
               data={messages}
               //inverted={-1}
               style={[tw`pl-4`, {  transform: [{ scaleY: 1 }] }]}
               keyExtractor={(item) => item.id}
               renderItem={({ item: message }) => {
                return message.userId === user.uid ? (
                    <SenderMessage key={message.id} message={message} />
                ): (
                    <ReceiverMessage key={message.id} message={message} />
                );
               }}

               />
        </TouchableWithoutFeedback>
    
        <View
          style={tw`flex-row bg-white justify-between items-center border-t border-gray-200 px-5 py-2`}
        >
          <TextInput
            style={tw`h-10 text-lg px-4`}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message"
            onSubmitEditing={sendMessage}
          />
          <Button title="Send" onPress={sendMessage} color="#FF5864" />
        </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Messages;

const styles = StyleSheet.create({});
