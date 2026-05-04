import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// =============================================
// ضع قيم Firebase هنا من Firebase Console
// Project Settings → Your apps → firebaseConfig
// =============================================
const firebaseConfig = {
  apiKey: "AIzaSyBcMdPvkE4XxZmuuVlVLBDtvye0RdlURoU",
  authDomain: "cortenara-9d0cf.firebaseapp.com",
  projectId: "cortenara-9d0cf",
  storageBucket: "cortenara-9d0cf.firebasestorage.app",
  messagingSenderId: "722283269564",
  appId: "1:722283269564:web:8ac6c14dbcc33f15fa6fb9",
  measurementId: "G-VLH91K0V63"
};
// =============================================

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/drive.file");
googleProvider.addScope("https://www.googleapis.com/auth/youtube.readonly");
googleProvider.addScope("https://www.googleapis.com/auth/yt-analytics.readonly");
googleProvider.setCustomParameters({
  prompt: "consent",
  access_type: "offline",
});
