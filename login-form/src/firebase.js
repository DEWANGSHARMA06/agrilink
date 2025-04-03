import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// 🔥 Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCsJniBaoMRhfLAxtwZcL-IbMe_PtMF9Xk",
  authDomain: "agrilink-99627.firebaseapp.com",
  projectId: "agrilink-99627",
  storageBucket: "agrilink-99627.appspot.com", // ✅ Fixed storage bucket typo
  messagingSenderId: "96428598095",
  appId: "1:96428598095:web:24b6180e23d363d60e1b3a",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Initialize Analytics (only in browser)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

/**
 * 🛒 Function to Add Product to Firestore
 * @param {Object} productData - Product details
 */
const addProductToFirestore = async (productData) => {
  try {
    const adsCollection = collection(db, "ads");
    const docRef = await addDoc(adsCollection, {
      ...productData,
      createdAt: serverTimestamp(),
    });

    console.log("Product listed with ID:", docRef.id);
    return docRef.id; // Returning the document ID (optional)
  } catch (error) {
    console.error("Error adding product:", error);
    throw error; // Handle errors in the calling function
  }
};

// ✅ Export Firebase Services
export {
  app,
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  analytics,
  addProductToFirestore, // 🆕 Exporting new function
};
