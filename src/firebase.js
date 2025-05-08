// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBoKQn7xxji6XtAIeZW8rHaQKgiEOVAB8k",
  authDomain: "tasktap-b9d09.firebaseapp.com",
  projectId: "tasktap-b9d09",
  storageBucket: "tasktap-b9d09.firebasestorage.app",
  messagingSenderId: "690441611133",
  appId: "1:690441611133:web:3dd038f484ab9e334c4e14",
  measurementId: "G-ZES2DEE7KS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
