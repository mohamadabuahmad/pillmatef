// import { getApps, initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT.appspot.com",
//   messagingSenderId: "XXXX",
//   appId: "XXXX",
// };


// const firebaseConfig = {
//   apiKey: "AIzaSyBBcVtzSBPGNq9CmbDEnuGUkkIg9iuApQY",
//   authDomain: "pillmate-cc6cd.firebaseapp.com",
//   projectId: "pillmate-cc6cd",
//   storageBucket: "pillmate-cc6cd.firebasestorage.app",
//   messagingSenderId: "149620387080",
//   appId: "1:149620387080:web:899c45cef52dbc290790bd",
//   measurementId: "G-GDHTKCD6TS"
// };

// const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getFirestore(app);

// import { getApps, initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getDatabase } from "firebase/database";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBBcVtzSBPGNq9CmbDEnuGUkkIg9iuApQY",
//   authDomain: "pillmate-cc6cd.firebaseapp.com",
//   projectId: "pillmate-cc6cd",
//   storageBucket: "pillmate-cc6cd.firebasestorage.app",
//   messagingSenderId: "149620387080",
//   appId: "1:149620387080:web:899c45cef52dbc290790bd",
//   measurementId: "G-GDHTKCD6TS",
//   databaseURL: "https://pillmate-cc6cd-default-rtdb.asia-southeast1.firebasedatabase.app" // Add your RTDB URL
// };

// const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const rtdb = getDatabase(app);



import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// getReactNativePersistence exists in firebase/auth but TypeScript types may not be updated
// Import it with type assertion to bypass TypeScript error
import * as firebaseAuth from "firebase/auth";
const getReactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const firebaseConfig = {
  apiKey: "AIzaSyBBcVtzSBPGNq9CmbDEnuGUkkIg9iuApQY",
  authDomain: "pillmate-cc6cd.firebaseapp.com",
  projectId: "pillmate-cc6cd",
  storageBucket: "pillmate-cc6cd.firebasestorage.app",
  messagingSenderId: "149620387080",
  appId: "1:149620387080:web:899c45cef52dbc290790bd",
  measurementId: "G-GDHTKCD6TS",
  databaseURL: "https://pillmate-cc6cd-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
// Handle case where auth might already be initialized (e.g., during hot reload)
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error: any) {
  // If auth is already initialized, get the existing instance
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

export { auth };

export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// Initialize Functions with explicit region (us-central1 where functions are deployed)
// ✅ CORRECT: Region matches function deployment region
// ✅ CORRECT: Functions instance uses same app as auth
// 
// IMPORTANT: getFunctions() automatically gets auth from the app instance
// The functions instance is created at module load, but httpsCallable will
// check auth.currentUser when called, not when the instance is created
export const functions = getFunctions(app, 'us-central1');

// Helper function to get a fresh functions instance (in case auth state changes)
// This ensures we always get a functions instance linked to the current auth state
export const getFunctionsInstance = () => {
  return getFunctions(app, 'us-central1');
};