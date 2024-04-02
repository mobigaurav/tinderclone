import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import React, {useState} from "react";
import tw from "twrnc";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Image } from "react-native";

const ModalScreen = () => {
  const { user } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);
  const navigation = useNavigation();
  const incompleteForm = !profilePic || !job || !age;
  const updateUserProfile = () => {
    if (incompleteForm) return;
    // Update the user profile
     setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: profilePic,
        job:job,
        age:age,
        timestamp: serverTimestamp(),
  }).then(()=>{
    navigation.navigate("Home");
  }).catch(error=> {
    console.log("Error updating user profile", error.message)
  });
};
  return (
    <View style={tw`flex-1 items-center pt-1`}>
      <Image
        source={{ uri: "https://links.papareact.com/2pf" }}
        resizeMode="contain"
        style={tw`w-full h-24`}
      />
      <Text style={tw`text-xl text-gray-500 p-2 font-bold`}>
        Welcome {user.displayName}
      </Text>

      <Text style={tw`text-center p-4 font-bold text-red-400`}>
        Step1: The Profile Pic
      </Text>
      <TextInput
        value={profilePic}
        onChangeText={(text) => setProfilePic(text)}
        style={tw`text-center text-xl pb-2`}
        placeholder="Enter a profile pic url"
      />

      <Text style={tw`text-center p-4 font-bold text-red-400`}>
        Step2: The Job
      </Text>
      <TextInput
        value={job}
        onChangeText={(text) => setJob(text)}
        style={tw`text-center text-xl pb-2`}
        placeholder="Enter your occupation"
      />

      <Text style={tw`text-center p-4 font-bold text-red-400`}>
        Step2: The Age
      </Text>
      <TextInput
        value={age}
        onChangeText={(text) => setAge(text)}
        style={tw`text-center text-xl pb-2`}
        placeholder="Enter your age"
        maxLength={2}
        keyboardType="number-pad"
      />
      <TouchableOpacity
        disabled={incompleteForm}
        onPress={updateUserProfile}
        style={[tw`w-64 p-3 rounded-xl absolute bottom-10 bg-red-400`, 
        incompleteForm && tw`bg-gray-300`]}
      >
        <Text style={tw`text-center text-white text-xl`}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({});
