// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBEWUmOfEs537hqunfHbH0tF6gOFU-uqIM",
    authDomain: "password-generator-3954f.firebaseapp.com",
    projectId: "password-generator-3954f",
    storageBucket: "password-generator-3954f.appspot.com",
    messagingSenderId: "312441061500",
    appId: "1:312441061500:web:39448f21df2e57ec1b09f9",
    measurementId: "G-2PBW77J5J2"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;