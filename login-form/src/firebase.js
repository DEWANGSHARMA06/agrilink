// // Import Firebase modules
// import { initializeApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// // 🔥 Your Firebase Config (Replace with actual credentials)
// const firebaseConfig = {
//     apiKey: "AIzaSyCsJniBaoMRhfLAxtwZcL-IbMe_PtMF9Xk",
//   authDomain: "agrilink-99627.firebaseapp.com",
//   projectId: "agrilink-99627",
//   storageBucket: "agrilink-99627.firebasestorage.app",
//   messagingSenderId: "96428598095",
//   appId: "1:96428598095:web:24b6180e23d363d60e1b3a",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const analytics = getAnalytics(app);

// // Export Firebase instances
// export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword };


import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// 🔥 Your Firebase Config (Existing Project)
const firebaseConfig = {
  apiKey: "AIzaSyCsJniBaoMRhfLAxtwZcL-IbMe_PtMF9Xk",
  authDomain: "agrilink-99627.firebaseapp.com",
  projectId: "agrilink-99627",
  storageBucket: "agrilink-99627.appspot.com",
  messagingSenderId: "96428598095",
  appId: "1:96428598095:web:24b6180e23d363d60e1b3a",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// ✅ Export Firebase Services
export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword };
