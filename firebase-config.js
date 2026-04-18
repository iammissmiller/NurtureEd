import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBC1syQIC5cr-HVjp6tXlD38PcWWjL6Svo",
  authDomain: "nurtureed-9b825.firebaseapp.com",
  projectId: "nurtureed-9b825",
  storageBucket: "nurtureed-9b825.firebasestorage.app",
  messagingSenderId: "231579416905",
  appId: "1:231579416905:web:7b36b513a01af0eba1c298"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

