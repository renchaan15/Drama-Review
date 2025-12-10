import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Salin config ini dari Firebase Console (sama seperti yang Anda pakai di Flutter)
const firebaseConfig = {
  apiKey: "AIzaSyAozfBHDWPc3cM_Ia2ew8CrWx_CtmQFafE",
  authDomain: "drama-review-app.firebaseapp.com",
  projectId: "drama-review-app",
  storageBucket: "drama-review-app.firebasestorage.app",
  messagingSenderId: "532660839767",
  appId: "1:532660839767:web:a306927ba0ba164fa2ca12"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);