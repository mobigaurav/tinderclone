import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import { Header } from '../components/Header';
import ChatList from '../components/ChatList';

const ChatScreen = () => {
  return (
    <SafeAreaView>
     <Header title="Chat" callEnabled/>
     <ChatList />
    </SafeAreaView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({})