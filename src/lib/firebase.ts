import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const xPostFirebaseConfig = {
  apiKey: "AIzaSyA5FgwyJpsNBTpK6hU0TuJni0duOdULI5M",
  authDomain: "advanced-pri-norw123.firebaseapp.com",
  databaseURL: "https://advanced-pri-norw123-default-rtdb.firebaseio.com",
  projectId: "advanced-pri-norw123",
  storageBucket: "advanced-pri-norw123.appspot.com",
  messagingSenderId: "772396412620",
  appId: "1:772396412620:web:9b4664b473abc075e69c69"
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
