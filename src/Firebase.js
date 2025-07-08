import {initizleApp} from "firebase/app";
import {getFirestore, collection, onSnapshot} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmpfPJYSRF0DFWRVsZb8j_RKjsypbBp6s",
  authDomain: "iti-event.firebaseapp.com",
  projectId: "iti-event",
  storageBucket: "iti-event.firebasestorage.app",
  messagingSenderId: "297628460313",
  appId: "1:297628460313:web:7ca01cd58242ed341dd188",
  measurementId: "G-P350FW37TJ"
};

//initialize firebase
const app = initizleApp(firebaseConfig);
//initialize firestore
const db = getFirestore(app);

export {db, collection, onSnapshot};