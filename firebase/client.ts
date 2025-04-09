// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLVATQsScHQGJlJkF4pOs4jYc2xW3s2sc",
  authDomain: "prepwise-585a2.firebaseapp.com",
  projectId: "prepwise-585a2",
  storageBucket: "prepwise-585a2.firebasestorage.app",
  messagingSenderId: "628093151507",
  appId: "1:628093151507:web:7c968d732962a40ac752e6",
  measurementId: "G-WYYBPEZQ3J",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
