// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from "firebase/auth"; // добавьте все необходимые импорты для Firebase
import { getFunctions } from 'firebase/functions';  // Импорт для Firebase Functions

// Конфигурация из Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCyM6jlzaDRqhsyE3DEH8IwDjA5N-QSsaI",
    authDomain: "gamerblocker-a64e1.firebaseapp.com",
    projectId: "gamerblocker-a64e1",
    storageBucket: "gamerblocker-a64e1.firebasestorage.app",
    messagingSenderId: "26812026645",
    appId: "1:26812026645:web:21476ea5d7954b214ca31c",
    measurementId: "G-RTVR7EXNQB"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// ✅ Правильная инициализация auth с AsyncStorage
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Инициализация Firestore
const db = getFirestore(app);

// ✅ Инициализация Cloud Functions
const functions = getFunctions(app);  // Инициализация Firebase Functions

// ✅ Экспорт всех нужных модулей
export { app, auth, db, functions };
