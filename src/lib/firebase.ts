import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA5FgwyJpsNBTpK6hU0TuJni0duOdULI5M",
  authDomain: "advanced-pri-norw123.firebaseapp.com",
  databaseURL: "https://advanced-pri-norw123-default-rtdb.firebaseio.com",
  projectId: "advanced-pri-norw123",
  storageBucket: "advanced-pri-norw123.appspot.com",
  messagingSenderId: "772396412620",
  appId: "1:772396412620:web:9b4664b473abc075e69c69"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { app, db };
