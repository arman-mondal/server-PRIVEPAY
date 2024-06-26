"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// Import the functions you need from the SDKs you need
var app_1 = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
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
var app = (0, app_1.initializeApp)(firebaseConfig);
exports.app = app;
