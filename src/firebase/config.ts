import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArRKVB-pK53yujxdCRW6y32Pvp4GYB0AU",
  authDomain: "karkhana-44b9f.firebaseapp.com",
  projectId: "karkhana-44b9f",
  storageBucket: "karkhana-44b9f.firebasestorage.app",
  messagingSenderId: "43875533152",
  appId: "1:43875533152:web:de502683bbb1a8268b9e05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;