// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1ed8mAkaMnDVVrY-Pu8rPPJAkE5O8SWE",
  authDomain: "prive-pay.firebaseapp.com",
  databaseURL: "https://prive-pay-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "prive-pay",
  storageBucket: "prive-pay.appspot.com",
  messagingSenderId: "393961825543",
  appId: "1:393961825543:web:243e0d9b11ca97ea5591a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {
    app as PrivePay
}