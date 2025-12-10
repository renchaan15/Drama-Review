    // src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase"; // Import auth dari konfigurasi firebase kita
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

const AuthContext = createContext();

// Custom hook agar kita mudah memanggil user di mana saja
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi Register
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Fungsi Login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Fungsi Logout
  function logout() {
    return signOut(auth);
  }

  // Effect ini berjalan sekali saat aplikasi dimuat untuk cek status user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Bersihkan listener saat unmount
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}