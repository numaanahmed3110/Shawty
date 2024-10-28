// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcnXc6hJXL815g_v0FYbHGvwWGiN7mSJ0",
  authDomain: "shawty-502ac.firebaseapp.com",
  projectId: "shawty-502ac",
  storageBucket: "shawty-502ac.appspot.com",
  messagingSenderId: "346465169902",
  appId: "1:346465169902:web:c5413e53a7c5c543b11eff",
  measurementId: "G-SGEYS2Z39F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
