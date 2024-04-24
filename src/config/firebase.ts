// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzQ7vK3qggbi-Yam2SHV_WapeV18WUxSE",
  authDomain: "privepay-7bb8c.firebaseapp.com",
  databaseURL: "https://privepay-7bb8c-default-rtdb.firebaseio.com",
  projectId: "privepay-7bb8c",
  storageBucket: "privepay-7bb8c.appspot.com",
  messagingSenderId: "884289053301",
  appId: "1:884289053301:web:f5a4dedf22b8e320814e3c",
  measurementId: "G-HSZC0FR8XQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export {
    app
}