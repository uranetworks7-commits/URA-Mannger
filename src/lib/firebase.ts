import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const xPostFirebaseConfig = {
  apiKey: "AIzaSyA...Y-U", // Replace with your X Post API key
  authDomain: "x-post-project.firebaseapp.com", // Replace with your X Post auth domain
  databaseURL: "https://x-post-project-default-rtdb.firebaseio.com", // Replace with your X Post database URL
  projectId: "x-post-project", // Replace with your X Post project ID
  storageBucket: "x-post-project.appspot.com", // Replace with your X Post storage bucket
  messagingSenderId: "123456789012", // Replace with your X Post sender ID
  appId: "1:123456789012:web:abcdef1234567890" // Replace with your X Post app ID
};

const bitcoinFirebaseConfig = {
  apiKey: "AIzaSyA...g-s", // Replace with your Bitcoin API key
  authDomain: "bitcoin-project.firebaseapp.com", // Replace with your Bitcoin auth domain
  databaseURL: "https://bitcoin-project-default-rtdb.firebaseio.com", // Replace with your Bitcoin database URL
  projectId: "bitcoin-project", // Replace with your Bitcoin project ID
  storageBucket: "bitcoin-project.appspot.com", // Replace with your Bitcoin storage bucket
  messagingSenderId: "210987654321", // Replace with your Bitcoin sender ID
  appId: "1:210987654321:web:0987654321fedcba" // Replace with your Bitcoin app ID
};

const chatFirebaseConfig = {
  apiKey: "AIzaSyArPQVGOR1gMWOiGVHVd0XkKFKRVMdWEcU",
  authDomain: "advanced-pri-wol-f66.firebaseapp.com",
  databaseURL: "https://advanced-pri-wol-f66-default-rtdb.firebaseio.com",
  projectId: "advanced-pri-wol-f66",
  storageBucket: "advanced-pri-wol-f66.appspot.com",
  messagingSenderId: "323155912274",
  appId: "1:323155912274:web:3260266198ae14c6e0218b"
};

// Helper to initialize app safely
function initializeFirebaseApp(config: object, appName: string) {
    const existingApp = getApps().find(app => app.name === appName);
    if (existingApp) {
        return existingApp;
    }
    return initializeApp(config, appName);
}

const xPostApp = initializeFirebaseApp(xPostFirebaseConfig, "xPostApp");
const bitcoinApp = initializeFirebaseApp(bitcoinFirebaseConfig, "bitcoinApp");
const chatApp = initializeFirebaseApp(chatFirebaseConfig, "chatApp");

const xPostDb = getDatabase(xPostApp);
const bitcoinDb = getDatabase(bitcoinApp);
const chatDb = getDatabase(chatApp);

export { xPostApp, xPostDb, bitcoinApp, bitcoinDb, chatApp, chatDb };
