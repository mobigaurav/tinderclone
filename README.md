## Technology Stack

Expo
React-Native
Tailwind-CSS
React-Navigation
Context-API
Firebase

# Some of the credentials files are not committed for security purpose

firebase.js file is not committed but you can create it in root folder and add below entries

## Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

## TODO: Add SDKs for Firebase products that you want to use

## https://firebase.google.com/docs/web/setup#available-libraries

## Your web app's Firebase configuration

## For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
apiKey: "",
authDomain: "",
projectId: "",
storageBucket: "",
messagingSenderId: "",
appId: "",
measurementId: ""
};

# Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const db = getFirestore();

export { auth, db };

# Download the project and follow below steps

yarn install
yarn expo start

# to run on android

yarn expo run:android

# to run on iOS

yarn expo run:ios
