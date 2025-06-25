// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAmTaNOCVARoex-IKGlpJfG_gMPBp24ZsM",
    authDomain: "dice-breaker.firebaseapp.com",
    projectId: "dice-breaker",
    storageBucket: "dice-breaker.firebasestorage.app",
    messagingSenderId: "1068515540881",
    appId: "1:1068515540881:web:6825775f838699166ca430",
    measurementId: "G-9DNQVWNXZN"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
