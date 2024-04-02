import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc";
import { onSnapshot, where, query, collection } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';
import { db } from "../firebase";
import ChatRow from './ChatRow';

const ChatList = () => {
  const [matches, setMatches] = React.useState([]);
  const { user } = useAuth();

  useEffect(
    () => 
    onSnapshot(
        query(
            collection(db, 'matches'), 
            where('userMatched', 'array-contains', user.uid)
        ),
        (snapshot) => {
            setMatches(snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })));
        }
    ),
    [user]
  )
 
  return (
      matches.length > 0 ? (
        <FlatList 
          style={tw`h-full`}
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => <ChatRow matchDetails={item} />}
        
        />
      ): (
        <View style={tw`flex-1 justify-center items-center p-5`}>
            <Text style={tw`text-xl text-center`}>No matches yet</Text>
        </View>
      )
     
  )
}

export default ChatList

const styles = StyleSheet.create({})