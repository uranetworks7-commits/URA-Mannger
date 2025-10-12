import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, push, ref as databaseRef, set, get, child } from "firebase/database";

const xPostFirebaseConfig = {
  apiKey: "AIzaSyA5FgwyJpsNBTpK6hU0TuJni0duOdULI5M",
  authDomain: "advanced-pri-norw123.firebaseapp.com",
  databaseURL: "https://advanced-pri-norw123-default-rtdb.firebaseio.com",
  projectId: "advanced-pri-norw123",
  storageBucket: "advanced-pri-norw123.appspot.com",
  messagingSenderId: "772396412620",
  appId: "1:772396412620:web:9b4664b473abc075e69c69"
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

const gunFightFirebaseConfig = {
    apiKey: "AIzaSyDXNGzvFUtkGlB0pPDW1FOsrkamPNl2HSI",
    authDomain: "gunfightgame-166d9.firebaseapp.com",
    databaseURL: "https://gunfightgame-166d9-default-rtdb.firebaseio.com",
    projectId: "gunfightgame-166d9",
    storageBucket: "gunfightgame-166d9.appspot.com",
    messagingSenderId: "1060940709340",
    appId: "1:1060940709340:web:ad1d94f60524d90b252319"
};

const giftBoxFirebaseConfig = {
  apiKey: "AIzaSyA3BcsYHFGcwgsNp8-p0U5HXZeAIMiYR0Q",
  authDomain: "bitsim-realtrade.firebaseapp.com",
  databaseURL: "https://bitsim-realtrade-default-rtdb.firebaseio.com",
  projectId: "bitsim-realtrade",
  storageBucket: "bitsim-realtrade.appspot.com",
  messagingSenderId: "475728173031",
  appId: "1:475728173031:web:63e0e891c6651bf96ecf42"
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
const chatApp = initializeFirebaseApp(chatFirebaseConfig, "chatApp");
const gunFightApp = initializeFirebaseApp(gunFightFirebaseConfig, "gunFightApp");
const giftBoxApp = initializeFirebaseApp(giftBoxFirebaseConfig, "giftBoxApp");


const xPostDb = getDatabase(xPostApp);
const chatDb = getDatabase(chatApp);
const gunFightDb = getDatabase(gunFightApp);
const giftBoxDb = getDatabase(giftBoxApp);


export { xPostApp, xPostDb, chatApp, chatDb, gunFightApp, gunFightDb, giftBoxApp, giftBoxDb };
export { push, databaseRef, set, get, child };
