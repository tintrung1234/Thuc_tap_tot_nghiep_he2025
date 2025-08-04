// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';  // optional
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const Firebase_Key = import.meta.env.VITE_FIREBASEKEY
const firebaseConfig = {
  apiKey: Firebase_Key,
  authDomain: "webblog-fcb1c.firebaseapp.com",
  projectId: "webblog-fcb1c",
  storageBucket: "webblog-fcb1c.firebasestorage.app",
  messagingSenderId: "1051642793375",
  appId: "1:1051642793375:web:2dcecd8a867cc9102201aa",
  measurementId: "G-Z788690JW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional exports
export const auth = getAuth(app);

export default app;