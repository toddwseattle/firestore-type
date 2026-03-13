import { initializeApp } from "firebase/app";
import {
  collection,
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";

const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

function getFirebaseEnv(name: (typeof requiredEnvVars)[number]): string {
  const value = import.meta.env[name];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required environment variable ${name}`);
  }

  return value;
}

const firebaseApp = initializeApp({
  apiKey: getFirebaseEnv("VITE_FIREBASE_API_KEY"),
  authDomain: getFirebaseEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getFirebaseEnv("VITE_FIREBASE_PROJECT_ID"),
  appId: getFirebaseEnv("VITE_FIREBASE_APP_ID"),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});

export const db: Firestore = getFirestore(firebaseApp);

const emulatorHost = import.meta.env.VITE_FIREBASE_EMULATOR_HOST ?? "127.0.0.1";
const emulatorPort = Number(
  import.meta.env.VITE_FIREBASE_EMULATOR_PORT ?? 8080,
);
const shouldUseEmulator =
  import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true" || import.meta.env.DEV;

let emulatorConnected = false;

if (shouldUseEmulator && !emulatorConnected) {
  connectFirestoreEmulator(db, emulatorHost, emulatorPort);
  emulatorConnected = true;
}

export const tasksCollection = collection(db, "tasks");
