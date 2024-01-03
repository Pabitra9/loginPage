// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from "firebase/auth"

import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSnPZHGaLOrnBfYEyCPLhQ7bR3oSP5nbY",
  authDomain: "user-directory-database.firebaseapp.com",
  projectId: "user-directory-database",
  storageBucket: "user-directory-database.appspot.com",
  messagingSenderId: "862802657562",
  appId: "1:862802657562:web:8a12811a6eb5639830aca3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const storage = getStorage (app) ;
export const db = getFirestore (app);