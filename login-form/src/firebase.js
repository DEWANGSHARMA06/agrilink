// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Your Firebase Config (Replace with actual credentials)
const firebaseConfig = {
    apiKey: "AIzaSyBhNOmK2EoPfo_qTXDVIFQ5WDoOjsw6X20",
    authDomain: "users-registered.firebaseapp.com",
    projectId: "users-registered",
    storageBucket: "users-registered.firebasestorage.app",
    messagingSenderId: "849481680658",
    appId: "1:849481680658:web:9c6d6a65b2a320946c15cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase instances
export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword };
