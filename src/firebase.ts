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



import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

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

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);