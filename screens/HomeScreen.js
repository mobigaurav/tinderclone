import {
  StyleSheet,
  Image,
  Text,
  View,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import tw from "twrnc";
import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { collection,  onSnapshot , doc, query, setDoc, getDocs, where, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import generateId from "../lib/generateId";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState([]); // [1,2,3,4,5
  const swipeRef = useRef(null);

  useLayoutEffect(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (!snapshot && !snapshot.exists()) {
        navigation.navigate("Modal");
      }
    });
    return unsub();
  }, []);

  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      const passes = await getDocs(collection(db, "users", user.uid, "passes"))
        .then((snapshot) => snapshot.docs.map((doc) => doc.id))
        .catch((err) => {
          console.log(err);
        });

      const swipes = await getDocs(collection(db, "users", user.uid, "swipes"))
        .then((snapshot) => snapshot.docs.map((doc) => doc.id))
        .catch((err) => {
          console.log(err);
        });

      const passedUserIDs = passes.length > 0 ? passes : ["test"];
      const swipedUserIDs = swipes.length > 0 ? swipes : ["test"];

      console.log("passedUserIDs", passedUserIDs);
      console.log("swipedUserIDs", swipedUserIDs);


      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIDs, ...swipedUserIDs])
        ),
        (snapshot) => {
          console.log("snapshot", snapshot.docs);
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };

    fetchCards();
    return unsub;
  }, []);

  const swipeLeft =  (cardIndex) => {
   if (!profiles[cardIndex]) return;
    const profile = profiles[cardIndex];
    setDoc(doc(db, "users", user.uid, "passes", profile.id), profile).catch(err => console.log(err));
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const profile = profiles[cardIndex];
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();

    console.log("profile", profile);
    console.log("loggedInProfile", loggedInProfile);


    getDoc(doc(db, "users", profile.id, "swipes", user.uid)).then((data) => {
      if (data.exists()) {
        setDoc(doc(db, "users", user.uid, "swipes", profile.id), profile);
        // create a match between the two users
        setDoc(doc(db, "matches", generateId(user.uid, profile.id)), {
          users:{
            [user.uid]: loggedInProfile,
            [profile.id]: profile,
          },
          userMatched:[user.uid, profile.id],
          timestamp:serverTimestamp(),
        }).catch(err => console.log(err));

        navigation.navigate('Match', {
          loggedInProfile, 
          profile
        });

    
      } else {
        console.log("swipe right in else");
        setDoc(doc(db, "users", user.uid, "swipes", profile.id), profile);
      }
    }).catch(err => console.log(err));

    
  };

  console.log("profiles", profiles);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View
        style={tw`flex-row  items-center justify-between  px-5`}
      >
        <TouchableOpacity style={tw``} onPress={logout}>
          <Image
            style={tw`h-10 w-10 rounded-full`}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image style={tw`h-20 w-20`} source={require("../logo.png")} />
        </TouchableOpacity>

        <TouchableOpacity
          style={tw``}
          onPress={() => navigation.navigate("Chat")}
        >
          <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>

      <View style={tw`flex-1 -mt-6`}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={3}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  backgroundColor: "red",
                  borderColor: "red",
                  color: "white",
                  borderWidth: 1,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: -30,
                },
              },
            },
            right: {
              title: "LIKE",
              style: {
                label: {
                  backgroundColor: "green",
                  borderColor: "green",
                  color: "white",
                  borderWidth: 1,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw`bg-white h-3/4 rounded-xl relative `}
              >
                <Image
                  style={tw`absolute top-0 h-full w-full rounded-xl`}
                  source={{ uri: card.photoURL }}
                />

                <View
                  style={[
                    tw`absolute 
                flex-row
                justify-between  
                items-center 
                bg-white 
                bottom-0 
                w-full 
                h-20
                px-6
                py-2
                rounded-b-xl
                `,
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw`text-xl font-bold`}>{card.displayName}</Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw`text-2xl font-bold`}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw`bg-white h-3/4 rounded-xl relative justify-center items-center`,
                  styles.cardShadow,
                ]}
              >
                <Text style={tw`font-bold pb-5`}>No more profiles</Text>
              </View>
            )
          }
          onSwipedLeft={(cardIndex) => {
            console.log(cardIndex);
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            console.log(cardIndex);
            swipeRight(cardIndex);
          }}
          cardIndex={0}
          backgroundColor={"#4FD0E9"}
          verticalSwipe={false}
          animateCardOpacity
        ></Swiper>
      </View>
      <View style={tw`flex flex-row justify-evenly`}>
        <TouchableOpacity
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-red-200`}
          onPress={() => swipeRef.current.swipeLeft()}
        >
          <Entypo name="cross" size={50} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-green-200`}
          onPress={() => swipeRef.current.swipeRight()}
        >
          <AntDesign name="heart" size={50} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

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
