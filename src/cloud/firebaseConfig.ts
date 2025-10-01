import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import properties from '../server/properties.js';

const firebaseConfig = properties.FIREBASE_CREDENTIALS;
// Evita inicializar Firebase más de una vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const DB = getFirestore(app);
const Storage = getStorage(app);
const Functions = getFunctions(app);

export { DB, Storage, Functions };
