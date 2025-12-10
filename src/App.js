import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- IMPORT COMPONENT NAVBAR BARU ---
import Navbar from './components/Navbar'; 

// Import Halaman
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WatchlistPage from './pages/WatchlistPage'; // Pastikan nama file sesuai
import DramaDetail from './pages/DramaDetail'; // Pastikan sudah ada
import SeriesPage from './pages/SeriesPage';   // Pastikan sudah ada (opsional)
import MoviesPage from './pages/MoviesPage';   // Pastikan sudah ada (opsional)
import ProfilePage from './pages/ProfilePage';
import './App.css'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Panggil Navbar SATU KALI di sini (Navbar Baru) */}
          <Navbar />
          
          <Routes>
            <Route path="/" element={<SearchPage />} />
            
            {/* Route Halaman Tambahan */}
            {/* Jika file SeriesPage/MoviesPage belum ada, bisa dicomment dulu atau diarahkan ke SearchPage */}
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/drama/:id" element={<DramaDetail />} />
            
            {/* Route khusus pencarian */}
            <Route path="/search" element={<SearchPage />} />
            
            {/* Fallback jika halaman tidak ditemukan */}
            <Route path="*" element={<div style={{padding: 50, color: 'white'}}>404 Not Found. <Link to="/" style={{color: 'red'}}>Go Home</Link></div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;